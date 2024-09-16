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

namespace Energinet.DataHub.WebApi.GraphQL.Enums;

public enum RequestCalculationDataType
{
    TariffSubscriptionAndFee = 0,
    Tariff = 1,
    Subscription = 2,
    Fee = 3,
    MonthlyTariff = 4,
    MonthlySubscription = 5,
    MonthlyFee = 6,
    MonthlyTariffSubscriptionAndFee = 7,
    AllEnergy = 13,
    Production = 8,
    FlexConsumption = 9,
    TotalConsumption = 10,
    NonProfiledConsumption = 11,
    Exchange = 12,
}
