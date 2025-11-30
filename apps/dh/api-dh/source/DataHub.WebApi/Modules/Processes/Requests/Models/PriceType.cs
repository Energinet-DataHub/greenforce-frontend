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

using ModelChargeType = Energinet.DataHub.WebApi.Model.ChargeType;
using ModelResolution = Energinet.DataHub.WebApi.Model.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record PriceType(
    string Name,
    ModelResolution? Resolution,
    ModelChargeType? ChargeType)
{
    public static readonly PriceType Tariff = new PriceType(nameof(Tariff), null, ModelChargeType.Tariff);
    public static readonly PriceType Subscription = new PriceType(nameof(Subscription), null, ModelChargeType.Subscription);
    public static readonly PriceType Fee = new PriceType(nameof(Fee), null, ModelChargeType.Fee);
    public static readonly PriceType TariffSubscriptionAndFee = new PriceType(nameof(TariffSubscriptionAndFee), null, null);
    public static readonly PriceType MonthlyTariff = new PriceType(nameof(MonthlyTariff), ModelResolution.Monthly, ModelChargeType.Tariff);
    public static readonly PriceType MonthlySubscription = new PriceType(nameof(MonthlySubscription), ModelResolution.Monthly, ModelChargeType.Subscription);
    public static readonly PriceType MonthlyFee = new PriceType(nameof(MonthlyFee), ModelResolution.Monthly, ModelChargeType.Fee);
    public static readonly PriceType MonthlyTariffSubscriptionAndFee = new PriceType(nameof(MonthlyTariffSubscriptionAndFee), ModelResolution.Monthly, null);

    public override string ToString() => Name;

    public static PriceType? FromSerialized(string? chargeType, string? resolution) =>
        resolution switch
        {
            null or "" => chargeType switch
            {
                nameof(ModelChargeType.Tariff) => Tariff,
                nameof(ModelChargeType.Subscription) => Subscription,
                nameof(ModelChargeType.Fee) => Fee,
                null or "" => TariffSubscriptionAndFee,
                _ => null,
            },
            nameof(ModelResolution.Monthly) => chargeType switch
            {
                nameof(ModelChargeType.Tariff) => MonthlyTariff,
                nameof(ModelChargeType.Subscription) => MonthlySubscription,
                nameof(ModelChargeType.Fee) => MonthlyFee,
                null or "" => MonthlyTariffSubscriptionAndFee,
                _ => null,
            },
            _ => null,
        };
}
