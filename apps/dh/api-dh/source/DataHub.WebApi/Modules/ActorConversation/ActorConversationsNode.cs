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

using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using Energinet.DataHub.WebApi.Extensions;
using HotChocolate.Authorization;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

[ObjectType<GetConversationsQueryResponse>]
public static partial class ActorConversationsNode
{
    [Query]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<GetConversationsQueryResponse> GetConversationsForMeteringPointAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] IActorConversationClient_V1 actorConversationClient,
        string? meteringPointIdentification,
        string? searchTerm,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(httpContextAccessor.HttpContext);

        var user = httpContextAccessor.HttpContext.User;
        var marketParticipantNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());
        var userId = user.GetUserId();

        return await actorConversationClient.ApiGetConversationsAsync(
            meteringPointIdentification,
            searchTerm,
            null,
            null,
            null,
            null,
            null,
            userId: userId.ToString(),
            marketRole: MapMarketRoleToActorType(marketRole).ToString(),
            marketParticipantNumber: marketParticipantNumber,
            cancellationToken: ct);
    }

    static partial void Configure(
        IObjectTypeDescriptor<GetConversationsQueryResponse> descriptor)
    {
        descriptor
            .Name("Conversations")
            .BindFieldsExplicitly();

        descriptor
            .Field(f => f.Conversations);
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
