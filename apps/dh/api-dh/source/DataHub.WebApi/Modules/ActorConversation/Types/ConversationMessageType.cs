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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation.Types;

[ObjectType<GetConversationQueryResponseConversationMessage>]
public static partial class ConversationMessageDtoType
{
    public static async Task<string?> GetActorNameAsync(
        [Parent] GetConversationQueryResponseConversationMessage message,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader,
        CancellationToken ct)
    {
        var actor = await dataLoader.LoadAsync(
            (message.ActorNumber ?? string.Empty, MapActorTypeToEicFunction(message.SenderType)),
            ct);
        return actor?.Name.Value;
    }

    public static async Task<string> GetUserNameAsync(
        [Parent] GetConversationQueryResponseConversationMessage message,
        IUserByIdDataLoader dataLoader,
        CancellationToken ct)
    {
        if (!Guid.TryParse(message.UserId, out var userId))
        {
            return string.Empty;
        }

        var user = await dataLoader.LoadAsync(userId, ct);

        return user?.Name ?? string.Empty;
    }

    public static bool IsSentByCurrentActor(
        [Parent] GetConversationQueryResponseConversationMessage message,
        [Service] IHttpContextAccessor httpContextAccessor)
    {
        var user = httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            return false;
        }

        var currentActorNumber = user.GetMarketParticipantNumber();
        return message.ActorNumber == currentActorNumber;
    }

    static partial void Configure(
        IObjectTypeDescriptor<GetConversationQueryResponseConversationMessage> descriptor)
    {
        descriptor
            .Name("ConversationMessage")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.UserMessage);
        descriptor.Field(f => f.MessageType);
        descriptor.Field(f => f.CreatedTime);
        descriptor.Field(f => f.SenderType);
        descriptor.Field(f => f.UserId);
        descriptor.Field(f => f.Anonymous);
        descriptor.Field(f => f.Attachments);
        descriptor.Field(f => f.ElectricalHeatingUserMessage);
        descriptor.Field(f => f.ElectricalHeatingInformation);
    }

    private static EicFunction MapActorTypeToEicFunction(MarketRole actorType)
    {
        return actorType switch
        {
            MarketRole.EnergySupplier => EicFunction.EnergySupplier,
            MarketRole.Energinet => EicFunction.DataHubAdministrator,
            MarketRole.GridAccessProvider => EicFunction.GridAccessProvider,
            _ => throw new ArgumentOutOfRangeException(nameof(actorType), actorType, "Unknown ActorType"),
        };
    }
}
