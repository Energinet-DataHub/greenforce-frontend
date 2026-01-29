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

public enum MeteringPointType
{
    Consumption = 0,
    Production = 1,
    Exchange = 2,
    VEProduction = 3,
    Analysis = 4,
    NotUsed = 5,
    SurplusProductionGroup6 = 6,
    NetProduction = 7,
    SupplyToGrid = 8,
    ConsumptionFromGrid = 9,
    WholesaleServicesOrInformation = 10,
    OwnProduction = 11,
    NetFromGrid = 12,
    NetToGrid = 13,
    TotalConsumption = 14,
    NetLossCorrection = 15,
    ElectricalHeating = 16,
    NetConsumption = 17,
    OtherConsumption = 18,
    OtherProduction = 19,
    CapacitySettlement = 20,
    ExchangeReactiveEnergy = 21,
    CollectiveNetProduction = 22,
    CollectiveNetConsumption = 23,
    ActivatedDownregulation = 24,
    ActivatedUpregulation = 25,
    ActualConsumption = 26,
    ActualProduction = 27,
    InternalUse = 28,
}
