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
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Telemetry;

public class GraphQLTelemetryTests(WebApiFactory factory, TelemetryFixture fixture)
    : WebApiTestBase(factory), IClassFixture<TelemetryFixture>
{
    private TelemetryFixture Fixture { get; } = fixture;

    private Guid CalculationId { get; } = Guid.NewGuid();

    private Mock<IFeatureManager> FeatureManagerMock { get; } = new();

    private Mock<ICalculationsClient> CalculationsClientMock { get; } = new();

    [Fact]
    public async Task GraphQLRequest_Should_CauseExpectedEventsToBeLogged()
    {
        await MakeGraphQLRequestAsync();

        var wasEventsLogged = await Fixture.QueryLogAnalyticsUntilCountAsync(
            $$"""
                let OperationId = AppRequests
                | where Url has "/graphql?GetCalculationById={{CalculationId}}"
                | project OperationId
                | take 1;
                let OperationIdScalar = toscalar(OperationId);
                let RelevantAppDependencies = AppDependencies
                | where Name contains "query { calculationById }" and OperationId == OperationIdScalar
                | project OperationId
                | take 1;
                let RelevantAppTraces = AppTraces
                | where Message contains "Executed endpoint 'Hot Chocolate GraphQL Pipeline'" and OperationId == OperationIdScalar
                | project OperationId
                | take 1;
                union RelevantAppDependencies, RelevantAppTraces
                | count
            """,
            2);

        wasEventsLogged.Should().BeTrue("Expected events was not logged to Application Insights within time limit.");
    }

    protected override void ConfigureMocks(IServiceCollection services)
    {
        CalculationsClientMock
            .Setup(x => x.GetCalculationByIdAsync(CalculationId, default))
            .ReturnsAsync(CalculationFactory.Create(id: CalculationId));
        services.AddSingleton(CalculationsClientMock.Object);
    }

    private async Task MakeGraphQLRequestAsync()
    {
        var query = $$"""
            query {
                calculationById(id: "{{CalculationId}}") {
                    id
                }
            }
        """;

        var requestBody = new { query };
        var json = JsonSerializer.Serialize(requestBody);
        await Client.PostAsync(
            $"/graphql?GetCalculationById={CalculationId}",
            new StringContent(json, Encoding.UTF8, "application/json"));
    }
}
