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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    public sealed class GridAreaIntegrationEventsQueueService : IGridAreaIntegrationEventsQueueService
    {
        private readonly IDomainEventRepository _domainEventRepository;

        public GridAreaIntegrationEventsQueueService(
            IDomainEventRepository domainEventRepository)
        {
            _domainEventRepository = domainEventRepository;
        }

        [Obsolete("Deprecated, will be removed.")]
        public Task EnqueueLegacyGridAreaUpdatedEventAsync(GridArea gridArea, GridAreaLink gridAreaLink)
        {
            ArgumentNullException.ThrowIfNull(gridArea, nameof(gridArea));
            ArgumentNullException.ThrowIfNull(gridAreaLink, nameof(gridAreaLink));

            var gridAreaUpdatedEvent = new GridAreaUpdatedIntegrationEvent
            {
                GridAreaId = gridArea.Id,
                Code = gridArea.Code,
                Name = gridArea.Name,
                PriceAreaCode = gridArea.PriceAreaCode,
                GridAreaLinkId = gridAreaLink.Id
            };

            var domainEvent = new DomainEvent(gridArea.Id.Value, nameof(GridArea), gridAreaUpdatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }

        public Task EnqueueGridAreaCreatedEventAsync(GridArea gridArea, GridAreaLink gridAreaLink)
        {
            ArgumentNullException.ThrowIfNull(gridArea, nameof(gridArea));
            ArgumentNullException.ThrowIfNull(gridAreaLink, nameof(gridAreaLink));

            var gridAreaCreatedIntegrationEvent = new GridAreaCreatedIntegrationEvent
            {
                GridAreaId = gridArea.Id,
                Code = gridArea.Code,
                Name = gridArea.Name,
                PriceAreaCode = gridArea.PriceAreaCode,
                GridAreaLinkId = gridAreaLink.Id
            };

            var domainEvent = new DomainEvent(gridArea.Id.Value, nameof(GridArea), gridAreaCreatedIntegrationEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }

        public Task EnqueueGridAreaNameChangedEventAsync(GridArea gridArea)
        {
            ArgumentNullException.ThrowIfNull(gridArea, nameof(gridArea));

            var gridAreaUpdatedEvent = new GridAreaNameChangedIntegrationEvent
            {
                GridAreaId = gridArea.Id,
                Name = gridArea.Name
            };

            var domainEvent = new DomainEvent(gridArea.Id.Value, nameof(GridArea), gridAreaUpdatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }
    }
}
