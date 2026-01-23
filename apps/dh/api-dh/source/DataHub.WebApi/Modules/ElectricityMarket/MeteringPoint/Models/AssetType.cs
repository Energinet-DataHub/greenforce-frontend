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
namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

public enum AssetType
{
    SteamTurbineWithBackPressureMode = 0,
    GasTurbine = 1,
    CombinedCycle = 2,
    CombustionEngineGas = 3,
    SteamTurbineWithCondensationSteam = 4,
    Boiler = 5,
    StirlingEngine = 6,
    PermanentConnectedElectricalEnergyStorageFacilities = 7,
    TemporarilyConnectedElectricalEnergyStorageFacilities = 8,
    FuelCells = 9,
    PhotoVoltaicCells = 10,
    WindTurbines = 11,
    HydroelectricPower = 12,
    WavePower = 13,
    MixedProduction = 14,
    ProductionWithElectricalEnergyStorageFacilities = 15,
    PowerToX = 16,
    RegenerativeDemandFacility = 17,
    CombustionEngineDiesel = 18,
    CombustionEngineBio = 19,
    NoTechnology = 20,
    UnknownTechnology = 21,
}
