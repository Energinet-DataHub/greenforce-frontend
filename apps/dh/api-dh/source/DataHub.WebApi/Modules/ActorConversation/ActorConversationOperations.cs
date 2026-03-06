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
        StartElectricalHeatingConversationInput? electricalHeatingConversationInput,
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

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        if (electricalHeatingConversationInput != null)
        {
            var startRequest = new StartElectricalHeatingConversationRequest
            {
                MeteringPointIdentification = startConversationInput.MeteringPointIdentification,
                InternalNote = startConversationInput.InternalNote,
                Content = startConversationInput.Content,
                Anonymous = startConversationInput.Anonymous,
                ElectricalHeatingFrom = electricalHeatingConversationInput.AddressEligibilityDate,
                ElectricalHeatingReductionPeriodFrom = electricalHeatingConversationInput.ChargeReductionPeriodFrom,
                ElectricalHeatingReductionPeriodTo = electricalHeatingConversationInput.ChargeReductionPeriodTo ?? DateTimeOffset.MaxValue,
            };

            foreach (var documentId in startConversationInput.AttachedDocumentIds)
            {
                startRequest.AttachedDocumentIds.Add(documentId);
            }

            var response = await authClient.ApiStartElectricalHeatingConversationAsync(
                userId.ToString(),
                actorNumber,
                startRequest,
                ct);

            return response.ConversationId.ToString();
        }
        else
        {
            var startRequest = new StartConversationRequest
            {
                Subject = startConversationInput.Subject,
                SenderActorType = MapMarketRoleToActorType(marketRole),
                ReceiverActorType = startConversationInput.Receiver,
                MeteringPointIdentification = startConversationInput.MeteringPointIdentification,
                InternalNote = startConversationInput.InternalNote,
                Content = startConversationInput.Content,
                Anonymous = startConversationInput.Anonymous,
                EnergySupplierDate = startConversationInput.EnergySupplierDate,
            };

            foreach (var documentId in startConversationInput.AttachedDocumentIds)
            {
                startRequest.AttachedDocumentIds.Add(documentId);
            }

            var response = await authClient.ApiStartConversationAsync(
                userId.ToString(),
                actorNumber,
                startRequest,
                ct);

            return response.ConversationId.ToString();
        }
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

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        var messageRequest = new AddConversationMessageRequest
        {
            ConversationId = sendActorConversationMessageInput.ConversationId,
            Content = sendActorConversationMessageInput.Content,
            Anonymous = sendActorConversationMessageInput.Anonymous,
        };

        foreach (var documentId in sendActorConversationMessageInput.AttachedDocumentIds)
        {
            messageRequest.AttachedDocumentIds.Add(documentId);
        }

        await authClient.ApiAddConversationMessageAsync(
            userId.ToString(),
            actorNumber,
            messageRequest,
            ct);

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> UpdateInternalConversationNoteAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        UpdateInternalConversationNoteInput updateInternalConversationNoteInput,
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
            throw new InvalidOperationException("User is not authorized to update internal conversation note.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        await authClient.ApiUpdateInternalNoteAsync(
            userId.ToString(),
            actorNumber,
            new UpdateInternalNoteRequest
            {
                ConversationId = updateInternalConversationNoteInput.ConversationId,
                InternalNote = updateInternalConversationNoteInput.InternalNote,
            },
            ct);

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> MarkConversationReadAsync(
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

        // Auth is not used for this operation, so just sets a randomsignature
        var authRequest = new AddActorConversationMessageRequest
        {
            ActorNumber = actorNumber,
            UserId = userId,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to mark conversation read.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        await authClient.ApiMarkConversationReadAsync(
            userId.ToString(),
            actorNumber,
            new MarkConversationReadRequest
            {
                ConversationId = conversationId,
            },
            ct);

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> MarkConversationUnReadAsync(
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

        // Auth is not used for this operation, so just sets a randomsignature
        var authRequest = new AddActorConversationMessageRequest
        {
            ActorNumber = actorNumber,
            UserId = userId,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to mark conversation unread.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        await authClient.ApiMarkConversationUnreadAsync(
            userId.ToString(),
            actorNumber,
            new MarkConversationUnreadRequest
            {
                ConversationId = conversationId,
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

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        try
        {
            await authClient.ApiCloseConversationAsync(
                userId.ToString(),
                actorNumber,
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

    private static ActorType MapMarketRoleToActorType(EicFunctionAuth marketRole)
    {
        return marketRole switch
        {
            EicFunctionAuth.EnergySupplier => ActorType.EnergySupplier,
            EicFunctionAuth.GridAccessProvider => ActorType.GridAccessProvider,
            EicFunctionAuth.DataHubAdministrator => ActorType.Energinet,
            _ => throw new InvalidOperationException($"Unsupported market role: {marketRole}"),
        };
    }
}
