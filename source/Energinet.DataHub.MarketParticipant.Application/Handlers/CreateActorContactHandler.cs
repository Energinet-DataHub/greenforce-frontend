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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Contact;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers
{
    public sealed class CreateActorContactHandler : IRequestHandler<CreateActorContactCommand, CreateActorContactResponse>
    {
        private readonly IOrganizationExistsHelperService _organizationExistsHelperService;
        private readonly IActorContactRepository _contactRepository;
        private readonly IOverlappingActorContactCategoriesRuleService _overlappingContactCategoriesRuleService;
        private readonly IActorIntegrationEventsQueueService _actorIntegrationEventsQueueService;

        public CreateActorContactHandler(
            IOrganizationExistsHelperService organizationExistsHelperService,
            IActorContactRepository contactRepository,
            IOverlappingActorContactCategoriesRuleService overlappingContactCategoriesRuleService,
            IActorIntegrationEventsQueueService actorIntegrationEventsQueueService)
        {
            _organizationExistsHelperService = organizationExistsHelperService;
            _contactRepository = contactRepository;
            _overlappingContactCategoriesRuleService = overlappingContactCategoriesRuleService;
            _actorIntegrationEventsQueueService = actorIntegrationEventsQueueService;
        }

        public async Task<CreateActorContactResponse> Handle(CreateActorContactCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var organization = await _organizationExistsHelperService
                .EnsureOrganizationExistsAsync(request.OrganizationId)
                .ConfigureAwait(false);

            var actor = organization.Actors.FirstOrDefault(x => x.Id == request.ActorId);

            if (actor == null)
                throw new NotFoundValidationException(request.ActorId);

            var existingContacts = await _contactRepository
                .GetAsync(actor.Id)
                .ConfigureAwait(false);

            var contact = CreateContact(actor.Id, request.Contact);

            _overlappingContactCategoriesRuleService
                .ValidateCategoriesAcrossContacts(existingContacts.Append(contact));

            var contactId = await _contactRepository
                .AddAsync(contact)
                .ConfigureAwait(false);

            await _actorIntegrationEventsQueueService
                .EnqueueContactAddedToActorEventAsync(organization.Id, actor, contact)
                .ConfigureAwait(false);

            return new CreateActorContactResponse(contactId.Value);
        }

        private static ActorContact CreateContact(Guid actorId, CreateActorContactDto contactDto)
        {
            var optionalPhoneNumber = contactDto.Phone == null
                ? null
                : new PhoneNumber(contactDto.Phone);

            return new ActorContact(
                actorId,
                contactDto.Name,
                Enum.Parse<ContactCategory>(contactDto.Category, true),
                new EmailAddress(contactDto.Email),
                optionalPhoneNumber);
        }
    }
}
