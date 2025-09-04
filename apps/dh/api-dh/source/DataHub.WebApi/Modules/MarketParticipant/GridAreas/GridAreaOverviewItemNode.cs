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

using System.Text.RegularExpressions;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Enums;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Extensions;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Http.Features;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;

[ObjectType<GridAreaOverviewItemDto>]
public static partial class GridAreaOverviewItemNode
{
    [Query]
    public static async Task<GridAreaOverviewItemDto> GetGridAreaOverviewItemByIdAsync(
        Guid gridAreaId,
        IGridAreasClient client) =>
        await client.GetGridAreaOverviewItemByIdAsync(gridAreaId);

    [Query]
    [UsePaging(MaxPageSize = 10_000)]
    [UseSorting]
    public static async Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewItemsAsync(
        GridAreaType? type,
        GridAreaStatus[]? statuses,
        string? filter,
        IGridAreasClient client)
    {
        var response = await client.GetGridAreaOverviewItemsAsync();

        var filtered = new List<GridAreaOverviewItemDto>();

        foreach (var item in response)
        {
            var matchesFilter = filter == null ||
                item.Code.Contains(filter, StringComparison.OrdinalIgnoreCase) ||
                item.Name.Contains(filter, StringComparison.OrdinalIgnoreCase) ||
                (item.ActorName != null && item.ActorName.Contains(filter, StringComparison.OrdinalIgnoreCase)) ||
                (item.ActorNumber != null && item.ActorNumber.Contains(filter, StringComparison.OrdinalIgnoreCase)) ||
                (item.OrganizationName != null && item.OrganizationName.Contains(filter, StringComparison.OrdinalIgnoreCase)) ||
                item.Type.ToString().Contains(filter, StringComparison.OrdinalIgnoreCase);

            var matchesType = type == null || item.Type == type;
            var matchesStatus = statuses == null || statuses.Contains(item.Status());

            if (matchesFilter && matchesType && matchesStatus)
            {
                filtered.Add(item);
            }
        }

        return filtered;
    }

    public static string Actor([Parent] GridAreaOverviewItemDto gridArea) => gridArea.Actor();

    public static async Task<IEnumerable<GridAreaAuditedChangeAuditLogDto>> AuditLogAsync(
        [Parent] GridAreaOverviewItemDto gridArea,
        IMarketParticipantClient_V1 client) =>
        await client.GridAreaAuditAsync(gridArea.Id);
}
