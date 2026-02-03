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

public static class AssetTypeMapper
{
    public static AssetType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.AssetType assetType)
    {
        return assetType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithBackPressureMode => AssetType.SteamTurbineWithBackPressureMode,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.GasTurbine => AssetType.GasTurbine,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombinedCycle => AssetType.CombinedCycle,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineGas => AssetType.CombustionEngineGas,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithCondensationSteam => AssetType.SteamTurbineWithCondensationSteam,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Boiler => AssetType.Boiler,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.StirlingEngine => AssetType.StirlingEngine,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PermanentConnectedElectricalEnergyStorageFacilities => AssetType.PermanentConnectedElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities => AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.FuelCells => AssetType.FuelCells,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PhotoVoltaicCells => AssetType.PhotoVoltaicCells,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WindTurbines => AssetType.WindTurbines,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.HydroelectricPower => AssetType.HydroelectricPower,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WavePower => AssetType.WavePower,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.MixedProduction => AssetType.MixedProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.ProductionWithElectricalEnergyStorageFacilities => AssetType.ProductionWithElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PowerToX => AssetType.PowerToX,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.RegenerativeDemandFacility => AssetType.RegenerativeDemandFacility,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineDiesel => AssetType.CombustionEngineDiesel,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineBio => AssetType.CombustionEngineBio,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.NoTechnology => AssetType.NoTechnology,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.UnknownTechnology => AssetType.UnknownTechnology,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Unknown => null,
        };
    }

    public static AssetType? MapToDto(this Clients.ElectricityMarket.v1.AssetType assetType)
    {
        return assetType switch
        {
            Clients.ElectricityMarket.v1.AssetType.SteamTurbineWithBackPressureMode => AssetType.SteamTurbineWithBackPressureMode,
            Clients.ElectricityMarket.v1.AssetType.GasTurbine => AssetType.GasTurbine,
            Clients.ElectricityMarket.v1.AssetType.CombinedCycle => AssetType.CombinedCycle,
            Clients.ElectricityMarket.v1.AssetType.CombustionEngineGas => AssetType.CombustionEngineGas,
            Clients.ElectricityMarket.v1.AssetType.SteamTurbineWithCondensationSteam => AssetType.SteamTurbineWithCondensationSteam,
            Clients.ElectricityMarket.v1.AssetType.Boiler => AssetType.Boiler,
            Clients.ElectricityMarket.v1.AssetType.StirlingEngine => AssetType.StirlingEngine,
            Clients.ElectricityMarket.v1.AssetType.PermanentConnectedElectricalEnergyStorageFacilities => AssetType.PermanentConnectedElectricalEnergyStorageFacilities,
            Clients.ElectricityMarket.v1.AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities => AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities,
            Clients.ElectricityMarket.v1.AssetType.FuelCells => AssetType.FuelCells,
            Clients.ElectricityMarket.v1.AssetType.PhotoVoltaicCells => AssetType.PhotoVoltaicCells,
            Clients.ElectricityMarket.v1.AssetType.WindTurbines => AssetType.WindTurbines,
            Clients.ElectricityMarket.v1.AssetType.HydroelectricPower => AssetType.HydroelectricPower,
            Clients.ElectricityMarket.v1.AssetType.WavePower => AssetType.WavePower,
            Clients.ElectricityMarket.v1.AssetType.MixedProduction => AssetType.MixedProduction,
            Clients.ElectricityMarket.v1.AssetType.ProductionWithElectricalEnergyStorageFacilities => AssetType.ProductionWithElectricalEnergyStorageFacilities,
            Clients.ElectricityMarket.v1.AssetType.PowerToX => AssetType.PowerToX,
            Clients.ElectricityMarket.v1.AssetType.RegenerativeDemandFacility => AssetType.RegenerativeDemandFacility,
            Clients.ElectricityMarket.v1.AssetType.CombustionEngineDiesel => AssetType.CombustionEngineDiesel,
            Clients.ElectricityMarket.v1.AssetType.CombustionEngineBio => AssetType.CombustionEngineBio,
            Clients.ElectricityMarket.v1.AssetType.NoTechnology => AssetType.NoTechnology,
            Clients.ElectricityMarket.v1.AssetType.UnknownTechnology => AssetType.UnknownTechnology,
        };
    }
}
