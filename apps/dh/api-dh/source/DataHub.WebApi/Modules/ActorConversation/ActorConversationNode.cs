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

[ObjectType<ConversationDto>]
public static partial class ActorConversationNode
{
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
        var authRequest = new ReadActorConversationRequest
        {
            ActorNumber = actorNumber,
            MarketRole = marketRole,
            MeteringPointId = meteringPointIdentification,
            UserId = userId,
        };

        var signature = await requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            throw new InvalidOperationException("User is not authorized to access the requested conversation.");
        }

        var authClient = authorizedHttpClientFactory.CreateActorConversationClientWithSignature(signature.Signature, userId, actorNumber);

        return await authClient.ApiGetConversationAsync(conversationId, ct);
    }

    static partial void Configure(
        IObjectTypeDescriptor<ConversationDto> descriptor)
    {
        descriptor
            .Name("Conversation")
            .BindFieldsExplicitly();

        descriptor
            .Field(f => f.DisplayId.ToString())
            .Name("displayId");

        descriptor
            .Field(f => f.DisplayId)
            .Type<NonNullType<IdType>>()
            .Name("id");

        descriptor.Field(f => f.InternalNote);
        descriptor.Field(f => f.Subject);
        descriptor.Field(f => f.Closed);
        descriptor.Field(f => f.Messages);
    }
}
