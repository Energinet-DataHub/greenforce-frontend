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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;

namespace Energinet.DataHub.MarketParticipant.Client
{
    /// <summary>
    /// BFF client for grid areas in Energinet.DataHub.MarketParticipant.
    /// </summary>
    public interface IMarketParticipantGridAreaClient
    {
        /// <summary>
        /// List all grid areas.
        /// </summary>
        /// <returns>A list of grid areas <see cref="GridAreaDto"/>.</returns>
        Task<IEnumerable<GridAreaDto>> GetGridAreasAsync();

        /// <summary>
        /// Updates gridarea name
        /// </summary>
        /// <param name="changes">gridarea changes</param>
        /// <returns>update task</returns>
        Task UpdateGridAreaAsync(ChangeGridAreaDto changes);

        /// <summary>
        /// List all grid areas audit log entries for the given grid area.
        /// </summary>
        /// <param name="gridAreaId">ID of the grid area</param>
        /// <returns>A list of <see cref="GridAreaAuditLogEntryDto"/>.</returns>
        Task<IEnumerable<GridAreaAuditLogEntryDto>> GetGridAreaAuditLogEntriesAsync(Guid gridAreaId);
    }
}
