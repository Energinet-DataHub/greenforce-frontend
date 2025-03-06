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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Types;

[ObjectType<ActorDto>]
public static partial class ActorStatusType
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorConsolidationDto>> GetConsolidationByActorFromIdAsync(
            IReadOnlyList<Guid> keys,
            [Service] IMarketParticipantClient_V1 client,
            CancellationToken cancellationToken)
    {
        var consolidations = (await client.ActorConsolidationsAsync(cancellationToken)).ActorConsolidations;

        return consolidations
            .Select(c => new KeyValuePair<Guid, ActorConsolidationDto>(c.ActorFromId, c))
            .DistinctBy(c => c.Key)
            .ToDictionary();
    }

    public static async Task<ActorStatus> GetStatusAsync(
       [Parent] ActorDto actor,
       ConsolidationByActorFromIdDataLoader dataLoader)
    {
        var actorConsolidation = await dataLoader.LoadAsync(actor.ActorId).ConfigureAwait(false);

        if (actorConsolidation is null)
        {
            return Enum.Parse<ActorStatus>(actor.Status);
        }

        if (actorConsolidation.ConsolidateAt < DateTimeOffset.UtcNow)
        {
            return ActorStatus.Discontinued;
        }

        return ActorStatus.ToBeDiscontinued;
    }
}
