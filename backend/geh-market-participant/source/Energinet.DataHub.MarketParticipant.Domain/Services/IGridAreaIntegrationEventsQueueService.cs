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

using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    /// <summary>
    /// Creates and enqueues integration events for GridAreas.
    /// </summary>
    public interface IGridAreaIntegrationEventsQueueService
    {
        /// <summary>
        /// Creates and enqueues an GridAreaUpdated integration event for the specified Grid Area.
        /// </summary>
        /// <param name="gridArea">The GridArea to publish an integration event for.</param>
        /// <param name="gridAreaLink">The GridAreaLink to include in the integration event</param>
        Task EnqueueLegacyGridAreaUpdatedEventAsync(GridArea gridArea, GridAreaLink gridAreaLink);

        /// <summary>
        /// Creates and enqueues an GridAreaUpdated integration event for the specified Grid Area.
        /// </summary>
        /// <param name="gridArea">The GridArea to publish an integration event for.</param>
        /// <param name="gridAreaLink">The GridAreaLink to include in the integration event</param>
        Task EnqueueGridAreaCreatedEventAsync(GridArea gridArea, GridAreaLink gridAreaLink);

        /// <summary>
        /// Created Grid Name changed event
        /// </summary>
        /// <param name="gridArea"></param>
        Task EnqueueGridAreaNameChangedEventAsync(GridArea gridArea);
    }
}
