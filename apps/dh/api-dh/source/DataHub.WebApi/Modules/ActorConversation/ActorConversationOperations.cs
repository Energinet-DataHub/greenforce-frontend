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
using Energinet.DataHub.WebApi.Modules.ActorConversation.Models;
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

public static partial class ActorConversationOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<string> StartConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        StartConversationInput startConversationInput,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        var authRequest = new CreateActorConversationRequest
        {
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = startConversationInput.MeteringPointIdentification,
            UserId = userId,
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
                InternalNote = startConversationInput.InternalNote,
                Content = startConversationInput.Content,
                Anonymous = startConversationInput.Anonymous,
            },
            ct);

        return response.ConversationId.ToString();
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> SendActorConversationMessageAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        SendActorConversationMessageInput sendActorConversationMessageInput,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);
        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var userId = user.GetUserId();

        var authRequest = new AddActorConversationMessageRequest
        {
            ActorNumber = actorNumber,
            UserId = userId,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested conversation.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        await authClient.ApiAddConversationMessageAsync(
            new AddConversationMessageRequest
            {
                ConversationId = sendActorConversationMessageInput.ConversationId,
                Content = sendActorConversationMessageInput.Content,
                Anonymous = sendActorConversationMessageInput.Anonymous,
            },
            ct);

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> CloseConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        Guid conversationId,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var userId = user.GetUserId();

        var authRequest = new CloseActorConversationRequest
        {
            ActorNumber = actorNumber,
            UserId = userId,
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
                },
                ct);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
