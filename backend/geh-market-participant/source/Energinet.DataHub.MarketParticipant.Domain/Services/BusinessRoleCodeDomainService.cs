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
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    public sealed class BusinessRoleCodeDomainService : IBusinessRoleCodeDomainService
    {
        private readonly IEnumerable<IBusinessRole> _businessRoles;

        public BusinessRoleCodeDomainService(IEnumerable<IBusinessRole> businessRoles)
        {
            _businessRoles = businessRoles;
        }

        public IEnumerable<BusinessRoleCode> GetBusinessRoleCodes(IEnumerable<EicFunction> marketRoles)
        {
            ArgumentNullException.ThrowIfNull(marketRoles, nameof(marketRoles));

            var lookup = new Dictionary<EicFunction, BusinessRoleCode>();

            foreach (var businessRole in _businessRoles)
            {
                foreach (var function in businessRole.Functions)
                {
                    lookup.Add(function, businessRole.Code);
                }
            }

            var distinctRoles = new HashSet<BusinessRoleCode>();

            foreach (var marketRole in marketRoles)
            {
                if (lookup.TryGetValue(marketRole, out var businessRole))
                {
                    distinctRoles.Add(businessRole);
                }
            }

            return distinctRoles;
        }
    }
}
