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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Domain.Services.Rules
{
    public sealed class ActorStatusMarketRolesRuleService : IActorStatusMarketRolesRuleService
    {
        private readonly IOrganizationRepository _organizationRepository;

        public ActorStatusMarketRolesRuleService(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        public async Task ValidateAsync(OrganizationId organizationId, Actor updatedActor)
        {
            ArgumentNullException.ThrowIfNull(organizationId);
            ArgumentNullException.ThrowIfNull(updatedActor);

            var organization = await _organizationRepository.GetAsync(organizationId).ConfigureAwait(false);

            if (organization == null)
                throw new NotFoundValidationException("Organization not found");

            var actor = organization.Actors.FirstOrDefault(x => x.Id == updatedActor.Id);

            if (actor == null)
                throw new NotFoundValidationException("Actor not found");

            if (actor.Status == ActorStatus.New)
                return;

            if (!CreateEqualityKeys(actor.MarketRoles).All(x => CreateEqualityKeys(updatedActor.MarketRoles).Contains(x)))
            {
                throw new ValidationException("It is only allowed to remove and edit market roles for actors marked as 'New'.");
            }
        }

        private static IEnumerable<string> CreateEqualityKeys(IEnumerable<ActorMarketRole> marketRoles)
        {
            foreach (var marketRole in marketRoles)
            {
                foreach (var grid in marketRole.GridAreas)
                {
                    yield return (marketRole.Function.ToString() + grid.Id + string.Join(string.Empty, grid.MeteringPointTypes.Select(mp => mp.ToString()).OrderBy(mp => mp))).ToUpperInvariant();
                }
            }
        }
    }
}
