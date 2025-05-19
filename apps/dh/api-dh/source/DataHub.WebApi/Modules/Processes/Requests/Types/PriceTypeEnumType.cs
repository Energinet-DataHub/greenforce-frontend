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
            .Name(PriceType.Tariff.Name);

        descriptor
            .Value(PriceType.Subscription)
            .Name(PriceType.Subscription.Name);

        descriptor
            .Value(PriceType.Fee)
            .Name(PriceType.Fee.Name);

        descriptor
            .Value(PriceType.TariffSubscriptionAndFee)
            .Name(PriceType.TariffSubscriptionAndFee.Name);

        descriptor
            .Value(PriceType.MonthlyTariff)
            .Name(PriceType.MonthlyTariff.Name);

        descriptor
            .Value(PriceType.MonthlySubscription)
            .Name(PriceType.MonthlySubscription.Name);

        descriptor
            .Value(PriceType.MonthlyFee)
            .Name(PriceType.MonthlyFee.Name);

        descriptor
            .Value(PriceType.MonthlyTariffSubscriptionAndFee)
            .Name(PriceType.MonthlyTariffSubscriptionAndFee.Name);
    }
}
