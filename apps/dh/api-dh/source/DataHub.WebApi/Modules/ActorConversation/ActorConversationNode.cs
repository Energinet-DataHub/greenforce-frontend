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

using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetDataForActorDialogue.V2;
using Energinet.DataHub.ElectricityMarket.Abstractions.Shared;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using Energinet.DataHub.WebApi.Extensions;
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

[ObjectType<GetConversationQueryResponse>]
public static partial class ActorConversationNode
{
    [Query]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<GetConversationQueryResponse> GetConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IActorConversationClient_V1 actorConversationClient,
        Guid conversationId,
        string meteringPointIdentification,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var marketParticipantNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        return await actorConversationClient.ApiGetConversationAsync(
            conversationId,
            userId.ToString(),
            marketParticipantNumber,
            MapMarketRoleToActorType(marketRole).ToString(),
            ct);
    }

    public static string GetDisplayId(
        [Parent] GetConversationQueryResponse conversation) =>
        conversation.DisplayId?.ToString() ?? string.Empty;

    public static bool WasLatestMessageAnonymous(
        [Parent] GetConversationQueryResponse conversation,
        [Service] IHttpContextAccessor httpContextAccessor)
    {
        var messages = conversation.Messages;
        if (messages.Count == 0)
        {
            return false;
        }

        var currentActorNumber = httpContextAccessor.HttpContext?.User.GetMarketParticipantNumber();

        var latestMessageByCurrentActor = messages
            .Reverse()
            .FirstOrDefault(m => m.ActorNumber == currentActorNumber);

        if (latestMessageByCurrentActor == null)
        {
            return false;
        }

        return latestMessageByCurrentActor.Anonymous;
    }

    public static async Task<MeterPointInfoDto> GetMeteringPointInformationAsync(
        [Parent] GetConversationQueryResponse conversation,
        [Service] IElectricityMarketClient electricityMarketClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());

        // Get data from electricitymarket
        var res = await electricityMarketClient.SendAsync(new GetDataForActorDialogueQueryV2(conversation.MeteringPointIdentification, DateTimeOffset.UtcNow), CancellationToken.None);
        if (!res.IsSuccess || res.Data is null || res.Data.EnergySupplierId is null)
        {
            // TODO: log?
            return new MeterPointInfoDto
            {
                ConnectionState = null,
                Type = null,
                TimeResolution = null,
                Address = null,
            };
        }

        // Get if user is allowe to see all data
        var accessValidationRequest = new MeteringPointMasterDataAccessValidationRequest
        {
            MeteringPointId = conversation.MeteringPointIdentification,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
        };
        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var allowedToSeeMeterData = signature.Signature != null && signature.Result == SignatureResult.Valid;

        return new MeterPointInfoDto
        {
            ConnectionState = allowedToSeeMeterData ? res.Data.ConnectionState : null,
            Type = res.Data.Type,
            TimeResolution = res.Data.TimeResolution,
            Address = $"{res.Data.StreetName} {res.Data.BuildingNumber}, {res.Data.PostalCode} {res.Data.CityName}",
        };
    }

    static partial void Configure(
        IObjectTypeDescriptor<GetConversationQueryResponse> descriptor)
    {
        descriptor
            .Name("Conversation")
            .BindFieldsExplicitly();

        descriptor
            .Field(f => f.DisplayId)
            .Type<NonNullType<IdType>>()
            .Name("id");

        descriptor.Field(f => f.InternalNote);
        descriptor.Field(f => f.Subject);
        descriptor.Field(f => f.Closed);
        descriptor.Field(f => f.Messages);
        descriptor.Field(f => f.Participants);
        descriptor.Field(f => f.PartOfConversations);
    }

    private static MarketRole MapMarketRoleToActorType(EicFunctionAuth marketRole)
    {
        return marketRole switch
        {
            EicFunctionAuth.EnergySupplier => MarketRole.EnergySupplier,
            EicFunctionAuth.GridAccessProvider => MarketRole.GridAccessProvider,
            EicFunctionAuth.DataHubAdministrator => MarketRole.Energinet,
            _ => throw new InvalidOperationException($"Unsupported market role: {marketRole}"),
        };
    }

    public class MeterPointInfoDto
    {
        public required MeteringPointType? Type { get; set; }

        public required ConnectionState? ConnectionState { get; set; }

        public required TimeResolution? TimeResolution { get; set; }

        public required string? Address { get; set; }
    }
}
