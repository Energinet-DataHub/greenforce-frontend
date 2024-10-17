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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

public static class MarketRoleExtensions
{
    internal static EicFunction ToEicFunction(this ActorRole role) =>
        role switch
        {
            ActorRole.BalanceResponsibleParty => EicFunction.BalanceResponsibleParty,
            ActorRole.DanishEnergyAgency => EicFunction.DanishEnergyAgency,
            ActorRole.DataHubAdministrator => EicFunction.DataHubAdministrator,
            ActorRole.Delegated => EicFunction.Delegated,
            ActorRole.EnergySupplier => EicFunction.EnergySupplier,
            ActorRole.GridAccessProvider => EicFunction.GridAccessProvider,
            ActorRole.ImbalanceSettlementResponsible => EicFunction.ImbalanceSettlementResponsible,
            ActorRole.MeteredDataAdministrator => EicFunction.MeteredDataAdministrator,
            ActorRole.MeteredDataResponsible => EicFunction.MeteredDataResponsible,
            ActorRole.MeteringPointAdministrator => EicFunction.MeteringPointAdministrator,
            ActorRole.SystemOperator => EicFunction.SystemOperator,
        };

    internal static ActorRole? ToActorRole(this EicFunction function) =>
        function switch
        {
            EicFunction.BalanceResponsibleParty => ActorRole.BalanceResponsibleParty,
            EicFunction.DanishEnergyAgency => ActorRole.DanishEnergyAgency,
            EicFunction.DataHubAdministrator => ActorRole.DataHubAdministrator,
            EicFunction.Delegated => ActorRole.Delegated,
            EicFunction.EnergySupplier => ActorRole.EnergySupplier,
            EicFunction.GridAccessProvider => ActorRole.GridAccessProvider,
            EicFunction.ImbalanceSettlementResponsible => ActorRole.ImbalanceSettlementResponsible,
            EicFunction.MeteredDataAdministrator => ActorRole.MeteredDataAdministrator,
            EicFunction.MeteredDataResponsible => ActorRole.MeteredDataResponsible,
            EicFunction.MeteringPointAdministrator => ActorRole.MeteringPointAdministrator,
            EicFunction.SystemOperator => ActorRole.SystemOperator,
            EicFunction.BillingAgent => null,
            EicFunction.MeterOperator => null,
            EicFunction.IndependentAggregator => null,
            EicFunction.SerialEnergyTrader => null,
            EicFunction.ItSupplier => null,
        };
}
