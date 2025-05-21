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

using System.Text;
using System.Text.Json;
using Azure.Security.KeyVault.Keys.Cryptography;
using Energinet.DataHub.MarketParticipant.Authorization.Extensions;
using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Extensions;
using Google.Protobuf.WellKnownTypes;
using HotChocolate.Authorization;
using Microsoft.IdentityModel.Tokens;
using EicFunction = Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1.EicFunction;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;
using Enum = System.Enum;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

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

    #endregion

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<CPRResponse> GetMeteringPointContactCprAsync(
        long contactId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 client)
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

        return await client.MeteringPointContactCprAsync(contactId, request, ct).ConfigureAwait(false);
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

        var accessValidationRequest = new MeteringPointMasterDataAccessValidationRequest
        {
            MeteringPointId = meteringPointId,
            ActorNumber = user.GetActorNumber(),
            MarketRole = Enum.Parse<EicFunctionAuth>(user.GetActorMarketRole()),
        };
        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var signatureJson = JsonSerializer.Serialize<Signature>(signature);
        var signatureByteArray = System.Text.Encoding.UTF8.GetBytes(signatureJson);
        var signatureBase64 = Base64UrlEncoder.Encode(signatureByteArray);
        var client = authorizedHttpClientFactory.CreateClientWithSignature(signatureBase64);

        return await client.MeteringPointAsync(meteringPointId, ct).ConfigureAwait(false);
    }
}
