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
using Energinet.DataHub.MarketParticipant.Application.Mappers;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers
{
    public sealed class GetActorContactsHandler : IRequestHandler<GetActorContactsCommand, GetActorContactsResponse>
    {
        private readonly IOrganizationExistsHelperService _organizationExistsHelperService;
        private readonly IActorContactRepository _contactRepository;

        public GetActorContactsHandler(
            IOrganizationExistsHelperService organizationExistsHelperService,
            IActorContactRepository contactRepository)
        {
            _organizationExistsHelperService = organizationExistsHelperService;
            _contactRepository = contactRepository;
        }

        public async Task<GetActorContactsResponse> Handle(GetActorContactsCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var organization = await _organizationExistsHelperService
                .EnsureOrganizationExistsAsync(request.OrganizationId)
                .ConfigureAwait(false);

            var actor = organization.Actors.FirstOrDefault(x => x.Id == request.ActorId);

            if (actor == null)
                throw new NotFoundValidationException(request.ActorId);

            var contacts = await _contactRepository
                .GetAsync(actor.Id)
                .ConfigureAwait(false);

            return new GetActorContactsResponse(contacts.Select(ActorContactMapper.Map));
        }
    }
}
