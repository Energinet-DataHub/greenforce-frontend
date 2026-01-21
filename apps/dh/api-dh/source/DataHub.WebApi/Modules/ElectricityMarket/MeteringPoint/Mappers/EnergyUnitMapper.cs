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

public static class EnergyUnitMapper
{
    public static Clients.ElectricityMarket.v1.MeteringPointMeasureUnit MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit energyUnit)
    {
        return energyUnit switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Ampere => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.Ampere,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Stk => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.STK,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KVArh => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KVArh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KWh => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KW => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MW => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MWh => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Tonne => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.Tonne,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MVAr => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MVAr,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.DanishTariffCode => Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.DanishTariffCode,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Unknown => throw new InvalidOperationException("Invalid EnergyUnit"),
        };
    }

    public static MeteringPointMeasureUnit MapToDto(this Clients.ElectricityMarket.v1.MeteringPointMeasureUnit energyUnit)
    {
        return energyUnit switch
        {
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.Ampere => MeteringPointMeasureUnit.Ampere,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.STK => MeteringPointMeasureUnit.STK,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KVArh => MeteringPointMeasureUnit.KVArh,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KWh => MeteringPointMeasureUnit.KWh,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KW => MeteringPointMeasureUnit.KW,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MW => MeteringPointMeasureUnit.MW,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MWh => MeteringPointMeasureUnit.MWh,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.Tonne => MeteringPointMeasureUnit.Tonne,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.MVAr => MeteringPointMeasureUnit.MVAr,
            Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.DanishTariffCode => MeteringPointMeasureUnit.DanishTariffCode,
        };
    }
}
