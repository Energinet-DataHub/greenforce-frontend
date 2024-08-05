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
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationProgressQueryTests
{
    private static readonly Guid _batchId = new("14098365-3231-40e3-8c1b-5a73dbab31c0");

    private static readonly string _calculationByIdQuery =
    $$"""
    {
      calculationById(id: "{{_batchId}}") {
        id
        progress {
          step
          status
        }
      }
    }
    """;

    [Theory]
    [InlineData(CalculationOrchestrationState.Scheduled)]
    [InlineData(CalculationOrchestrationState.Calculating)]
    [InlineData(CalculationOrchestrationState.CalculationFailed)]
    [InlineData(CalculationOrchestrationState.Calculated)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuing)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuingFailed)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueued)]
    [InlineData(CalculationOrchestrationState.Completed)]
    public async Task GetCalculationProgressAsync(CalculationOrchestrationState state) =>
        await ExecuteTestAsync(state);

    private static async Task ExecuteTestAsync(CalculationOrchestrationState orchestrationState)
    {
        GraphQLTestService.WholesaleClientV3Mock
            .Setup(x => x.GetCalculationAsync(_batchId, default))
            .ReturnsAsync(new CalculationDto()
            {
                CalculationId = _batchId,
                OrchestrationState = orchestrationState,
            });

        var result = await GraphQLTestService
            .ExecuteRequestAsync(b => b.SetQuery(_calculationByIdQuery));

        await result.MatchSnapshotAsync($"{orchestrationState}");
    }
}
