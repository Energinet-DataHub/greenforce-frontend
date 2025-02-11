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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Types;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [Authorize(Policy = "fas")]
    [PreserveParentAs("meteringPoint")]
    public static async Task<MeteringPointDto> GetMeteringPointWithHistoryAsync(
        string? filter,
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

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<string> GetMeteringPointContactCprAsync(
        long contactId,
        ContactCprRequestDto request,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient) =>
            await electricityMarketClient.MeteringPointContactCprAsync(contactId, request, ct).ConfigureAwait(false);

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<MeteringPointDetails> GetMeteringPointAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        var result = await electricityMarketClient.ElectricityMarketAsync(meteringPointId, ct).ConfigureAwait(false);

        return new MeteringPointDetails(
            meteringPointId,
            result.CurrentCommercialRelation,
            result.CurrentMeteringPointPeriod);
    }
}
