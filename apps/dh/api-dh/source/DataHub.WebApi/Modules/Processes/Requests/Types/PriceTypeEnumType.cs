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
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

public class PriceTypeEnumType : EnumType<PriceType>
{
    protected override void Configure(IEnumTypeDescriptor<PriceType> descriptor)
    {
        descriptor
            .Name("PriceType")
            .BindValuesExplicitly();

        descriptor
            .Value(PriceType.Tariff)
            .Name("TARIFF");

        descriptor
            .Value(PriceType.Subscription)
            .Name("SUBSCRIPTION");

        descriptor
            .Value(PriceType.Fee)
            .Name("FEE");

        descriptor
            .Value(PriceType.TariffSubscriptionAndFee)
            .Name("TARIFF_SUBSCRIPTION_AND_FEE");

        descriptor
            .Value(PriceType.MonthlyTariff)
            .Name("MONTHLY_TARIFF");

        descriptor
            .Value(PriceType.MonthlySubscription)
            .Name("MONTHLY_SUBSCRIPTION");

        descriptor
            .Value(PriceType.MonthlyFee)
            .Name("MONTHLY_FEE");

        descriptor
            .Value(PriceType.MonthlyTariffSubscriptionAndFee)
            .Name("MONTHLY_TARIFF_SUBSCRIPTION_AND_FEE");
    }
}
