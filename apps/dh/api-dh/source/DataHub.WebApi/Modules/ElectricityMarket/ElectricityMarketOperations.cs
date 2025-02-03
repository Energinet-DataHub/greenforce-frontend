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
using Energinet.DataHub.WebApi.GraphQL.Attribute;
using HotChocolate.Authorization;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [Authorize(Policy = "fas")]
    [PreserveParentAs("meteringPoint")]
    public static async Task<MeteringPointDto> GetMeteringPointAsync(
        string? filter,
        IResolverContext context,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return null!;
        }

        try
        {
            return await electricityMarketClient.ElectricityMarketAsync(filter, ct).ConfigureAwait(false);
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return null!;
        }
    }
}
