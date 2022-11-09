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
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers.Organization
{
    public sealed class CreateOrganizationHandler : IRequestHandler<CreateOrganizationCommand, CreateOrganizationResponse>
    {
        private readonly IOrganizationFactoryService _organizationFactoryService;

        public CreateOrganizationHandler(IOrganizationFactoryService organizationFactoryService)
        {
            _organizationFactoryService = organizationFactoryService;
        }

        public async Task<CreateOrganizationResponse> Handle(CreateOrganizationCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            var address = new Address(
                request.Organization.Address.StreetName,
                request.Organization.Address.Number,
                request.Organization.Address.ZipCode,
                request.Organization.Address.City,
                request.Organization.Address.Country);
            var cvr = new BusinessRegisterIdentifier(request.Organization.BusinessRegisterIdentifier);

            var organization = await _organizationFactoryService
                .CreateAsync(request.Organization.Name, cvr, address, request.Organization.Comment)
                .ConfigureAwait(false);

            return new CreateOrganizationResponse(organization.Id.Value);
        }
    }
}
