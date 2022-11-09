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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    public sealed class ActorIntegrationEventsQueueService : IActorIntegrationEventsQueueService
    {
        private readonly IDomainEventRepository _domainEventRepository;
        private readonly IBusinessRoleCodeDomainService _businessRoleCodeDomainService;

        public ActorIntegrationEventsQueueService(
            IDomainEventRepository domainEventRepository,
            IBusinessRoleCodeDomainService businessRoleCodeDomainService)
        {
            _domainEventRepository = domainEventRepository;
            _businessRoleCodeDomainService = businessRoleCodeDomainService;
        }

        public Task EnqueueActorUpdatedEventAsync(OrganizationId organizationId, Actor actor)
        {
            ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
            ArgumentNullException.ThrowIfNull(actor, nameof(actor));

            var actorUpdatedEvent = new ActorUpdatedIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = actor.Id,
                ExternalActorId = actor.ExternalActorId,
                ActorNumber = new ActorNumberEventData(actor.ActorNumber.Value, actor.ActorNumber.Type),
                Status = actor.Status,
            };

            foreach (var businessRole in _businessRoleCodeDomainService.GetBusinessRoleCodes(actor.MarketRoles.Select(m => m.Function)))
            {
                actorUpdatedEvent.BusinessRoles.Add(businessRole);
            }

            foreach (var actorMarketRole in actor.MarketRoles)
            {
                actorUpdatedEvent.ActorMarketRoles.Add(
                    new ActorMarketRoleEventData(
                        actorMarketRole.Function,
                        actorMarketRole.GridAreas.Select(
                            x => new ActorGridAreaEventData(
                                x.Id,
                                x.MeteringPointTypes.Select(y => y.ToString()).ToList()))
                            .ToList()));
            }

            var domainEvent = new DomainEvent(actor.Id, nameof(Actor), actorUpdatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }

        public Task EnqueueActorCreatedEventsAsync(OrganizationId organizationId, Actor actor)
        {
            ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
            ArgumentNullException.ThrowIfNull(actor, nameof(actor));

            var actorCreatedEvent = new ActorCreatedIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = actor.Id,
                Status = actor.Status,
                ActorNumber = new ActorNumberEventData(actor.ActorNumber.Value, actor.ActorNumber.Type),
                Name = actor.Name
            };

            foreach (var businessRole in _businessRoleCodeDomainService.GetBusinessRoleCodes(actor.MarketRoles.Select(m => m.Function)))
            {
                actorCreatedEvent.BusinessRoles.Add(businessRole);
            }

            foreach (var actorMarketRole in actor.MarketRoles)
            {
                actorCreatedEvent.ActorMarketRoles.Add(
                    new ActorMarketRoleEventData(
                        actorMarketRole.Function,
                        actorMarketRole.GridAreas.Select(
                                x => new ActorGridAreaEventData(
                                    x.Id,
                                    x.MeteringPointTypes.Select(y => y.ToString()).ToList()))
                            .ToList()));
            }

            var domainEvent = new DomainEvent(actor.Id, nameof(Actor), actorCreatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }

        public async Task EnqueueActorUpdatedEventAsync(OrganizationId organizationId, Guid actorId, IEnumerable<IIntegrationEvent> integrationEvents)
        {
            ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
            ArgumentNullException.ThrowIfNull(integrationEvents, nameof(integrationEvents));

            foreach (var integrationEvent in integrationEvents)
            {
                switch (integrationEvent)
                {
                    case ActorStatusChangedIntegrationEvent:
                        {
                            var domainEvent = new DomainEvent(actorId, nameof(Actor), integrationEvent);
                            await _domainEventRepository.InsertAsync(domainEvent).ConfigureAwait(false);
                            break;
                        }

                    case ActorNameChangedIntegrationEvent:
                    case ActorExternalIdChangedIntegrationEvent:
                        {
                            var domainEvent = new DomainEvent(actorId, nameof(Actor), integrationEvent);
                            await _domainEventRepository.InsertAsync(domainEvent).ConfigureAwait(false);
                            break;
                        }

                    case MarketRoleAddedToActorIntegrationEvent or MarketRoleRemovedFromActorIntegrationEvent:
                        {
                            var domainEvent = new DomainEvent(actorId, nameof(Actor), integrationEvent);
                            await _domainEventRepository.InsertAsync(domainEvent).ConfigureAwait(false);
                            break;
                        }

                    case GridAreaAddedToActorIntegrationEvent or GridAreaRemovedFromActorIntegrationEvent:
                        {
                            var domainEvent = new DomainEvent(actorId, nameof(Actor), integrationEvent);
                            await _domainEventRepository.InsertAsync(domainEvent).ConfigureAwait(false);
                            break;
                        }

                    case MeteringPointTypeAddedToActorIntegrationEvent or MeteringPointTypeRemovedFromActorIntegrationEvent:
                        {
                            var domainEvent = new DomainEvent(actorId, nameof(Actor), integrationEvent);
                            await _domainEventRepository.InsertAsync(domainEvent).ConfigureAwait(false);
                            break;
                        }

                    default:
                        throw new InvalidOperationException(
                            $"Type of integration event '{integrationEvent.GetType()}' does not match valid event types.");
                }
            }
        }

        public Task EnqueueContactAddedToActorEventAsync(OrganizationId organizationId, Actor actor, ActorContact contact)
        {
            ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
            ArgumentNullException.ThrowIfNull(actor, nameof(actor));
            ArgumentNullException.ThrowIfNull(contact, nameof(contact));

            var actorCreatedEvent = new ContactAddedToActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = actor.Id,
                Contact = new ActorContactEventData(contact.Name, contact.Email, contact.Category, contact.Phone)
            };

            var domainEvent = new DomainEvent(actor.Id, nameof(Actor), actorCreatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }

        public Task EnqueueContactRemovedFromActorEventAsync(OrganizationId organizationId, Actor actor, ActorContact contact)
        {
            ArgumentNullException.ThrowIfNull(organizationId, nameof(organizationId));
            ArgumentNullException.ThrowIfNull(actor, nameof(actor));
            ArgumentNullException.ThrowIfNull(contact, nameof(contact));

            var actorCreatedEvent = new ContactRemovedFromActorIntegrationEvent
            {
                OrganizationId = organizationId,
                ActorId = actor.Id,
                Contact = new ActorContactEventData(contact.Name, contact.Email, contact.Category, contact.Phone)
            };

            var domainEvent = new DomainEvent(actor.Id, nameof(Actor), actorCreatedEvent);
            return _domainEventRepository.InsertAsync(domainEvent);
        }
    }
}
