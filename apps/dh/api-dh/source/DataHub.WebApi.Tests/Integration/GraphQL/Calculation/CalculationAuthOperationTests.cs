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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationAuthOperationTests
{
    private static readonly Guid _calculationId = new("7672fe0b-a693-40fa-ac60-b5f9e9efcba2");

    private static readonly string _calculationQueries =
    $$"""
    query {
      calculationById(id: "{{_calculationId}}") {
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
          calculationId: "{{_calculationId}}"
        }
      ) {
        boolean
      }
    }
    """;

    [Fact]
    public async Task ExecuteCalculationQueries_AnonymousAsync()
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationQueries)
            .SetUser(ClaimsPrincipalFactory.CreateAnonymous()));

        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ExecuteCalculationQueries_AuthenticatedAsync()
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationQueries)
            .SetUser(ClaimsPrincipalFactory.CreateAuthenticated()));

        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ExecuteCalculationMutations_AnonymousAsync()
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationMutations)
            .SetUser(ClaimsPrincipalFactory.CreateAnonymous()));

        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ExecuteCalculationMutations_AuthenticatedAsync()
    {
        var server = new GraphQLTestService();
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationMutations)
            .SetUser(ClaimsPrincipalFactory.CreateAuthenticated()));

        await result.MatchSnapshotAsync();
    }
}
