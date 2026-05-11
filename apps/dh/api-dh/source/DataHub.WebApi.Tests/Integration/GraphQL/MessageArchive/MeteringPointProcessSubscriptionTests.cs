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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.OperatingIdentity.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.MessageArchive;

public class MeteringPointProcessSubscriptionTests
{
    private static readonly Guid _workflowInstanceId = Guid.Parse("6f1d24c8-8f64-4e9f-85ee-637de6d61512");

    private static readonly string _subscription =
    $$"""
      subscription {
        meteringPointProcessUpdated(
          meteringPointId: "571313180400000005"
          created: { start: "2025-01-01T00:00:00.000Z", end: "2025-01-31T23:59:59.999Z" }
        ) {
          id
          businessReason
          state
          availableActions
        }
      }
    """;

    [Fact]
    public async Task ExecuteMeteringPointProcessUpdatedAsync()
    {
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
        var server = new GraphQLTestService();
        var user = CreateUser();

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext { User = user });

        server.ProcessManagerClientMock
            .Setup(x => x.SearchWorkflowInstancesByMeteringPointIdQueryAsync(
                It.IsAny<SearchWorkflowInstancesByMeteringPointIdQuery>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync([CreateWorkflowInstance()]);

        var stream = (IResponseStream)await server.ExecuteRequestAsync(
            b => b
                .SetDocument(_subscription)
                .SetUser(user),
            cts.Token);

        var results = new List<string>();

        await foreach (var result in stream.ReadResultsAsync().WithCancellation(cts.Token))
        {
            results.Add(result.ToJson());
            break;
        }

        await results.MatchSnapshotAsync();
    }

    private static WorkflowInstanceDto CreateWorkflowInstance() =>
        new(
            Id: _workflowInstanceId,
            BusinessReason: BusinessReason.EndOfSupply,
            ExpectedValidityDate: new DateTimeOffset(2025, 1, 5, 0, 0, 0, TimeSpan.Zero),
            TransactionId: "transaction-id",
            Lifecycle: new WorkflowInstanceLifecycleDto(
                CreatedBy: new ActorIdentityDto(
                    ActorNumber.Create("5790001330552"),
                    ActorRole.GridAccessProvider),
                State: WorkflowInstanceLifecycleState.Sleeping,
                TerminationState: null,
                CreatedAt: new DateTimeOffset(2025, 1, 1, 0, 0, 0, TimeSpan.Zero),
                TerminatedAt: null),
            Action: WorkflowAction.NoAction,
            Actions: [WorkflowAction.CancelWorkflow]);

    private static ClaimsPrincipal CreateUser() =>
        new(
            new ClaimsIdentity(
                new[]
                {
                    new Claim("azp", ClaimsPrincipalMocks.ActorId.ToString()),
                    new Claim(ClaimTypes.NameIdentifier, Guid.Parse("c5d4ad21-6c26-4dd2-a99f-ecefc3574b11").ToString()),
                    new Claim("actornumber", "5790001330552"),
                    new Claim("marketroles", ActorRole.GridAccessProvider.Name),
                },
                "MockedAuthenticationType"));
}
