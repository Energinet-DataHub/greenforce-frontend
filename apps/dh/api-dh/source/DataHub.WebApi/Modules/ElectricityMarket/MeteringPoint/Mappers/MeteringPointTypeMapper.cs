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

using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class MeteringPointTypeMapper
{
    public static Clients.ElectricityMarket.v1.MeteringPointType MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType type)
    {
        return type switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Consumption => Clients.ElectricityMarket.v1.MeteringPointType.Consumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Production => Clients.ElectricityMarket.v1.MeteringPointType.Production,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Exchange => Clients.ElectricityMarket.v1.MeteringPointType.Exchange,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.VEProduction => Clients.ElectricityMarket.v1.MeteringPointType.VEProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Analysis => Clients.ElectricityMarket.v1.MeteringPointType.Analysis,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NotUsed => Clients.ElectricityMarket.v1.MeteringPointType.NotUsed,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SurplusProductionGroup6 => Clients.ElectricityMarket.v1.MeteringPointType.SurplusProductionGroup6,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetProduction => Clients.ElectricityMarket.v1.MeteringPointType.NetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SupplyToGrid => Clients.ElectricityMarket.v1.MeteringPointType.SupplyToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ConsumptionFromGrid => Clients.ElectricityMarket.v1.MeteringPointType.ConsumptionFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.WholesaleServicesOrInformation => Clients.ElectricityMarket.v1.MeteringPointType.WholesaleServicesOrInformation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OwnProduction => Clients.ElectricityMarket.v1.MeteringPointType.OwnProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetFromGrid => Clients.ElectricityMarket.v1.MeteringPointType.NetFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetToGrid => Clients.ElectricityMarket.v1.MeteringPointType.NetToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.TotalConsumption => Clients.ElectricityMarket.v1.MeteringPointType.TotalConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetLossCorrection => Clients.ElectricityMarket.v1.MeteringPointType.NetLossCorrection,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ElectricalHeating => Clients.ElectricityMarket.v1.MeteringPointType.ElectricalHeating,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetConsumption => Clients.ElectricityMarket.v1.MeteringPointType.NetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherConsumption => Clients.ElectricityMarket.v1.MeteringPointType.OtherConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherProduction => Clients.ElectricityMarket.v1.MeteringPointType.OtherProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CapacitySettlement => Clients.ElectricityMarket.v1.MeteringPointType.CapacitySettlement,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ExchangeReactiveEnergy => Clients.ElectricityMarket.v1.MeteringPointType.ExchangeReactiveEnergy,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetProduction => Clients.ElectricityMarket.v1.MeteringPointType.CollectiveNetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetConsumption => Clients.ElectricityMarket.v1.MeteringPointType.CollectiveNetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedDownregulation => Clients.ElectricityMarket.v1.MeteringPointType.ActivatedDownregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedUpregulation => Clients.ElectricityMarket.v1.MeteringPointType.ActivatedUpregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualConsumption => Clients.ElectricityMarket.v1.MeteringPointType.ActualConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualProduction => Clients.ElectricityMarket.v1.MeteringPointType.ActualProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.InternalUse => Clients.ElectricityMarket.v1.MeteringPointType.InternalUse,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Unknown => throw new InvalidOperationException("Invalid MeteringPointType"),
        };
    }

    public static MeteringPointType MapToDto(this Clients.ElectricityMarket.v1.MeteringPointType type)
    {
        return type switch
        {
            Clients.ElectricityMarket.v1.MeteringPointType.Consumption => MeteringPointType.Consumption,
            Clients.ElectricityMarket.v1.MeteringPointType.Production => MeteringPointType.Production,
            Clients.ElectricityMarket.v1.MeteringPointType.Exchange => MeteringPointType.Exchange,
            Clients.ElectricityMarket.v1.MeteringPointType.VEProduction => MeteringPointType.VEProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.Analysis => MeteringPointType.Analysis,
            Clients.ElectricityMarket.v1.MeteringPointType.NotUsed => MeteringPointType.NotUsed,
            Clients.ElectricityMarket.v1.MeteringPointType.SurplusProductionGroup6 => MeteringPointType.SurplusProductionGroup6,
            Clients.ElectricityMarket.v1.MeteringPointType.NetProduction => MeteringPointType.NetProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.SupplyToGrid => MeteringPointType.SupplyToGrid,
            Clients.ElectricityMarket.v1.MeteringPointType.ConsumptionFromGrid => MeteringPointType.ConsumptionFromGrid,
            Clients.ElectricityMarket.v1.MeteringPointType.WholesaleServicesOrInformation => MeteringPointType.WholesaleServicesOrInformation,
            Clients.ElectricityMarket.v1.MeteringPointType.OwnProduction => MeteringPointType.OwnProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.NetFromGrid => MeteringPointType.NetFromGrid,
            Clients.ElectricityMarket.v1.MeteringPointType.NetToGrid => MeteringPointType.NetToGrid,
            Clients.ElectricityMarket.v1.MeteringPointType.TotalConsumption => MeteringPointType.TotalConsumption,
            Clients.ElectricityMarket.v1.MeteringPointType.NetLossCorrection => MeteringPointType.NetLossCorrection,
            Clients.ElectricityMarket.v1.MeteringPointType.ElectricalHeating => MeteringPointType.ElectricalHeating,
            Clients.ElectricityMarket.v1.MeteringPointType.NetConsumption => MeteringPointType.NetConsumption,
            Clients.ElectricityMarket.v1.MeteringPointType.OtherConsumption => MeteringPointType.OtherConsumption,
            Clients.ElectricityMarket.v1.MeteringPointType.OtherProduction => MeteringPointType.OtherProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.CapacitySettlement => MeteringPointType.CapacitySettlement,
            Clients.ElectricityMarket.v1.MeteringPointType.ExchangeReactiveEnergy => MeteringPointType.ExchangeReactiveEnergy,
            Clients.ElectricityMarket.v1.MeteringPointType.CollectiveNetProduction => MeteringPointType.CollectiveNetProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.CollectiveNetConsumption => MeteringPointType.CollectiveNetConsumption,
            Clients.ElectricityMarket.v1.MeteringPointType.ActivatedDownregulation => MeteringPointType.ActivatedDownregulation,
            Clients.ElectricityMarket.v1.MeteringPointType.ActivatedUpregulation => MeteringPointType.ActivatedUpregulation,
            Clients.ElectricityMarket.v1.MeteringPointType.ActualConsumption => MeteringPointType.ActualConsumption,
            Clients.ElectricityMarket.v1.MeteringPointType.ActualProduction => MeteringPointType.ActualProduction,
            Clients.ElectricityMarket.v1.MeteringPointType.InternalUse => MeteringPointType.InternalUse,
        };
    }
}
