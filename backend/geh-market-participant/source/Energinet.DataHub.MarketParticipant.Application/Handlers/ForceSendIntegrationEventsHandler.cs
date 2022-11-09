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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers
{
    public sealed class ForceSendIntegrationEventsHandler : IRequestHandler<ForceSendIntegrationEventsCommand>
    {
        private readonly IGridAreaRepository _gridAreaRepository;
        private readonly IGridAreaLinkRepository _gridAreaLinkRepository;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IGridAreaIntegrationEventsQueueService _gridAreaIntegrationEventsQueueService;
        private readonly IOrganizationIntegrationEventsQueueService _organizationIntegrationEventsQueueService;
        private readonly IActorIntegrationEventsQueueService _actorIntegrationEventsQueueService;
        private readonly IOrganizationIntegrationEventsHelperService _organizationIntegrationEventsHelperService;

        public ForceSendIntegrationEventsHandler(
            IGridAreaRepository gridAreaRepository,
            IGridAreaLinkRepository gridAreaLinkRepository,
            IOrganizationRepository organizationRepository,
            IGridAreaIntegrationEventsQueueService gridAreaIntegrationEventsQueueService,
            IOrganizationIntegrationEventsQueueService organizationIntegrationEventsQueueService,
            IActorIntegrationEventsQueueService actorIntegrationEventsQueueService,
            IOrganizationIntegrationEventsHelperService organizationIntegrationEventsHelperService)
        {
            _gridAreaRepository = gridAreaRepository;
            _gridAreaLinkRepository = gridAreaLinkRepository;
            _organizationRepository = organizationRepository;
            _gridAreaIntegrationEventsQueueService = gridAreaIntegrationEventsQueueService;
            _organizationIntegrationEventsQueueService = organizationIntegrationEventsQueueService;
            _actorIntegrationEventsQueueService = actorIntegrationEventsQueueService;
            _organizationIntegrationEventsHelperService = organizationIntegrationEventsHelperService;
        }

        public async Task<Unit> Handle(ForceSendIntegrationEventsCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            await ForceSendGridAreasAsync().ConfigureAwait(false);
            await ForceSendOrganizationsAsync().ConfigureAwait(false);

            return Unit.Value;
        }

        private async Task ForceSendOrganizationsAsync()
        {
            var allOrganizations = await _organizationRepository
                .GetAsync()
                .ConfigureAwait(false);

            foreach (var organization in allOrganizations)
            {
                var organizationCreatedEvents = _organizationIntegrationEventsHelperService.BuildOrganizationCreatedEvents(organization);
                await _organizationIntegrationEventsQueueService
                    .EnqueueOrganizationIntegrationEventsAsync(organization.Id, organizationCreatedEvents)
                    .ConfigureAwait(false);

                await _organizationIntegrationEventsQueueService
                    .EnqueueLegacyOrganizationUpdatedEventAsync(organization)
                    .ConfigureAwait(false);

                foreach (var actor in organization.Actors)
                {
                    await _actorIntegrationEventsQueueService
                        .EnqueueActorUpdatedEventAsync(organization.Id, actor)
                        .ConfigureAwait(false);
                }
            }
        }

        private async Task ForceSendGridAreasAsync()
        {
            var allGridAreas = await _gridAreaRepository
                .GetAsync()
                .ConfigureAwait(false);

            foreach (var gridArea in allGridAreas)
            {
                var gridAreaLink = await _gridAreaLinkRepository
                    .GetAsync(gridArea.Id)
                    .ConfigureAwait(false);

                await _gridAreaIntegrationEventsQueueService
                    .EnqueueGridAreaCreatedEventAsync(gridArea, gridAreaLink!)
                    .ConfigureAwait(false);

                await _gridAreaIntegrationEventsQueueService
                    .EnqueueLegacyGridAreaUpdatedEventAsync(gridArea, gridAreaLink!)
                    .ConfigureAwait(false);
            }
        }
    }
}
