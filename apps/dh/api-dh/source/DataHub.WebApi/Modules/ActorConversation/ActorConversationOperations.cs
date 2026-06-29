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

using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Modules.ActorConversation.Models;
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

public static partial class ActorConversationOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<string> StartConversationAsync(
        [Service] ICommonExecutionContext executionContext,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        StartConversationInput startConversationInput,
        StartElectricalHeatingConversationInput? electricalHeatingConversationInput,
        CancellationToken ct)
    {
        var authClient = await authorizedHttpClientFactory.CreateActorConversationClientWithTokenAsync(
            new List<string> { startConversationInput.MeteringPointIdentification }, ct);

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
                executionContext.UserId.ToString(),
                executionContext.MarketParticipantNumber.ToString(),
                MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
                startRequest,
                ct);

            return response.ConversationId.ToString();
        }
        else
        {
            var startRequest = new StartConversationRequest
            {
                Subject = startConversationInput.Subject,
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
                executionContext.UserId.ToString(),
                executionContext.MarketParticipantNumber.ToString(),
                MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
                startRequest,
                ct);

            return response.ConversationId.ToString();
        }
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> SendActorConversationMessageAsync(
        [Service] ICommonExecutionContext executionContext,
        [Service] IActorConversationClient_V1 actorConversationClient,
        SendActorConversationMessageInput sendActorConversationMessageInput,
        CancellationToken ct)
    {
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

        await actorConversationClient.ApiAddConversationMessageAsync(
            executionContext.UserId.ToString(),
            executionContext.MarketParticipantNumber.ToString(),
            MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
            messageRequest,
            ct);

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> UpdateInternalConversationNoteAsync(
        [Service] ICommonExecutionContext executionContext,
        [Service] IActorConversationClient_V1 actorConversationClient,
        UpdateInternalConversationNoteInput updateInternalConversationNoteInput,
        CancellationToken ct)
    {
        await actorConversationClient.ApiUpdateInternalNoteAsync(
            executionContext.UserId.ToString(),
            executionContext.MarketParticipantNumber.ToString(),
            MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
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
        [Service] ICommonExecutionContext executionContext,
        [Service] IActorConversationClient_V1 actorConversationClient,
        Guid conversationId,
        CancellationToken ct)
    {
        await actorConversationClient.ApiMarkConversationReadAsync(
            executionContext.UserId.ToString(),
            executionContext.MarketParticipantNumber.ToString(),
            MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
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
        [Service] ICommonExecutionContext executionContext,
        [Service] IActorConversationClient_V1 actorConversationClient,
        Guid conversationId,
        CancellationToken ct)
    {
        await actorConversationClient.ApiMarkConversationUnreadAsync(
            executionContext.UserId.ToString(),
            executionContext.MarketParticipantNumber.ToString(),
            MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
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
        [Service] ICommonExecutionContext executionContext,
        [Service] IActorConversationClient_V1 actorConversationClient,
        Guid conversationId,
        CancellationToken ct)
    {
        try
        {
            await actorConversationClient.ApiCloseConversationAsync(
                executionContext.UserId.ToString(),
                executionContext.MarketParticipantNumber.ToString(),
                MapMarketRoleToActorType(executionContext.MarketRole).ToString(),
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
}
