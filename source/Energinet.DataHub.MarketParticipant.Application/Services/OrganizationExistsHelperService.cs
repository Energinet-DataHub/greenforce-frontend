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
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Application.Services
{
    public sealed class OrganizationExistsHelperService : IOrganizationExistsHelperService
    {
        private readonly IOrganizationRepository _organizationRepository;

        public OrganizationExistsHelperService(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        public async Task<Organization> EnsureOrganizationExistsAsync(Guid organizationId)
        {
            var organization = await _organizationRepository
                .GetAsync(new OrganizationId(organizationId))
                .ConfigureAwait(false);

            return organization ?? throw new NotFoundValidationException(organizationId);
        }
    }
}
