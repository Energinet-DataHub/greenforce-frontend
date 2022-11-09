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

using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Domain.Services.Rules
{
    public sealed class UniqueGlobalLocationNumberRuleService : IUniqueGlobalLocationNumberRuleService
    {
        private readonly IOrganizationRepository _organizationRepository;

        public UniqueGlobalLocationNumberRuleService(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        public async Task ValidateGlobalLocationNumberAvailableAsync(Organization organization, ActorNumber actorNumber)
        {
            var organizations = await _organizationRepository
                .GetAsync(actorNumber)
                .ConfigureAwait(false);

            if (organizations.Any(o => o.Id != organization.Id))
            {
                throw new ValidationException("The specified GLN is already in use.");
            }
        }
    }
}
