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

using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeAccountingPointCharacteristics.V1.RequestConnectMeteringPoint;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Helpers;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using HotChocolate.Authorization;
using Microsoft.FeatureManagement;
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

    public static DateTimeOffset? CreatedDate([Parent] MeteringPointDto meteringPoint) =>
        FindCreatedDate(meteringPoint.MetadataTimeline);

    public static DateTimeOffset? ConnectionDate([Parent] MeteringPointDto meteringPoint) =>
        FindFirstConnectedDate(meteringPoint.MetadataTimeline);

    public static DateTimeOffset? ClosedDownDate([Parent] MeteringPointDto meteringPoint) =>
        FindClosedDownDate(meteringPoint.MetadataTimeline);

    #endregion

    [Query]
    [Authorize(Roles = new[] { "cpr:view" })]
    public static async Task<Clients.ElectricityMarket.v1.CPRResponse> GetMeteringPointContactCprAsync(
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
            var request = new Clients.ElectricityMarket.v1.ContactCprRequestDto
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
    public static async Task<MeteringPointDto> GetMeteringPointExistsAsync(
            string environment,
            bool searchMigratedMeteringPoints,
            long? internalMeteringPointId,
            long? meteringPointId,
            CancellationToken ct,
            [Service] Clients.ElectricityMarket.v1.IElectricityMarketClient_V1 electricityMarketClient_V1,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IRequestAuthorization requestAuthorization,
            [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
            [Service] IElectricityMarketClient electricityMarketClient,
            [Service] IFeatureManagerSnapshot featureManager)
    {
        if (internalMeteringPointId == null && meteringPointId == null)
        {
            throw new ArgumentException("Either internalMeteringPointId or meteringPointId must be provided.");
        }

        var meteringPointExternalID = meteringPointId?.ToString();

        if (meteringPointExternalID == null && internalMeteringPointId.HasValue)
        {
            var resultInternalEndpoint = await electricityMarketClient_V1.MeteringPointExistsInternalAsync(internalMeteringPointId.Value, ct).ConfigureAwait(false);

            meteringPointExternalID = resultInternalEndpoint.ExternalIdentification;
        }

        if (meteringPointExternalID == null)
        {
            throw new InvalidOperationException("Could not resolve metering point external ID.");
        }

        return await GetMeteringPointAsync(meteringPointExternalID, environment, searchMigratedMeteringPoints, ct, httpContextAccessor, requestAuthorization, authorizedHttpClientFactory, electricityMarketClient, featureManager);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<Clients.ElectricityMarket.v1.RelatedMeteringPointsDto> GetRelatedMeteringPointsAsync(
            string meteringPointId,
            CancellationToken ct,
            [Service] Clients.ElectricityMarket.v1.IElectricityMarketClient_V1 client) =>
                await client.MeteringPointRelatedAsync(meteringPointId, ct).ConfigureAwait(false);

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeteringPointDto> GetMeteringPointAsync(
        string meteringPointId,
        string? environment,
        bool? searchMigratedMeteringPoints,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        [Service] IElectricityMarketClient electricityMarketClient,
        [Service] IFeatureManagerSnapshot featureManager)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        // New metering points model
        if (environment != AppEnvironment.Prod)
        {
            var isNewMeteringPointsModelEnabled = await featureManager.IsEnabledAsync("PM120-DH3-METERING-POINTS-UI");

            if (isNewMeteringPointsModelEnabled)
            {
                if (environment == AppEnvironment.PreProd || searchMigratedMeteringPoints == false)
                {
                    return await GetMeteringPointWithNewModelAsync(meteringPointId, ct, electricityMarketClient).ConfigureAwait(false);
                }
            }
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
            var meteringPointDto = await authClient.MeteringPointAsync(meteringPointId, actorNumber, (EicFunction?)marketRole);
            var meteringPointResult = new MeteringPointDto
            {
                Id = meteringPointDto.Id.ToString(),
                Identification = meteringPointDto.Identification,
                Metadata = meteringPointDto.Metadata.MapToDto(),
                MetadataTimeline = [.. meteringPointDto.MetadataTimeline.Select(m => m.MapToDto())],
                CommercialRelation = meteringPointDto.CommercialRelation?.MapToDto(),
                CommercialRelationTimeline = [.. meteringPointDto.CommercialRelationTimeline.Select(m => m.MapToDto())],
            };
            return meteringPointResult;
        }

        throw new InvalidOperationException("User is not authorized to access the requested metering point.");
    }

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:connection-state-manage" })]
    public static async Task<bool> RequestConnectionStateChangeAsync(
        string meteringPointId,
        DateTimeOffset validityDate,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient)
    {
        var command = new RequestConnectMeteringPointCommandV1(
            new RequestConnectMeteringPointRequestV1(meteringPointId, validityDate));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }

    private static async Task<MeteringPointDto> GetMeteringPointWithNewModelAsync(
            string meteringPointId,
            CancellationToken ct,
            [Service] IElectricityMarketClient electricityMarketClient)
    {
        var result = await electricityMarketClient
        .SendAsync(new GetMeteringPointQueryV1(meteringPointId), ct)
        .ConfigureAwait(false);

        var meteringPoint = result.Data?.MeteringPoint ?? throw new InvalidOperationException("No MeteringPoint was returned");

        // Map to MeteringPointDto
        var meteringPointResult = new MeteringPointDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPoint.MeteringPointId),
            Identification = meteringPoint.MeteringPointId,
            Metadata = meteringPoint.MeteringPointPeriod.MapToDto(meteringPoint.MeteringPointId),
            MetadataTimeline = [.. meteringPoint.MeteringPointPeriods.Select(m => m.MapToDto(meteringPoint.MeteringPointId))],
            CommercialRelation = meteringPoint.CommercialRelation?.MapToDto(meteringPoint.MeteringPointId),
            CommercialRelationTimeline = [.. meteringPoint.CommercialRelations.Select(m => m.MapToDto(meteringPoint.MeteringPointId))],
        };
        return meteringPointResult;
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

    private static DateTimeOffset? FindCreatedDate(IEnumerable<MeteringPointMetadataDto> meteringPointPeriods)
    {
        var createdDate = meteringPointPeriods
            .Where(mp => mp.ConnectionState == ConnectionState.New)
            .OrderBy(mp => mp.ValidFrom)
            .FirstOrDefault();

        return createdDate?.ValidFrom;
    }
}
