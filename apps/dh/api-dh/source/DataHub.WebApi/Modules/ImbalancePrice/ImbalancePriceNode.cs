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
using Energinet.DataHub.WebApi.Modules.ImbalancePrice.Client;
using Energinet.DataHub.WebApi.Modules.ImbalancePrice.Models;

using LocalPriceAreaCode = Energinet.DataHub.WebApi.Modules.Common.Enums.PriceAreaCode;

namespace Energinet.DataHub.WebApi.Modules.ImbalancePrice;

public static class ImbalancePriceNode
{
    [Query]
    public static async Task<ImbalancePricesOverview> GetImbalancePricesOverviewAsync(CancellationToken ct, [Service] IImbalancePriceClient client) => await client.GetImbalancePricesOverviewAsync(ct).ConfigureAwait(false);

    [Query]
    public static async Task<IEnumerable<ImbalancePricesDailyDto>> GetImbalancePricesForMonthAsync(
        int year,
        int month,
        LocalPriceAreaCode areaCode,
        CancellationToken ct,
        [Service] IImbalancePriceClient client) => await client.GetImbalancePricesForMonthAsync(year, month, areaCode, ct).ConfigureAwait(false);
}
