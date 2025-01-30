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

/// <summary>
/// Client for fetching grid areas from the market participant service.
/// </summary>
public interface IGridAreasClient
{
    /// <summary>
    /// Get a GridAreaOverviewItem by id.
    /// </summary>
    Task<GridAreaOverviewItemDto> GetGridAreaOverviewItemByIdAsync(Guid gridAreaId);

    /// <summary>
    /// Get all GridAreaOverviewItem's.
    /// </summary>
    Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewItemsAsync();

    /// <summary>
    /// Get all GridAreas.
    /// </summary>
    Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(CancellationToken ct = default);

    /// <summary>
    /// Get relevant GridAreas for a given actor and period.
    /// </summary>
    Task<IEnumerable<GridAreaDto>> GetRelevantGridAreasAsync(
        Guid? actorId,
        Interval period,
        CancellationToken ct = default);
}
