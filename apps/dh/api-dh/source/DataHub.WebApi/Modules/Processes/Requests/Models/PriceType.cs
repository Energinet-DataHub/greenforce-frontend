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

using EdiTypes = Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public abstract record PriceType(
    string Name,
    EdiTypes.Resolution? Resolution,
    EdiTypes.ChargeType? ChargeType)
{
    public static readonly PriceType TariffSubscriptionAndFee = new TariffSubscriptionAndFeeType();
    public static readonly PriceType Tariff = new TariffType();
    public static readonly PriceType Subscription = new SubscriptionType();
    public static readonly PriceType Fee = new FeeType();
    public static readonly PriceType MonthlyTariff = new MonthlyTariffType();
    public static readonly PriceType MonthlySubscription = new MonthlySubscriptionType();
    public static readonly PriceType MonthlyFee = new MonthlyFeeType();
    public static readonly PriceType MonthlyTariffSubscriptionAndFee = new MonthlyTariffSubscriptionAndFeeType();

    private record TariffType() : PriceType("TARIFF", null, EdiTypes.ChargeType.Tariff);

    private record SubscriptionType() : PriceType("SUBSCRIPTION", null, EdiTypes.ChargeType.Subscription);

    private record FeeType() : PriceType("FEE", null, EdiTypes.ChargeType.Fee);

    private record TariffSubscriptionAndFeeType() : PriceType("TARIFF_SUBSCRIPTION_AND_FEE", null, null);

    private record MonthlyTariffType() : PriceType("MONTHLY_TARIFF", EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Tariff);

    private record MonthlySubscriptionType() : PriceType("MONTHLY_SUBSCRIPTION", EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Subscription);

    private record MonthlyFeeType() : PriceType("MONTHLY_FEE", EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Fee);

    private record MonthlyTariffSubscriptionAndFeeType() : PriceType("MONTHLY_TARIFF_SUBSCRIPTION_AND_FEE", EdiTypes.Resolution.Monthly, null);

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
}
