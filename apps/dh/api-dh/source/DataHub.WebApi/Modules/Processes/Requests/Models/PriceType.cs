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

using static Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.BRS_028.V1.Model.RequestCalculatedWholesaleServicesInputV1;
using EdiTypes = Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public abstract record PriceType(
    string Name,
    EdiTypes.Resolution? Resolution,
    EdiTypes.ChargeType? ChargeType)
{
    public static readonly PriceType Tariff = new TariffType();
    public static readonly PriceType Subscription = new SubscriptionType();
    public static readonly PriceType Fee = new FeeType();
    public static readonly PriceType TariffSubscriptionAndFee = new TariffSubscriptionAndFeeType();
    public static readonly PriceType MonthlyTariff = new MonthlyTariffType();
    public static readonly PriceType MonthlySubscription = new MonthlySubscriptionType();
    public static readonly PriceType MonthlyFee = new MonthlyFeeType();
    public static readonly PriceType MonthlyTariffSubscriptionAndFee = new MonthlyTariffSubscriptionAndFeeType();

    private record TariffType()
        : PriceType(nameof(Tariff), null, EdiTypes.ChargeType.Tariff);

    private record SubscriptionType()
        : PriceType(nameof(Subscription), null, EdiTypes.ChargeType.Subscription);

    private record FeeType()
        : PriceType(nameof(Fee), null, EdiTypes.ChargeType.Fee);

    private record TariffSubscriptionAndFeeType()
        : PriceType(nameof(TariffSubscriptionAndFee), null, null);

    private record MonthlyTariffType()
        : PriceType(nameof(MonthlyTariff), EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Tariff);

    private record MonthlySubscriptionType()
        : PriceType(nameof(MonthlySubscription), EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Subscription);

    private record MonthlyFeeType()
        : PriceType(nameof(MonthlyFee), EdiTypes.Resolution.Monthly, EdiTypes.ChargeType.Fee);

    private record MonthlyTariffSubscriptionAndFeeType()
        : PriceType(nameof(MonthlyTariffSubscriptionAndFee), EdiTypes.Resolution.Monthly, null);

    public sealed override string ToString() => Name;

    public static PriceType? FromValues(string? chargeType, string? resolution) =>
        resolution switch
        {
            null or "" => chargeType switch
            {
                nameof(EdiTypes.ChargeType.Tariff) => Tariff,
                nameof(EdiTypes.ChargeType.Subscription) => Subscription,
                nameof(EdiTypes.ChargeType.Fee) => Fee,
                null or "" => TariffSubscriptionAndFee,
                _ => null,
            },
            nameof(EdiTypes.Resolution.Monthly) => chargeType switch
            {
                nameof(EdiTypes.ChargeType.Tariff) => MonthlyTariff,
                nameof(EdiTypes.ChargeType.Subscription) => MonthlySubscription,
                nameof(EdiTypes.ChargeType.Fee) => MonthlyFee,
                null or "" => MonthlyTariffSubscriptionAndFee,
                _ => null,
            },
            _ => null,
        };
}
