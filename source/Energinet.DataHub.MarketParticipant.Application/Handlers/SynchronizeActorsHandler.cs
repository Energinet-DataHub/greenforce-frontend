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

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers;

public sealed class SynchronizeActorsHandler : IRequestHandler<SynchronizeActorsCommand>
{
    private readonly IUnitOfWorkProvider _unitOfWorkProvider;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IActorIntegrationEventsQueueService _actorIntegrationEventsQueueService;
    private readonly IExternalActorIdConfigurationService _externalActorIdConfigurationService;
    private readonly IExternalActorSynchronizationRepository _externalActorSynchronizationRepository;

    public SynchronizeActorsHandler(
        IUnitOfWorkProvider unitOfWorkProvider,
        IOrganizationRepository organizationRepository,
        IActorIntegrationEventsQueueService actorIntegrationEventsQueueService,
        IExternalActorIdConfigurationService externalActorIdConfigurationService,
        IExternalActorSynchronizationRepository externalActorSynchronizationRepository)
    {
        _unitOfWorkProvider = unitOfWorkProvider;
        _organizationRepository = organizationRepository;
        _actorIntegrationEventsQueueService = actorIntegrationEventsQueueService;
        _externalActorIdConfigurationService = externalActorIdConfigurationService;
        _externalActorSynchronizationRepository = externalActorSynchronizationRepository;
    }

    public async Task<Unit> Handle(SynchronizeActorsCommand request, CancellationToken cancellationToken)
    {
        var uow = await _unitOfWorkProvider
            .NewUnitOfWorkAsync()
            .ConfigureAwait(false);

        await using (uow.ConfigureAwait(false))
        {
            var nextEntry = await _externalActorSynchronizationRepository
                 .DequeueNextAsync()
                 .ConfigureAwait(false);

            if (nextEntry.HasValue)
            {
                var (organizationId, actorId) = nextEntry.Value;

                var organization = await _organizationRepository
                    .GetAsync(organizationId)
                    .ConfigureAwait(false);

                var actor = organization!
                    .Actors
                    .First(actor => actor.Id == actorId);

                // TODO: This service must be replaced with a reliable version in a future PR.
                await _externalActorIdConfigurationService
                    .AssignExternalActorIdAsync(actor)
                    .ConfigureAwait(false);

                await _organizationRepository
                    .AddOrUpdateAsync(organization)
                    .ConfigureAwait(false);

                await EnqueueExternalActorIdChangedEventAsync(organization.Id, actor).ConfigureAwait(false);
            }

            await uow.CommitAsync().ConfigureAwait(false);
        }

        return Unit.Value;
    }

    private Task EnqueueExternalActorIdChangedEventAsync(OrganizationId organizationId, Domain.Model.Actor actor)
    {
        var externalIdEvent = new ActorExternalIdChangedIntegrationEvent
        {
            OrganizationId = organizationId.Value,
            ActorId = actor.Id,
            ExternalActorId = actor.ExternalActorId?.Value
        };

        return _actorIntegrationEventsQueueService.EnqueueActorUpdatedEventAsync(
            organizationId,
            actor.Id,
            new IIntegrationEvent[] { externalIdEvent });
    }
}
