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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.GraphQL.Types.MeteringPoint;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    public async Task<IEnumerable<MeteringPointPeriod>> GetMeteringPointsAsync(
        string? filter,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return [];
        }

        try
        {
            var result = await electricityMarketClient.ElectricityMarketAsync(filter).ConfigureAwait(false);
            return result.MeteringPointPeriod.Select(x =>
                new MeteringPointPeriod(
                    result.Identification,
                    x.ValidFrom,
                    x.ValidTo,
                    x.CreatedAt,
                    x.GridAreaCode,
                    x.OwnenBy,
                    x.ConnectionState,
                    x.Type,
                    x.SubType,
                    x.Resolution,
                    x.Unit,
                    x.ProductId,
                    x.ScheduledMeterReadingMonth));
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return [];
        }
    }
}
