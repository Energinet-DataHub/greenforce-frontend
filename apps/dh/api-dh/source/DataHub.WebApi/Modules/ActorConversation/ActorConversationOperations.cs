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
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation;

public static class ActorConversationOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:actor-conversation"])]
    public static async Task<bool> CreateConversationAsync(
        [Service] IActorConversationClient_V1 client,
        string meteringPointIdentification,
        string conversationMessageContent,
        CancellationToken ct)
    {
        await client.ApiCreateConversationAsync(
         new StartConversationRequest
        {
            MeteringPointIdentification = meteringPointIdentification,
            ActorsGlnNumbers = new List<string>(["222222222222222222"]),
            ConversationMessage =
            {
                SenderEmail = "test@test.dk",
                Content = conversationMessageContent,
                Anonymous = false,
                CreatedBy = "xxxx",
                CreatedTime = DateTimeOffset.UtcNow,
            },
        },
         ct);

        return true;
    }
}
