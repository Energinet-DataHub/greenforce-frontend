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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using MarketParticipantClient = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;

public static class MeteringPointDtoExtensions
{
    public static EicFunction ToElectricityMarketEicFunction(
        this MarketParticipantClient.EicFunction eicFunction) =>
        eicFunction switch
        {
            MarketParticipantClient.EicFunction.BalanceResponsibleParty => EicFunction.BalanceResponsibleParty,
            MarketParticipantClient.EicFunction.BillingAgent => EicFunction.BillingAgent,
            MarketParticipantClient.EicFunction.DanishEnergyAgency => EicFunction.DanishEnergyAgency,
            MarketParticipantClient.EicFunction.DataHubAdministrator => EicFunction.DataHubAdministrator,
            MarketParticipantClient.EicFunction.Delegated => EicFunction.Delegated,
            MarketParticipantClient.EicFunction.EnergySupplier => EicFunction.EnergySupplier,
            MarketParticipantClient.EicFunction.GridAccessProvider => EicFunction.GridAccessProvider,
            MarketParticipantClient.EicFunction.ImbalanceSettlementResponsible => EicFunction.ImbalanceSettlementResponsible,
            MarketParticipantClient.EicFunction.IndependentAggregator => EicFunction.IndependentAggregator,
            MarketParticipantClient.EicFunction.ItSupplier => EicFunction.ItSupplier,
            MarketParticipantClient.EicFunction.MeteredDataAdministrator => EicFunction.MeteredDataAdministrator,
            MarketParticipantClient.EicFunction.MeteredDataResponsible => EicFunction.MeteredDataResponsible,
            _ => throw new ArgumentOutOfRangeException(nameof(eicFunction), eicFunction, null),
        };
}
