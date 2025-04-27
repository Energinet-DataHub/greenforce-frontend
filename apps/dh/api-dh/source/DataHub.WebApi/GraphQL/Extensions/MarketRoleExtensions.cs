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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using ActorRoleV1 = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.ActorRole;
using ActorRoleV3 = Energinet.DataHub.Edi.B2CWebApp.Clients.v3.ActorRole;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

public static class MarketRoleExtensions
{
    internal static EicFunction ToEicFunction(this ActorRoleV3 role) =>
        role switch
        {
            ActorRoleV3.BalanceResponsibleParty => EicFunction.BalanceResponsibleParty,
            ActorRoleV3.DanishEnergyAgency => EicFunction.DanishEnergyAgency,
            ActorRoleV3.DataHubAdministrator => EicFunction.DataHubAdministrator,
            ActorRoleV3.Delegated => EicFunction.Delegated,
            ActorRoleV3.EnergySupplier => EicFunction.EnergySupplier,
            ActorRoleV3.GridAccessProvider => EicFunction.GridAccessProvider,
            ActorRoleV3.ImbalanceSettlementResponsible => EicFunction.ImbalanceSettlementResponsible,
            ActorRoleV3.MeteredDataAdministrator => EicFunction.MeteredDataAdministrator,
            ActorRoleV3.MeteredDataResponsible => EicFunction.MeteredDataResponsible,
            ActorRoleV3.MeteringPointAdministrator => EicFunction.MeteringPointAdministrator,
            ActorRoleV3.SystemOperator => EicFunction.SystemOperator,
        };

    internal static ActorRoleV1? ToActorRoleV1(this EicFunction function) =>
        function switch
        {
            EicFunction.BalanceResponsibleParty => ActorRoleV1.BalanceResponsibleParty,
            EicFunction.DanishEnergyAgency => ActorRoleV1.DanishEnergyAgency,
            EicFunction.DataHubAdministrator => ActorRoleV1.DataHubAdministrator,
            EicFunction.Delegated => ActorRoleV1.Delegated,
            EicFunction.EnergySupplier => ActorRoleV1.EnergySupplier,
            EicFunction.GridAccessProvider => ActorRoleV1.GridAccessProvider,
            EicFunction.ImbalanceSettlementResponsible => ActorRoleV1.ImbalanceSettlementResponsible,
            EicFunction.MeteredDataAdministrator => ActorRoleV1.MeteredDataAdministrator,
            EicFunction.MeteredDataResponsible => ActorRoleV1.MeteredDataResponsible,
            EicFunction.MeteringPointAdministrator => ActorRoleV1.MeteringPointAdministrator,
            EicFunction.SystemOperator => ActorRoleV1.SystemOperator,
            EicFunction.BillingAgent => null,
            EicFunction.MeterOperator => null,
            EicFunction.IndependentAggregator => null,
            EicFunction.SerialEnergyTrader => null,
            EicFunction.ItSupplier => null,
        };

    internal static ActorRoleV3? ToActorRoleV3(this EicFunction function) =>
        function switch
        {
            EicFunction.BalanceResponsibleParty => ActorRoleV3.BalanceResponsibleParty,
            EicFunction.DanishEnergyAgency => ActorRoleV3.DanishEnergyAgency,
            EicFunction.DataHubAdministrator => ActorRoleV3.DataHubAdministrator,
            EicFunction.Delegated => ActorRoleV3.Delegated,
            EicFunction.EnergySupplier => ActorRoleV3.EnergySupplier,
            EicFunction.GridAccessProvider => ActorRoleV3.GridAccessProvider,
            EicFunction.ImbalanceSettlementResponsible => ActorRoleV3.ImbalanceSettlementResponsible,
            EicFunction.MeteredDataAdministrator => ActorRoleV3.MeteredDataAdministrator,
            EicFunction.MeteredDataResponsible => ActorRoleV3.MeteredDataResponsible,
            EicFunction.MeteringPointAdministrator => ActorRoleV3.MeteringPointAdministrator,
            EicFunction.SystemOperator => ActorRoleV3.SystemOperator,
            EicFunction.BillingAgent => null,
            EicFunction.MeterOperator => null,
            EicFunction.IndependentAggregator => null,
            EicFunction.SerialEnergyTrader => null,
            EicFunction.ItSupplier => null,
        };
}
