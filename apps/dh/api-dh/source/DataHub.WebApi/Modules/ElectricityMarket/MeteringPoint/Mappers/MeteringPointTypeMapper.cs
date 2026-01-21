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

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class MeteringPointTypeMapper
{
    public static MeteringPointType MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType type)
    {
        return type switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Consumption => MeteringPointType.Consumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Production => MeteringPointType.Production,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Exchange => MeteringPointType.Exchange,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.VEProduction => MeteringPointType.VEProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Analysis => MeteringPointType.Analysis,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NotUsed => MeteringPointType.NotUsed,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SurplusProductionGroup6 => MeteringPointType.SurplusProductionGroup6,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetProduction => MeteringPointType.NetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SupplyToGrid => MeteringPointType.SupplyToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ConsumptionFromGrid => MeteringPointType.ConsumptionFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.WholesaleServicesOrInformation => MeteringPointType.WholesaleServicesOrInformation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OwnProduction => MeteringPointType.OwnProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetFromGrid => MeteringPointType.NetFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetToGrid => MeteringPointType.NetToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.TotalConsumption => MeteringPointType.TotalConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetLossCorrection => MeteringPointType.NetLossCorrection,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ElectricalHeating => MeteringPointType.ElectricalHeating,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetConsumption => MeteringPointType.NetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherConsumption => MeteringPointType.OtherConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherProduction => MeteringPointType.OtherProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CapacitySettlement => MeteringPointType.CapacitySettlement,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ExchangeReactiveEnergy => MeteringPointType.ExchangeReactiveEnergy,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetProduction => MeteringPointType.CollectiveNetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetConsumption => MeteringPointType.CollectiveNetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedDownregulation => MeteringPointType.ActivatedDownregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedUpregulation => MeteringPointType.ActivatedUpregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualConsumption => MeteringPointType.ActualConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualProduction => MeteringPointType.ActualProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.InternalUse => MeteringPointType.InternalUse,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Unknown => throw new InvalidOperationException("Invalid MeteringPointType"),
        };
    }
}
