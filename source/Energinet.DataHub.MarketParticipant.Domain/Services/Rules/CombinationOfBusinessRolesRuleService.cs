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
using Energinet.DataHub.MarketParticipant.Domain.Model.BusinessRoles;

namespace Energinet.DataHub.MarketParticipant.Domain.Services.Rules
{
    public sealed class CombinationOfBusinessRolesRuleService : ICombinationOfBusinessRolesRuleService
    {
        public CombinationOfBusinessRolesRuleService()
        {
            var balanceResponsiblePartyRole = new BalanceResponsiblePartyRole();
            var gridAccessProviderRole = new GridOperatorRole();
            var balancePowerSupplierRole = new ElectricalSupplierRole();
            var imbalanceSettlementResponsibleRole = new ImbalanceSettlementResponsibleRole();
            var meteringPointAdministratorRole = new MeteringPointAdministratorRole();
            var meteredDataAdministratorRole = new MeteredDataAdministratorRole();
            var systemOperatorRole = new SystemOperatorRole();
            var meteredDataResponsibleRole = new MeteredDataResponsibleRole();
            var danishEnergyAgencyRole = new DanishEnergyAgencyRole();
            var transmissionSystemOperatorRole = new TransmissionSystemOperatorRole();

            var ddkDdqMdrHashSets = balanceResponsiblePartyRole.Functions.ToHashSet();
            ddkDdqMdrHashSets.UnionWith(balancePowerSupplierRole.Functions.Concat(meteredDataResponsibleRole.Functions));
            var ddkDdqMdr = new HashSet<EicFunction>(ddkDdqMdrHashSets);

            var ddmMdrHashSets = gridAccessProviderRole.Functions.ToHashSet();
            ddmMdrHashSets.UnionWith(meteredDataResponsibleRole.Functions);
            var ddmMdr = new HashSet<EicFunction>(ddmMdrHashSets);

            var ddz = meteringPointAdministratorRole.Functions.ToHashSet();
            var ddx = imbalanceSettlementResponsibleRole.Functions.ToHashSet();
            var dgl = meteredDataAdministratorRole.Functions.ToHashSet();
            var ez = systemOperatorRole.Functions.ToHashSet();
            var sts = danishEnergyAgencyRole.Functions.ToHashSet();
            var tso = transmissionSystemOperatorRole.Functions.ToHashSet();

            AllSets = new List<HashSet<EicFunction>> { ddkDdqMdr, ddmMdr, ddz, ddx, dgl, ez, sts, tso };
        }

        private List<HashSet<EicFunction>> AllSets { get; }

        public void ValidateCombinationOfBusinessRoles(IEnumerable<EicFunction> marketRoles)
        {
            ArgumentNullException.ThrowIfNull(marketRoles);
            var marketRolesHashSet = new HashSet<EicFunction>();

            foreach (var marketRole in marketRoles)
            {
                marketRolesHashSet.Add(marketRole);
            }

            if (AllSets.All(knownSet => !marketRolesHashSet.IsSubsetOf(knownSet)))
            {
                throw new ValidationException(
                    "Cannot assign market roles, as the chosen combination of roles is not valid.");
            }
        }
    }
}
