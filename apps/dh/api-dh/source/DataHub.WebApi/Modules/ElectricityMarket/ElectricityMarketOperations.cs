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
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [UsePaging]
    public static async Task<IEnumerable<MeteringPointPeriodDto>> GetMeteringPointsAsync(
        string? filter,
        IResolverContext context,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return [];
        }

        try
        {
            var result = await electricityMarketClient.ElectricityMarketAsync(filter, ct).ConfigureAwait(false);
            context.ScopedContextData = context.ScopedContextData.SetItem("meteringPointId", result.Identification);
            return result.MeteringPointPeriod;
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return [];
        }
    }
}
