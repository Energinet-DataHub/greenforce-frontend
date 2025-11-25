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

using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using HotChocolate.Authorization;
using EicFunction = Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1.EicFunction;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;

[ObjectType<MeteringPointDto>]
public static partial class MeteringPointNode
{
    #region Computed fields on metering point
    public static string MeteringPointId([Parent] MeteringPointDto meteringPoint) => meteringPoint.Identification;

    public static bool IsChild([Parent] MeteringPointDto meteringPoint) => string.IsNullOrEmpty(meteringPoint.Metadata.ParentMeteringPoint) == false;

    public static bool IsEnergySupplier(string energySupplierActorGln, [Parent] MeteringPointDto meteringPoint) =>
        meteringPoint?.CommercialRelation?.EnergySupplier == energySupplierActorGln;

    public static bool IsGridAccessProvider(string gridAccessProviderActorGln, [Parent] MeteringPointDto meteringPoint) =>
        meteringPoint?.Metadata.OwnedBy == gridAccessProviderActorGln;

    public static DateTimeOffset? ElectricalHeatingStartDate([Parent] MeteringPointDto meteringPoint) => FindLastElectricalHeatingDto(meteringPoint)?.ValidFrom;

    public static bool HadElectricalHeating([Parent] MeteringPointDto meteringPoint) => FindLastElectricalHeatingDto(meteringPoint) != null;

    public static bool HaveElectricalHeating([Parent] MeteringPointDto meteringPoint)
    {
        var lastHeating = FindLastElectricalHeatingDto(meteringPoint);

        if (lastHeating == null)
        {
            return false;
        }

        return lastHeating.IsActive;
    }

    public static DateTimeOffset? ConnectionDate([Parent] MeteringPointDto meteringPoint) =>
        FindFirstConnectedDate(meteringPoint.MetadataTimeline);

    public static DateTimeOffset? ClosedDownDate([Parent] MeteringPointDto meteringPoint) =>
        FindClosedDownDate(meteringPoint.MetadataTimeline);

    #endregion

    [Query]
    [Authorize(Roles = new[] { "cpr:view" })]
    public static async Task<CPRResponse> GetMeteringPointContactCprAsync(
        string meteringPointId,
        long contactId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var user = httpContextAccessor.HttpContext.User;

        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var accessValidationRequest = new MeteringPointMasterDataAccessValidationRequest
        {
            MeteringPointId = meteringPointId,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);

        if ((signature.Result == SignatureResult.Valid || signature.Result == SignatureResult.NoContent) && signature.Signature != null)
        {
            var request = new ContactCprRequestDto
            {
                ActorGln = actorNumber,
                MarketRole = Enum.Parse<EicFunction>(user.GetMarketParticipantMarketRole()),
            };
            var authClient = authorizedHttpClientFactory.CreateElectricityMarketClientWithSignature(signature.Signature);
            return await authClient.MeteringPointContactCprAsync(meteringPointId, contactId, request, ct).ConfigureAwait(false);
        }

        throw new InvalidOperationException("User is not authorized to access the requested metering point.");
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeteringPointBasicDto> GetMeteringPointExistsAsync(
            long? internalMeteringPointId,
            long? meteringPointId,
            CancellationToken ct,
            [Service] IElectricityMarketClient_V1 client)
    {
            if (internalMeteringPointId.HasValue)
            {
                var resultExternal = await client.MeteringPointExistsInternalAsync(internalMeteringPointId.Value, ct).ConfigureAwait(false);

                return new MeteringPointBasicDto(
                    Id: resultExternal.InternalIdentification,
                    MeteringPointId: resultExternal.ExternalIdentification);
            }

            if (meteringPointId.HasValue)
            {
                var resultInternal = await client.MeteringPointExistsExternalAsync(meteringPointId.Value, ct).ConfigureAwait(false);

                return new MeteringPointBasicDto(
                    Id: resultInternal.InternalIdentification,
                    MeteringPointId: resultInternal.ExternalIdentification);
            }

            throw new ArgumentException("Either internalMeteringPointId or meteringPointId must be provided.");
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<RelatedMeteringPointsDto> GetRelatedMeteringPointsAsync(
            string meteringPointId,
            CancellationToken ct,
            [Service] IElectricityMarketClient_V1 client) =>
                await client.MeteringPointRelatedAsync(meteringPointId, ct).ConfigureAwait(false);

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeteringPointDto> GetMeteringPointAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var user = httpContextAccessor.HttpContext.User;

        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var accessValidationRequest = new MeteringPointMasterDataAccessValidationRequest
        {
            MeteringPointId = meteringPointId,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
        };
        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        if ((signature.Result == SignatureResult.Valid || signature.Result == SignatureResult.NoContent) && signature.Signature != null)
        {
            var authClient = authorizedHttpClientFactory.CreateElectricityMarketClientWithSignature(signature.Signature);
            return await authClient.MeteringPointAsync(meteringPointId, actorNumber, (EicFunction?)marketRole);
        }

        throw new InvalidOperationException("User is not authorized to access the requested metering point.");
    }

    [DataLoader]
    public static async Task<long> GetParentMeteringPointInternalIdAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory)
    {
        var meteringPoint = await GetMeteringPointAsync(meteringPointId, ct, httpContextAccessor, requestAuthorization, authorizedHttpClientFactory);

        return meteringPoint.Id;
    }

    private static ElectricalHeatingDto? FindLastElectricalHeatingDto(MeteringPointDto meteringPoint)
    {
        var orderedHeatingPeriods = meteringPoint.CommercialRelationTimeline.SelectMany(x => x.ElectricalHeatingPeriods).OrderBy(x => x.ValidFrom);

        var findWhenHeatingChanged = new List<ElectricalHeatingDto>();

        foreach (var period in orderedHeatingPeriods)
        {
            if (findWhenHeatingChanged.LastOrDefault()?.IsActive != period.IsActive)
            {
                findWhenHeatingChanged.Add(period);
            }
        }

        return findWhenHeatingChanged.LastOrDefault();
    }

    private static DateTimeOffset? FindFirstConnectedDate(IEnumerable<MeteringPointMetadataDto> meteringPointPeriods)
    {
        var connectedDate = meteringPointPeriods
            .Where(mp => mp.ConnectionState == ConnectionState.Connected)
            .OrderBy(mp => mp.ValidFrom)
            .FirstOrDefault();

        return connectedDate?.ValidFrom;
    }

    private static DateTimeOffset? FindClosedDownDate(IEnumerable<MeteringPointMetadataDto> meteringPointPeriods)
    {
        var closedDownDate = meteringPointPeriods
            .Where(mp => mp.ConnectionState == ConnectionState.ClosedDown)
            .OrderBy(mp => mp.ValidFrom)
            .FirstOrDefault();

        return closedDownDate?.ValidFrom;
    }
}
