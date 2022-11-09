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

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public enum MeteringPointType
    {
        Unknown = 0,
        D01VeProduction = 1,
        D02Analysis = 2,
        D03NotUsed = 3,
        D04SurplusProductionGroup6 = 4,
        D05NetProduction = 5,
        D06SupplyToGrid = 6,
        D07ConsumptionFromGrid = 7,
        D08WholeSaleServicesInformation = 8,
        D09OwnProduction = 9,
        D10NetFromGrid = 10,
        D11NetToGrid = 11,
        D12TotalConsumption = 12,
        D13NetLossCorrection = 13,
        D14ElectricalHeating = 14,
        D15NetConsumption = 15,
        D17OtherConsumption = 16,
        D18OtherProduction = 17,
        D20ExchangeReactiveEnergy = 18,
        D99InternalUse = 19,
        E17Consumption = 20,
        E18Production = 21,
        E20Exchange = 22,
    }
}
