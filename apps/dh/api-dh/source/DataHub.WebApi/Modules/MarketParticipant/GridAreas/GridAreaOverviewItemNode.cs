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
    public static async Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewItemsAsync(
        IGridAreasClient client) =>
        await client.GetGridAreaOverviewItemsAsync();

    public static string Actor([Parent] GridAreaOverviewItemDto gridArea)
    {
        var actorNumber = gridArea.ActorNumber;
        var actorName = gridArea.ActorName;

        var glnRegex = new Regex("^[0-9]+$");

        if (string.IsNullOrEmpty(actorName) || string.IsNullOrEmpty(actorNumber))
        {
            return string.Empty;
        }

        return $"{actorName} • {(glnRegex.IsMatch(actorNumber) ? "GLN" : "EIC")} {actorNumber}";
    }

    public static async Task<IEnumerable<GridAreaAuditedChangeAuditLogDto>> AuditLogAsync(
        [Parent] GridAreaOverviewItemDto gridArea,
        IMarketParticipantClient_V1 client) =>
        await client.GridAreaAuditAsync(gridArea.Id);
}
