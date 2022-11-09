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

using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Repositories
{
    /// <summary>
    /// Provides access to the Grid Areas.
    /// </summary>
    public interface IGridAreaRepository
    {
        /// <summary>
        /// Updates a GridArea, or adds it if it's not already present.
        /// </summary>
        /// <param name="gridArea">The GridArea to add or update</param>
        /// <returns>The id of the added GridArea</returns>
        Task<GridAreaId> AddOrUpdateAsync(GridArea gridArea);

        /// <summary>
        /// Gets an GridArea with the specified Id
        /// </summary>
        /// <param name="id">The Id of the GridArea to get.</param>
        /// <returns>The specified grid area or null if not found</returns>
        Task<GridArea?> GetAsync(GridAreaId id);

        /// <summary>
        /// Retrieves all grid areas
        /// </summary>
        /// <returns>Grid areas</returns>
        Task<IEnumerable<GridArea>> GetAsync();
    }
}
