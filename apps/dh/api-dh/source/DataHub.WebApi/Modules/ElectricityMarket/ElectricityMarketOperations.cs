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

using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
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
            return await electricityMarketClient.MeteringPointAsync(filter, ct).ConfigureAwait(false);
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return null!;
        }
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeteringPointsGroupByPackageNumber>> GetMeteringPointsByGridAreaCodeAsync(
        string gridAreaCode,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        var response = await electricityMarketClient.MeteringPointDebugAsync(gridAreaCode, ct).ConfigureAwait(false);

        var grouped = response.GroupBy(x => x.Identification.Substring(10, 4));

        return grouped.Select(x => new MeteringPointsGroupByPackageNumber(x.Key, x));
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<string> GetDebugViewAsync(
       string meteringPointId,
       CancellationToken ct,
       [Service] IElectricityMarketClient_V1 electricityMarketClient) =>
            (await electricityMarketClient.MeteringPointDebugViewAsync(meteringPointId, ct).ConfigureAwait(false)).Result;

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<CPRResponse> GetMeteringPointContactCprAsync(
        long contactId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var user = httpContextAccessor.HttpContext.User;

        var request = new ContactCprRequestDto
        {
            ActorGln = user.GetActorNumber(),
            MarketRole = Enum.Parse<EicFunction>(user.GetActorMarketRole()),
        };

        return await electricityMarketClient.MeteringPointContactCprAsync(contactId, request, ct).ConfigureAwait(false);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeteringPointDto> GetMeteringPointAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient) =>
            await electricityMarketClient.MeteringPointAsync(meteringPointId, ct).ConfigureAwait(false);

    [Query]
    [UsePaging]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementPoint>> GetMeasurementsAsync(
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) =>
            await client.GetMeasurementsForDayAsync(query, ct).ConfigureAwait(false);
}
