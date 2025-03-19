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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;
using HotChocolate.Authorization;
using MarketParticipantClient = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<MeteringPointDto> GetMeteringPointWithHistoryAsync(
        string? filter,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return null!;
        }

        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId, ct)
            .ConfigureAwait(false);

        try
        {
            var marketRole = currentActor.MarketRole.EicFunction.ToElectricityMarketEicFunction();
            return await electricityMarketClient.MeteringPointAsync(filter, currentActor.ActorNumber.Value, marketRole.ToString(), null, ct).ConfigureAwait(false);
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return null!;
        }
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<IEnumerable<MeteringPointsGroupByPackageNumber>> GetMeteringPointsByGridAreaCodeAsync(
        string gridAreaCode,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId, ct)
            .ConfigureAwait(false);

        var marketRole = currentActor.MarketRole.EicFunction.ToElectricityMarketEicFunction();
        var response = await electricityMarketClient.MeteringPointDebugAsync(gridAreaCode, currentActor.ActorNumber.Value, marketRole.ToString(), null, ct).ConfigureAwait(false);

        var grouped = response.GroupBy(x => x.Identification.Substring(10, 4));

        return grouped.Select(x => new MeteringPointsGroupByPackageNumber(x.Key, x));
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<string> GetDebugViewAsync(
       string meteringPointId,
       CancellationToken ct,
       [Service] IHttpContextAccessor httpContextAccessor,
       [Service] IElectricityMarketClient_V1 electricityMarketClient,
       [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId, ct)
            .ConfigureAwait(false);

        var marketRole = currentActor.MarketRole.EicFunction.ToElectricityMarketEicFunction();
        var response = await electricityMarketClient
                                .MeteringPointDebugViewAsync(meteringPointId, currentActor.ActorNumber.Value, marketRole.ToString(), null, ct)
                                .ConfigureAwait(false);
        return response.Result;
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<CPRResponse> GetMeteringPointContactCprAsync(
        long contactId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId, ct)
            .ConfigureAwait(false);

        var request = new ContactCprRequestDto
        {
            ActorGln = currentActor.ActorNumber.Value,
            MarketRole = currentActor.MarketRole.EicFunction.ToElectricityMarketEicFunction(),
        };

        return await electricityMarketClient.MeteringPointContactCprAsync(contactId, request, ct).ConfigureAwait(false);
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<MeteringPointDto> GetMeteringPointAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId, ct)
            .ConfigureAwait(false);

        var marketRole = currentActor.MarketRole.EicFunction;
        return await electricityMarketClient.MeteringPointAsync(meteringPointId, currentActor.ActorNumber.Value, marketRole.ToString(), null, ct).ConfigureAwait(false);
    }

    [Query]
    [UsePaging]
    [Authorize(Policy = "fas")]
    public static async Task<IEnumerable<MeasurementPoint>> GetMeteringPointDataAsync(
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) =>
            await client.GetMeasurementsForDayAsync(query, ct).ConfigureAwait(false);
}
