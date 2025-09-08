// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Enums;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Types;

[ExtendObjectType<IGridArea>]
public class GridAreaInterface
{
    public PriceAreaCode GetPriceAreaCode([Parent] IGridArea gridarea) =>
        gridarea.PriceAreaCode.ToUpper() switch
        {
            "DK1" => PriceAreaCode.Dk1,
            "DK2" => PriceAreaCode.Dk2,
            _ => throw new ArgumentException(),
        };

    public string DisplayName([Parent] IGridArea gridarea) => gridarea switch
    {
        null => string.Empty,
        var gridArea when string.IsNullOrWhiteSpace(gridArea.Name) => gridArea.Code,
        var gridArea => $"{gridArea.Code} • {gridArea.Name}",
    };

    public async Task<GridAreaStatus> StatusAsync(
        [Parent] IGridArea gridarea,
        IResolverContext context)
    {
        var validFrom = gridarea.ValidFrom;
        var validTo = gridarea.ValidTo;

        var consolidation = await context
            .DataLoader<IActorConsolidationByGridAreaIdDataLoader>()
            .LoadAsync(gridarea.Code);

        if (consolidation?.ConsolidateAt > DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.ToBeDiscontinued;
        }

        if (validFrom > DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Created;
        }

        if (validTo < DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Expired;
        }

        if (validFrom <= DateTimeOffset.UtcNow && validTo >= DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Active;
        }

        if (validFrom <= DateTimeOffset.UtcNow && validTo == null)
        {
            return GridAreaStatus.Active;
        }

        return GridAreaStatus.Archived;
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, ActorConsolidationDto?>>
        GetActorConsolidationByGridAreaIdAsync(
            IReadOnlyList<string> keys,
            IGridAreasClient gridAreasClient,
            IMarketParticipantClient_V1 marketParticipantClient,
            CancellationToken cancellationToken)
    {
        var actorConsolidationsTask = marketParticipantClient.ActorConsolidationsAsync(cancellationToken);
        var gridAreas = (await gridAreasClient.GetGridAreasAsync(cancellationToken))
            .Where(x => keys.Contains(x.Code))
            .Select(x => (x.Id, x.Code))
            .ToDictionary();

        var actors = (await marketParticipantClient
            .ActorGetAsync(cancellationToken))
            .Where(x =>
                x.MarketRole.GridAreas.Any(y => gridAreas.ContainsKey(y.Id)) &&
                x.MarketRole.EicFunction == EicFunction.GridAccessProvider);

        var consolidations = (await actorConsolidationsTask).ActorConsolidations;

        var returnDict = new Dictionary<string, ActorConsolidationDto?>();
        foreach (var gridArea in gridAreas)
        {
            var actor = actors.FirstOrDefault(x => x.MarketRole.GridAreas.Any(x => x.Id == gridArea.Key));
            if (actor is null)
            {
                returnDict.Add(gridArea.Value, null);
                continue;
            }

            var consolidation = consolidations.FirstOrDefault(x => x.ActorFromId == actor.ActorId);
            returnDict.Add(gridArea.Value, consolidation);
        }

        return returnDict;
    }
}
