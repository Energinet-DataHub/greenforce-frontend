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
using Energinet.DataHub.WebApi.Modules.MarketParticipant;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation.Types;

[ObjectType<GetConversationQueryResponseParticipant>]
public static partial class ConversationParticipantDtoType
{
    public static async Task<string?> GetActorNameAsync(
        [Parent] GetConversationQueryResponseParticipant participant,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader,
        CancellationToken ct)
    {
        var actor = await dataLoader.LoadAsync(
            (participant.MarketParticipantNumber ?? string.Empty, MapRoleToEicFunction(participant.Role)),
            ct);
        return actor?.Name.Value;
    }

    static partial void Configure(IObjectTypeDescriptor<GetConversationQueryResponseParticipant> descriptor)
    {
        descriptor.Field(f => f.MarketParticipantNumber).Name("id");
        descriptor.Field(f => f.Role);
        descriptor.Field(f => f.MarketParticipantNumber);
        descriptor.Field(f => f.Type);
    }

    private static EicFunction MapRoleToEicFunction(MarketRole role)
    {
        return role switch
        {
            MarketRole.EnergySupplier => EicFunction.EnergySupplier,
            MarketRole.Energinet => EicFunction.DataHubAdministrator,
            MarketRole.GridAccessProvider => EicFunction.GridAccessProvider,
            _ => throw new ArgumentOutOfRangeException(nameof(role), role, "Unknown MarketRole"),
        };
    }
}
