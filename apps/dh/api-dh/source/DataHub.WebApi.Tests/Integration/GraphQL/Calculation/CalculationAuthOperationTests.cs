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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationAuthOperationTests
{
    private static readonly string _calculationQueries =
    $$"""
      query {
        calculationById(id: "{{OrchestrationInstanceFactory.Id}}") {
          id
        }
        latestCalculation(
          period: { start: "2024-12-03T23:00:00.000Z", end: "2024-12-05T22:59:59.999Z" }
          calculationType: BALANCE_FIXING
        ) {
          id
        }
        calculations(
          input: {}
          first: 1
        ) {
          nodes {
            id
          }
        }
      }
    """;

    private static readonly string _calculationMutations =
    $$"""
      mutation {
        createCalculation(
          input: {
            executionType: INTERNAL
            period: { start: "2024-12-03T23:00:00.000Z", end: "2024-12-05T22:59:59.999Z" }
            gridAreaCodes: ["Dk1"]
            calculationType: BALANCE_FIXING
            scheduledAt: "2024-12-03T23:00:00.000Z"
          }
        ) {
          uuid
        }
        cancelScheduledCalculation(
          input: {
            calculationId: "{{OrchestrationInstanceFactory.Id}}"
          }
        ) {
          boolean
        }
      }
    """;

    private static readonly string _calculationSubscriptions =
    $$"""
      subscription {
        calculationUpdated {
          id
        }
      }
    """;

    [Theory]
    [InlineData(UserIdentity.Authenticated)]
    [InlineData(UserIdentity.Anonymous)]
    public async Task ExecuteCalculationQueriesAsync(UserIdentity userIdentity)
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationQueries)
            .SetUser(ClaimsPrincipalMocks.Create(userIdentity)));

        await result.MatchSnapshotAsync($"ExecuteCalculationQueries_{userIdentity}");
    }

    [Theory]
    [InlineData(UserIdentity.Authenticated)]
    [InlineData(UserIdentity.Anonymous)]
    public async Task ExecuteCalculationMutationsAsync(UserIdentity userIdentity)
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationMutations)
            .SetUser(ClaimsPrincipalMocks.Create(userIdentity)));

        await result.MatchSnapshotAsync($"ExecuteCalculationMutations_{userIdentity}");
    }

    [Theory]
    [InlineData(UserIdentity.Administrator)]
    [InlineData(UserIdentity.Authenticated)]
    [InlineData(UserIdentity.Anonymous)]
    public async Task ExecuteCalculationSubscriptionsAsync(UserIdentity userIdentity)
    {
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var server = new GraphQLTestService();

        // It seems like the test has to return actual data in order for the Authorize attribute
        // to block access. Perhaps the authorization works per emit rather than per request.
        server.CalculationsClientMock
            .Setup(x => x.GetCalculationByIdAsync(OrchestrationInstanceFactory.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(CalculationFactory.Create());

        server.CalculationsClientMock
            .Setup(x => x.GetNonTerminatedCalculationsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([CalculationFactory.Create()]);

        var stream = (IResponseStream)await server.ExecuteRequestAsync(
            b => b
                .SetDocument(_calculationSubscriptions)
                .SetUser(ClaimsPrincipalMocks.Create(userIdentity)),
            cts.Token);

        var results = new List<string>();

        await foreach (var result in stream.ReadResultsAsync().WithCancellation(cts.Token))
        {
            results.Add(result.ToJson());
        }

        await results.MatchSnapshotAsync($"ExecuteCalculationSubscriptions_{userIdentity}");
    }
}
