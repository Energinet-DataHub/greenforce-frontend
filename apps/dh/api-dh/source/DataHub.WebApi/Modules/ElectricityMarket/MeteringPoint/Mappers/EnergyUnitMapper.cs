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

public static class EnergyUnitMapper
{
    public static MeteringPointMeasureUnit MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit energyUnit)
    {
        return energyUnit switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Ampere => MeteringPointMeasureUnit.Ampere,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Stk => MeteringPointMeasureUnit.STK,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KVArh => MeteringPointMeasureUnit.KVArh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KWh => MeteringPointMeasureUnit.KWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KW => MeteringPointMeasureUnit.KW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MW => MeteringPointMeasureUnit.MW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MWh => MeteringPointMeasureUnit.MWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Tonne => MeteringPointMeasureUnit.Tonne,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MVAr => MeteringPointMeasureUnit.MVAr,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.DanishTariffCode => MeteringPointMeasureUnit.DanishTariffCode,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Unknown => throw new InvalidOperationException("Invalid EnergyUnit"),
        };
    }
}
