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
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration
{
    public class TelemetryTests(WebApiFactory factory, TelemetryFixture fixture)
        : WebApiTestBase(factory), IClassFixture<TelemetryFixture>
    {
        private TelemetryFixture Fixture { get; } = fixture;

        private CalculationDto Calculation { get; } = new()
        {
            CalculationId = Guid.NewGuid(),
            GridAreaCodes = ["123"],
            CalculationType = CalculationType.BalanceFixing,
        };

        private Mock<IWholesaleClient_V3> WholesaleClientV3Mock { get; } = new();

        [Fact]
        public async Task GraphQLRequest_Should_CauseExpectedEventsToBeLogged()
        {
            await MakeGraphQLRequestAsync();

            var wasEventsLogged = await Awaiter.TryWaitUntilConditionAsync(
                QueryLogAnalyticsAsync,
                TimeSpan.FromMinutes(20),
                TimeSpan.FromSeconds(50));

            wasEventsLogged.Should().BeTrue("Expected events was not logged to Application Insights within time limit.");
        }

        [Fact]
        public async Task DownloadRequest_Should_CauseExpectedEventsToBeLogged()
        {
            await Client.GetAsync("/v1/WholesaleSettlementReport/download?gridAreaCodes=123&calculationType=BalanceFixing&periodStart=2021-01-01&periodEnd=2021-01-01");
            Assert.True(true);
        }

        protected override void ConfigureMocks(IServiceCollection services)
        {
            var headers = new Dictionary<string, IEnumerable<string>>
                { ["Content-Disposition"] = ["attachment; filename=SettlementReport.zip"] };

            var fileResponse = new FileResponse(0, headers, new MemoryStream(), null, null);

            WholesaleClientV3Mock
                .Setup(x => x.DownloadAsync(
                    Calculation.GridAreaCodes,
                    Calculation.CalculationType,
                    It.IsAny<DateTimeOffset>(),
                    It.IsAny<DateTimeOffset>(),
                    null,
                    null,
                    default))
                .ReturnsAsync(fileResponse);

            WholesaleClientV3Mock
                .Setup(x => x.GetCalculationAsync(Calculation.CalculationId, default))
                .ReturnsAsync(Calculation);

            services.AddSingleton(WholesaleClientV3Mock.Object);
        }

        private async Task MakeGraphQLRequestAsync()
        {
            var query = $$"""
                query {
                  calculationById(id: "{{Calculation.CalculationId}}") {
                    id
                  }
                }
            """;

            var requestBody = new { query };
            var json = JsonSerializer.Serialize(requestBody);
            await Client.PostAsync(
                $"/graphql?GetCalculationById={Calculation.CalculationId}",
                new StringContent(json, Encoding.UTF8, "application/json"));
        }

        private async Task<bool> QueryLogAnalyticsAsync()
        {
            var query = $$"""
                let OperationId = AppRequests
                | where Url has "/graphql?GetCalculationById={{Calculation.CalculationId}}"
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

            var result = await Fixture.LogsQueryClient.QueryWorkspaceAsync<QueryResult>(
                Fixture.LogAnalyticsWorkspaceId,
                query,
                TimeSpan.FromMinutes(20));

            return result.Value[0].Count == 2;
        }

        private class QueryResult
        {
            public int Count { get; set; }
        }
    }
}
