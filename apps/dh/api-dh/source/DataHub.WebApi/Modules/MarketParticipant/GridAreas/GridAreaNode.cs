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
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;

[ObjectType<GridAreaDto>]
public static partial class GridAreaNode
{
    [Query]
    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        CancellationToken ct,
        IGridAreasClient client) =>
        await client.GetGridAreasAsync(ct);

    [Query]
    public static async Task<IEnumerable<GridAreaDto>> GetRelevantGridAreasAsync(
        Guid? actorId,
        PeriodInput period,
        CancellationToken ct,
        IGridAreasClient client)
    {
        var interval = period.ToIntervalOrThrow();
        var gridAreas = await client.GetRelevantGridAreasAsync(actorId, interval, ct);

        // HACK: The special grid area "312" is expired from 2024-01-01, but is not actually
        // inactive until 2027. It must always be excluded from periods after 2024-01-01.
        DateTime firstOfJanuary2024 = new DateTime(2024, 1, 1, 0, 0, 0);
        TimeZoneInfo danishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
        DateTimeOffset expiredEndDateForGridArea312 = new DateTimeOffset(
            firstOfJanuary2024,
            danishTimeZone.GetUtcOffset(firstOfJanuary2024));

        return gridAreas.Where(g => g.Code != "312" || interval.End.ToDateTimeOffset() <= expiredEndDateForGridArea312);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, GridAreaDto>> GetGridAreaByCodeAsync(
        IReadOnlyList<string> keys,
        IGridAreasClient client,
        CancellationToken ct)
    {
        var gridAreas = await client.GetGridAreasAsync(ct);
        return gridAreas
            .Select(g => new KeyValuePair<string, GridAreaDto>(g.Code, g))
            .ToDictionary();
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, GridAreaDto>> GetGridAreaByIdAsync(
        IReadOnlyList<Guid> keys,
        IGridAreasClient client,
        CancellationToken ct)
    {
        var gridAreas = await client.GetGridAreasAsync(ct);
        return gridAreas
            .Select(g => new KeyValuePair<Guid, GridAreaDto>(g.Id, g))
            .ToDictionary();
    }

    public static bool IncludedInCalculation(
        [Parent] IGridArea gridArea,
        string? environment) =>
        gridArea.Type switch
        {
            GridAreaType.Aboard or
            GridAreaType.NotSet or
            GridAreaType.Test => false,
            GridAreaType.Transmission or
            GridAreaType.Distribution or
            GridAreaType.GridLossDK or
            GridAreaType.Other or
            GridAreaType.GridLossAbroad =>
                // HACK: Prevent excessive errors on Test001 and PreProd by removing grid areas
                //       that does not include the required data for calculation. Must be kept
                //       manually in sync when new grid areas are added.
                gridArea.Code switch
                {
                    "533" or "543" or "584" or "803" or "804" or "950"
                        when environment is AppEnvironment.Test001 => false,
                    "003" or "007" or "016" or "031" or "051" or "085" or "131" or "151" or
                    "154" or "244" or "245" or "341" or "342" or "344" or "348" or "466" or
                    "484" or "531" or "533" or "543" or "740" or "791" or "804" or "853" or
                    "899" or "900" or "901" or "902" or "903" or "906" or "911" or "921" or
                    "922" or "927" or "939" or "989"
                        when environment is AppEnvironment.PreProd => false,
                    _ => true,
                },
        };
}
