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
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services.Rules
{
    public sealed class OverlappingBusinessRolesRuleService : IOverlappingBusinessRolesRuleService
    {
        private readonly IBusinessRoleCodeDomainService _businessRoleCodeDomainService;

        public OverlappingBusinessRolesRuleService(IBusinessRoleCodeDomainService businessRoleCodeDomainService)
        {
            _businessRoleCodeDomainService = businessRoleCodeDomainService;
        }

        public void ValidateRolesAcrossActors(IEnumerable<Actor> actors)
        {
            ArgumentNullException.ThrowIfNull(actors, nameof(actors));

            foreach (var actorsWithSameActorNumber in actors.GroupBy(x => x.ActorNumber))
            {
                var setOfSets = actorsWithSameActorNumber
                    .Select(x => AreRolesUnique(x.MarketRoles.Select(m => m.Function)))
                    .ToList();

                var usedBusinessRoles = new HashSet<BusinessRoleCode>();

                foreach (var businessRole in setOfSets.SelectMany(CreateSet))
                {
                    if (!usedBusinessRoles.Add(businessRole))
                    {
                        throw new ValidationException($"Cannot add '{businessRole}' as this business role is already assigned to another actor within the organization.");
                    }
                }

                var usedMarketRoles = new HashSet<EicFunction>();

                foreach (var marketRole in setOfSets.SelectMany(x => x))
                {
                    if (!usedMarketRoles.Add(marketRole))
                    {
                        throw new ValidationException($"Cannot add '{marketRole}' as this market role is already assigned to another actor within the organization.");
                    }
                }
            }
        }

        private static IEnumerable<EicFunction> AreRolesUnique(IEnumerable<EicFunction> marketRoles)
        {
            var usedFunctions = new HashSet<EicFunction>();

            foreach (var marketRole in marketRoles)
            {
                if (!usedFunctions.Add(marketRole))
                {
                    throw new ValidationException("The market roles cannot contain duplicates.");
                }

                yield return marketRole;
            }
        }

        private IEnumerable<BusinessRoleCode> CreateSet(IEnumerable<EicFunction> marketRoles)
        {
            return _businessRoleCodeDomainService.GetBusinessRoleCodes(AreRolesUnique(marketRoles));
        }
    }
}
