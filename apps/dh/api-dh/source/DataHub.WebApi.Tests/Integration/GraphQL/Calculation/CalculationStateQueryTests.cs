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

using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationStateQueryTests
{
    private static readonly string _calculationByIdQuery =
    $$"""
      query {
        calculationById(id: "{{OrchestrationInstanceFactory.Id}}") {
          id
          state
        }
      }
    """;

    [Theory]
    [InlineData(OrchestrationInstanceLifecycleState.Pending, null)]
    [InlineData(OrchestrationInstanceLifecycleState.Queued, null)]
    [InlineData(OrchestrationInstanceLifecycleState.Running, null)]
    [InlineData(OrchestrationInstanceLifecycleState.Terminated, OrchestrationInstanceTerminationState.Failed)]
    [InlineData(OrchestrationInstanceLifecycleState.Terminated, OrchestrationInstanceTerminationState.Succeeded)]
    [InlineData(OrchestrationInstanceLifecycleState.Terminated, OrchestrationInstanceTerminationState.UserCanceled)]
    public async Task GetCalculationStateAsync(
        OrchestrationInstanceLifecycleState lifecycleState,
        OrchestrationInstanceTerminationState? terminationState)
    {
        var server = new GraphQLTestService();

        server.CalculationsClientMock
            .Setup(x => x.GetCalculationByIdAsync(OrchestrationInstanceFactory.Id, default))
            .ReturnsAsync(CalculationFactory.Create(lifecycleState, terminationState));

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationByIdQuery)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        var snapshotNameSuffix = terminationState is null
            ? string.Empty
            : $"And{terminationState}";

        await result.MatchSnapshotAsync($"{lifecycleState}{snapshotNameSuffix}");
    }
}