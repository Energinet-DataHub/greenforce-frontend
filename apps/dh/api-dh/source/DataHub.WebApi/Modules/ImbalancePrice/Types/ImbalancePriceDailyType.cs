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

using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Modules.ImbalancePrice.Models;

namespace Energinet.DataHub.WebApi.Modules.ImbalancePrice.Types;

public class ImbalancePriceDailyType : ObjectType<ImbalancePricesDailyDto>
{
    protected override void Configure(IObjectTypeDescriptor<ImbalancePricesDailyDto> descriptor)
    {
        descriptor.Name("ImbalancePriceDaily");
        descriptor.Description("Imbalance price for a given date");

        descriptor.Field("status")
            .Resolve(context => context.Parent<ImbalancePricesDailyDto>().Status switch
            {
                ImbalancePricePeriodStatus.NoPrices => ImbalancePriceStatus.NoData,
                ImbalancePricePeriodStatus.Incomplete => ImbalancePriceStatus.InComplete,
                ImbalancePricePeriodStatus.Complete => ImbalancePriceStatus.Complete,
                _ => throw new ArgumentOutOfRangeException(nameof(ImbalancePricesDailyDto.Status)),
            });

        descriptor
            .Field("imbalancePricesDownloadImbalanceUrl")
            .Type<NonNullType<StringType>>()
            .Resolve(
                context =>
            {
                var httpContext = context.Service<IHttpContextAccessor>().HttpContext;
                var linkGenerator = context.Service<LinkGenerator>();
                var month = context.Variables.GetVariable<int>("month");
                var year = context.Variables.GetVariable<int>("year");
                return linkGenerator.GetUriByAction(
                    httpContext!,
                    "DownloadImbalancePrices",
                    "ImbalancePrices",
                    new { month, year });
            });
    }
}
