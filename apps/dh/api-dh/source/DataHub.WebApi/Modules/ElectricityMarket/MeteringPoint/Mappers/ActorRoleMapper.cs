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

using Energinet.DataHub.ElectricityMarket.Abstractions.Shared;
using Energinet.DataHub.MarketParticipant.Authorization.Model;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class ActorRoleMapper
{
    public static ActorRole MapToDto(this EicFunction eicFunction)
    {
        return eicFunction switch
        {
            EicFunction.BalanceResponsibleParty => ActorRole.BalanceResponsibleParty,
            EicFunction.BillingAgent => ActorRole.BillingAgent,
            EicFunction.EnergySupplier => ActorRole.EnergySupplier,
            EicFunction.GridAccessProvider => ActorRole.GridAccessProvider,
            EicFunction.ImbalanceSettlementResponsible => ActorRole.ImbalanceSettlementResponsible,
            EicFunction.MeterOperator => ActorRole.MeterOperator,
            EicFunction.MeteredDataAdministrator => ActorRole.MeteredDataAdministrator,
            EicFunction.MeteredDataResponsible => ActorRole.MeteredDataResponsible,
            EicFunction.MeteringPointAdministrator => ActorRole.MeteringPointAdministrator,
            EicFunction.SystemOperator => ActorRole.SystemOperator,
            EicFunction.DanishEnergyAgency => ActorRole.DanishEnergyAgency,
            EicFunction.DataHubAdministrator => ActorRole.DataHubAdministrator,
            EicFunction.IndependentAggregator => ActorRole.IndependentAggregator,
            EicFunction.SerialEnergyTrader => ActorRole.SerialEnergyTrader,
            EicFunction.Delegated => ActorRole.Delegated,
            EicFunction.ItSupplier => ActorRole.ItSupplier,
        };
    }
}
