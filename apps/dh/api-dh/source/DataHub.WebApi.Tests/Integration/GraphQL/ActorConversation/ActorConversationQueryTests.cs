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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using FluentAssertions;
using HotChocolate;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using ActorConversationClient = Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using MarketParticipantClient = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.ActorConversation;

public class ActorConversationQueryTests
{
    private const string ActorNumber = "5790001330552";
    private const string MarketRole = "GridAccessProvider";
    private static readonly Guid CurrentUserId = Guid.Parse("c5d4ad21-6c26-4dd2-a99f-ecefc3574b11");

    private static readonly string _conversationQuery =
    """
    query GetConversation($conversationId: UUID!) {
      conversation(conversationId: $conversationId) {
        messages {
          userName
        }
      }
    }
    """;

    [Fact]
    public async Task GetConversation_AsGridAccessProvider_ResolvesMessageUserNameWithoutUsersViewPermission()
    {
        var server = new GraphQLTestService();
        var conversationId = Guid.Parse("2e4cab54-4f91-47bf-9235-dbe6279821f3");
        var senderUserId = Guid.Parse("07b780ec-7e5d-4ff2-a523-d5c06fdd2f99");
        var user = CreateGridAccessProviderUser();
        var actorConversationClientMock = new Mock<ActorConversationClient.IActorConversationClient_V1>();

        actorConversationClientMock
            .Setup(x => x.ApiGetConversationAsync(
                conversationId,
                CurrentUserId.ToString(),
                ActorNumber,
                MarketRole,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreateConversation(conversationId, senderUserId));

        server.Services.AddSingleton(actorConversationClientMock.Object);
        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext { User = user });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.UserAsync(senderUserId, It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ThrowsAsync(new MarketParticipantClient.ApiException(
                "Unauthorized",
                StatusCodes.Status401Unauthorized,
                "{\"title\":\"Unauthorized\",\"status\":401}",
                new Dictionary<string, IEnumerable<string>>(),
                null));

        server.MarketParticipantClientV1Mock
            .Setup(x => x.AuditIdentityPostAsync(
                It.Is<IEnumerable<Guid>>(ids => ids.Contains(senderUserId)),
                It.IsAny<CancellationToken>(),
                It.IsAny<string?>()))
            .ReturnsAsync([
                new MarketParticipantClient.AuditIdentityDto
                {
                    AuditIdentityId = senderUserId,
                    DisplayName = "Grid user",
                },
            ]);

        var result = await server.ExecuteRequestAsync(
            b => b
                .SetDocument(_conversationQuery)
                .SetVariableValues(new Dictionary<string, object?> { { "conversationId", conversationId } })
                .SetUser(user),
            CancellationToken.None);

        var operationResult = result.ExpectOperationResult();
        operationResult.Errors.Should().BeNullOrEmpty();
        GetMessageUserName(operationResult).Should().Be("Grid user");
        server.MarketParticipantClientV1Mock.Verify(
            x => x.UserAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>(), It.IsAny<string?>()),
            Times.Never);
    }

    private static ClaimsPrincipal CreateGridAccessProviderUser() =>
        new(
            new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, CurrentUserId.ToString()),
                    new Claim(ClaimTypes.Role, "metering-point:actor-conversation"),
                    new Claim("actornumber", ActorNumber),
                    new Claim("marketroles", MarketRole),
                ],
                "MockedAuthenticationType"));

    private static ActorConversationClient.GetConversationQueryResponse CreateConversation(Guid conversationId, Guid senderUserId) =>
        new()
        {
            DisplayId = conversationId,
            MeteringPointIdentification = "571313180000000001",
            InternalNote = null,
            Subject = ActorConversationClient.ConversationSubject.MeasurementData,
            Closed = false,
            PartOfConversations = true,
            Participants = [],
            Messages =
            [
                new ActorConversationClient.GetConversationQueryResponseConversationMessage
                {
                    UserId = senderUserId.ToString(),
                    ActorNumber = ActorNumber,
                    SenderType = ActorConversationClient.MarketRole.GridAccessProvider,
                    MessageType = ActorConversationClient.MessageType.UserMessage,
                    CreatedTime = DateTimeOffset.UtcNow,
                    Anonymous = false,
                    UserMessage = new ActorConversationClient.GetConversationQueryResponseUserMessage
                    {
                        Content = "Message content",
                    },
                    Attachments = [],
                },
            ],
        };

    private static string? GetMessageUserName(IExecutionResult result)
    {
        var json = JsonNode.Parse(result.ToJson());
        return json?["data"]?["conversation"]?["messages"]?[0]?["userName"]?.GetValue<string>();
    }
}
