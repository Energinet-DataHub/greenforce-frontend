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
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;

public class GridAreasClient(IMarketParticipantClient_V1 client) : IGridAreasClient
{
    public async Task<GridAreaOverviewItemDto> GetGridAreaOverviewItemByIdAsync(Guid gridAreaId) =>
        (await client.GridAreaOverviewAsync()).First(x => x.Id == gridAreaId);

    public async Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewItemsAsync() =>
        await client.GridAreaOverviewAsync();

    public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(CancellationToken ct = default)
    {
        var actorsTask = client.ActorGetAsync(ct);
        var gridAreasTask = client.GridAreaGetAsync(ct);
        var actors = await actorsTask;
        var gridAreas = await gridAreasTask;

        // TODO: Does this do anything?
        var consolidations = await client.ActorConsolidationsAsync(ct);

        return gridAreas
            .OrderBy(g => g.Code)
            .Select(gridArea =>
            {
                var owner = actors.FirstOrDefault(actor =>
                    actor.Status == "Active" &&
                    actor.MarketRole.EicFunction == EicFunction.GridAccessProvider &&
                    actor.MarketRole.GridAreas.Any(ga => ga.Id == gridArea.Id));

                return owner == null
                    ? gridArea
                    : new GridAreaDto
                    {
                        Id = gridArea.Id,
                        Code = gridArea.Code,
                        Name = owner.Name.Value,
                        PriceAreaCode = gridArea.PriceAreaCode,
                        ValidFrom = gridArea.ValidFrom,
                        ValidTo = gridArea.ValidTo,
                        Type = gridArea.Type,
                    };
            });
    }

    public async Task<IEnumerable<GridAreaDto>> GetRelevantGridAreasAsync(
        Guid actorId,
        Interval period,
        CancellationToken ct = default)
    {
        var actorTask = client.ActorGetAsync(actorId);
        var gridAreasTask = GetGridAreasAsync();
        var actor = await actorTask;
        var gridAreas = await gridAreasTask;

        var filteredByDateGridAreas = gridAreas.Where(ga => DoDatesOverlap(ga, period.Start.ToDateTimeOffset(), period.End.ToDateTimeOffset()));
        if (ShowAllGridareas(actor))
        {
            return filteredByDateGridAreas;
        }

        var actorGridAreaIds = actor.MarketRole.GridAreas.Select(ga => ga.Id);
        var relevantGridAreas = filteredByDateGridAreas.Where(ga => actorGridAreaIds.Contains(ga.Id));

        return relevantGridAreas;
    }

    private static bool DoDatesOverlap(GridAreaDto gridArea, DateTimeOffset startDate, DateTimeOffset endDate)
    {
        var convertedStartDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(startDate, "Romance Standard Time");
        var convertedEndDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(endDate.AddMilliseconds(-1), "Romance Standard Time");

        if (!gridArea.ValidTo.HasValue)
        {
            return gridArea.ValidFrom <= convertedEndDate;
        }

        // formula from https://www.baeldung.com/java-check-two-date-ranges-overlap
        var overlap = Math.Min(gridArea.ValidTo.Value.Ticks, convertedEndDate.Ticks) - Math.Max(gridArea.ValidFrom.Ticks, convertedStartDate.Ticks);
        return overlap >= 0;
    }

    private static bool ShowAllGridareas(ActorDto actor)
    {
        return actor.MarketRole.EicFunction is EicFunction.EnergySupplier or EicFunction.SystemOperator or EicFunction.DataHubAdministrator;
    }
}
