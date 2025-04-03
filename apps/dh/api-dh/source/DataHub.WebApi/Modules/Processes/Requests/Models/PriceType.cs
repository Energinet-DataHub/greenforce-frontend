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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

// public static PriceType? FromValues(string? resolution, string? chargeType)
// {
//     Console.WriteLine(businessReason, settlementVersion);
//     return (businessReason, settlementVersion) switch
//     {
//         ("D03", null) => Aggregation,
//         ("D04", null) => BalanceFixing,
//         ("D05", null) => WholesaleFixing,
//         ("D32", "D01") => FirstCorrection,
//         ("D32", "D02") => SecondCorrection,
//         ("D32", "D03") => ThirdCorrection,
//         _ => null,
//     };
// }
public abstract record PriceType(
    string Name,
    string? Resolution,
    RequestWholesaleSettlementChargeTypeV2? ChargeType)
{
    public static readonly PriceType TariffSubscriptionAndFee = new TariffSubscriptionAndFeeType();
    public static readonly PriceType Tariff = new TariffType();
    public static readonly PriceType Subscription = new SubscriptionType();
    public static readonly PriceType Fee = new FeeType();
    public static readonly PriceType MonthlyTariff = new MonthlyTariffType();
    public static readonly PriceType MonthlySubscription = new MonthlySubscriptionType();
    public static readonly PriceType MonthlyFee = new MonthlyFeeType();
    public static readonly PriceType MonthlyTariffSubscriptionAndFee = new MonthlyTariffSubscriptionAndFeeType();

    private sealed record TariffType()
        : PriceType("TARIFF", null, TariffChargeType);

    private sealed record SubscriptionType()
        : PriceType("SUBSCRIPTION", null, SubscriptionChargeType);

    private sealed record FeeType()
        : PriceType("FEE", null, FeeChargeType);

    private sealed record TariffSubscriptionAndFeeType()
        : PriceType("TARIFF_SUBSCRIPTION_AND_FEE", null, null);

    private sealed record MonthlyTariffType()
        : PriceType("MONTHLY_TARIFF", MonthlyResolution, TariffChargeType);

    private sealed record MonthlySubscriptionType()
        : PriceType("MONTHLY_SUBSCRIPTION", MonthlyResolution, SubscriptionChargeType);

    private sealed record MonthlyFeeType()
        : PriceType("MONTHLY_FEE", MonthlyResolution, FeeChargeType);

    private sealed record MonthlyTariffSubscriptionAndFeeType()
        : PriceType("MONTHLY_TARIFF_SUBSCRIPTION_AND_FEE", MonthlyResolution, null);

    private static RequestWholesaleSettlementChargeTypeV2 SubscriptionChargeType => new() { Type = "D01" };

    private static RequestWholesaleSettlementChargeTypeV2 FeeChargeType => new() { Type = "D02" };

    private static RequestWholesaleSettlementChargeTypeV2 TariffChargeType => new() { Type = "D03" };

    private static string MonthlyResolution => "P1M";
}
