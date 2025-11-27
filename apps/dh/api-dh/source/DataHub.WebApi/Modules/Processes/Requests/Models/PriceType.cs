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

using Energinet.DataHub.EDI.B2CClient.Abstractions.Common;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record PriceType(
    string Name,
    ResolutionV1? Resolution,
    ChargeTypeV1? ChargeType)
{
    public static readonly PriceType Tariff = new PriceType(nameof(Tariff), null, ChargeTypeV1.Tariff);
    public static readonly PriceType Subscription = new PriceType(nameof(Subscription), null, ChargeTypeV1.Subscription);
    public static readonly PriceType Fee = new PriceType(nameof(Fee), null, ChargeTypeV1.Fee);
    public static readonly PriceType TariffSubscriptionAndFee = new PriceType(nameof(TariffSubscriptionAndFee), null, null);
    public static readonly PriceType MonthlyTariff = new PriceType(nameof(MonthlyTariff), ResolutionV1.Monthly, ChargeTypeV1.Tariff);
    public static readonly PriceType MonthlySubscription = new PriceType(nameof(MonthlySubscription), ResolutionV1.Monthly, ChargeTypeV1.Subscription);
    public static readonly PriceType MonthlyFee = new PriceType(nameof(MonthlyFee), ResolutionV1.Monthly, ChargeTypeV1.Fee);
    public static readonly PriceType MonthlyTariffSubscriptionAndFee = new PriceType(nameof(MonthlyTariffSubscriptionAndFee), ResolutionV1.Monthly, null);

    public override string ToString() => Name;

    public static PriceType? FromSerialized(string? chargeType, string? resolution) =>
        resolution switch
        {
            null or "" => chargeType switch
            {
                nameof(ChargeTypeV1.Tariff) => Tariff,
                nameof(ChargeTypeV1.Subscription) => Subscription,
                nameof(ChargeTypeV1.Fee) => Fee,
                null or "" => TariffSubscriptionAndFee,
                _ => null,
            },
            nameof(ResolutionV1.Monthly) => chargeType switch
            {
                nameof(ChargeTypeV1.Tariff) => MonthlyTariff,
                nameof(ChargeTypeV1.Subscription) => MonthlySubscription,
                nameof(ChargeTypeV1.Fee) => MonthlyFee,
                null or "" => MonthlyTariffSubscriptionAndFee,
                _ => null,
            },
            _ => null,
        };
}
