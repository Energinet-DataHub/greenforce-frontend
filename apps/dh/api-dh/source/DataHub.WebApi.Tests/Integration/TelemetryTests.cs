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
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Monitor.Query;
using Energinet.DataHub.Core.TestCommon;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.Integration.Controllers;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration
{
    public class TelemetryTests : ControllerTestsBase
    {
        private BffWebApiFixture BffWebApiFixture { get; }

        private LogsQueryClient LogsQueryClient { get; }

        private Guid CalculationId { get; }

        public TelemetryTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
            BffWebApiFixture = bffWebApiFixture;
            LogsQueryClient = new LogsQueryClient(new DefaultAzureCredential());
            CalculationId = Guid.NewGuid();
        }

        [Fact]
        public async Task GraphQLRequest_Should_CauseExpectedEventsToBeLogged()
        {
            WholesaleClientV3Mock
                .Setup(x => x.GetCalculationAsync(CalculationId, default))
                .ReturnsAsync(new CalculationDto() { CalculationId = CalculationId });

            await MakeGraphQLRequest();

            var wasEventsLogged = await Awaiter.TryWaitUntilConditionAsync(
                () => QueryLogAnalytics(url: $"/graphql?GetCalculationById={CalculationId}"),
                TimeSpan.FromMinutes(20),
                TimeSpan.FromSeconds(50));

            wasEventsLogged.Should().BeTrue("Expected events was not logged to Application Insights within time limit.");
        }

        private async Task MakeGraphQLRequest()
        {
            var query = $$"""
                query {
                  calculationById(id: "{{CalculationId}}") {
                    id
                  }
                }
            """;

            //// BffClient.DefaultRequestHeaders.Add("Accept", "application/json");

            var requestBody = new { query };
            var json = JsonSerializer.Serialize(requestBody);
            await BffClient.PostAsync(
                $"/graphql?GetCalculationById={CalculationId}",
                new StringContent(json, Encoding.UTF8, "application/json"));
        }

        private async Task<bool> QueryLogAnalytics(string url)
        {
            var query = $$"""
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
            """;

            var result = await LogsQueryClient.QueryWorkspaceAsync<QueryResult>(BffWebApiFixture.LogAnalyticsWorkspaceId, query, TimeSpan.FromMinutes(20));
            return result.Value[0].Count == 2;
        }

        private class QueryResult
        {
            public int Count { get; set; }
        }
    }
}
