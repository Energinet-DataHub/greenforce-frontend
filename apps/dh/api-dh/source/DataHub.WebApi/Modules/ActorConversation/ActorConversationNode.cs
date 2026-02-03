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
using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ActorConversation.Types;
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

[ObjectType<ConversationDto>]
public static partial class ActorConversationNode
{
    #region Computed fields on conversation

    public static string MeteringPointIdentification([Parent] ConversationDto conversation) =>
        conversation.MeteringPointIdentification;

    public static string DisplayId([Parent] ConversationDto conversation) =>
        conversation.DisplayId.ToString()!;

    public static string? InternalNote([Parent] ConversationDto conversation) =>
        conversation.InternalNote;

    public static ConversationSubject Subject([Parent] ConversationDto conversation) =>
        conversation.Subject;

    public static bool Closed([Parent] ConversationDto conversation) =>
        conversation.Closed;

    public static ICollection<ConversationMessageDto> Messages(
        [Parent] ConversationDto conversation) =>
        conversation.Messages;

    #endregion

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<string> StartConversationAsync(
        IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        StartConversationInputType startConversationInput,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        var authRequest = new CreateActorConversationRequest
        {
            ActorName = startConversationInput.ActorName,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = startConversationInput.MeteringPointIdentification,
            UserId = userId,
            UserName = startConversationInput.UserName,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested metering point.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        var response = await authClient.ApiStartConversationAsync(
            new StartConversationRequest
            {
                Subject = startConversationInput.Subject,
                ReceiverActorType = startConversationInput.Receiver,
                MeteringPointIdentification = startConversationInput.MeteringPointIdentification,
                SenderActorNumber = actorNumber,
                SenderActorName = startConversationInput.ActorName,
                SenderUserId = userId.ToString(),
                SenderUserName = startConversationInput.UserName,
                InternalNote = startConversationInput.InternalNote,
                Content = startConversationInput.Content,
                Anonymous = startConversationInput.Anonymous,
            },
            ct);

        return response.ConversationId.ToString();
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> CloseConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        Guid conversationId,
        string meteringPointIdentification,
        string userName,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        // TODO: Will be replaced with the CloseActorConversationRequest when implemented
        var authRequest = new CreateActorConversationRequest
        {
            ActorName = string.Empty,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = meteringPointIdentification,
            UserId = userId,
            UserName = userName,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested conversation.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        try
        {
            await authClient.ApiCloseConversationAsync(
                new CloseConversationRequest
                {
                    ConversationId = conversationId,
                    SenderActorNumber = actorNumber,
                    SenderUserId = userId.ToString(),
                    SenderUserName = userName,
                },
                ct);
            return true;
        }
        catch
        {
            return false;
        }
    }

    [Query]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<ConversationDto> GetConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        Guid conversationId,
        string meteringPointIdentification,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        // TODO: Will be replaced with the GetActorConversationRequest when implemented
        var authRequest = new CreateActorConversationRequest
        {
            ActorName = string.Empty,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = meteringPointIdentification,
            UserId = userId,
            UserName = string.Empty,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested conversation.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        return await authClient.ApiGetConversationApiGetConversationAsync(conversationId, ct);
    }

    [Query]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<ConversationsDto> GetConversationsForMeteringPointAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        string meteringPointIdentification,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        // TODO: Will be replaced with the ActorConversationsRequest when implemented
        var authRequest = new CreateActorConversationRequest
        {
            ActorName = string.Empty,
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = meteringPointIdentification,
            UserId = userId,
            UserName = string.Empty,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException(
                "User is not authorized to access conversations for the requested metering point.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        return await authClient.ApiGetConversationsAsync(meteringPointIdentification, ct);
    }

    static partial void Configure(
        IObjectTypeDescriptor<ConversationDto> descriptor)
    {
        descriptor.Name("Conversation");

        descriptor.Ignore(f => f.AdditionalProperties);
    }
}
