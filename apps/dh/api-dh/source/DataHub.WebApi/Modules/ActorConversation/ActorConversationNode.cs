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
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

public static class ActorConversationNode
{
    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> CreateConversationAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        string meteringPointIdentification,
        string conversationMessageContent,
        string userName,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());

        var authRequest = new CreateActorConversationRequest
        {
            ActorName = "Green Energy Supplier",
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = meteringPointIdentification,
            UserId = user.GetUserId(),
            UserName = userName,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null || (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested metering point.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature);

        await authClient.ApiStartConversationAsync(
         new StartConversationRequest
        {
            Subject = ConversationSubject.QuestionForEnerginet,
            MeteringPointIdentification = meteringPointIdentification,
            GlnNumberForReceivers = new List<string>(["22222222222222"]),
            InternalNote = "Internal note example",
            ConversationMessage =
            {
                SenderEmail = "test@test.dk",
                SenderGlnNumber = "12345678910111",
                Anonymous = false,
                Content = conversationMessageContent,
                CreatedBy = "xxxx",
            },
        },
         ct);

        return true;
    }
}
