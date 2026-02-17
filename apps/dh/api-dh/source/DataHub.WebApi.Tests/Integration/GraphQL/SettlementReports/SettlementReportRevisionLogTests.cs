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
using Energinet.DataHub.WebApi.Modules.SettlementReports.Client;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.SettlementReports;

public class SettlementReportRevisionLogTests
{
    private GraphQLTestService Server { get; set; }

    public SettlementReportRevisionLogTests()
    {
        Server = new GraphQLTestService();
        var mock = new Mock<ISettlementReportsClient>();
        Server.Services.AddSingleton(mock.Object);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.GetSettlementReportByIdAsync")]
    public async Task GetSettlementReportByIdAsync()
    {
        var operation =
            $$"""
                query($id: String!) {
                  settlementReportById(id: $id) {
                    id
                  }
                }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            Server,
            operation,
            new() { { "id", "1" } });
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.GetSettlementReportsAsync")]
    public async Task GetSettlementReportsAsync()
    {
        var operation =
            $$"""
              query {
                settlementReports {
                  id
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(Server, operation);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.GetSettlementReportGridAreaCalculationsForPeriodAsync")]
    public async Task GetSettlementReportGridAreaCalculationsForPeriodAsync()
    {
        var operation =
            $$"""
              query {
                settlementReportGridAreaCalculationsForPeriod(
                  calculationType: BALANCE_FIXING
                  gridAreaId: ["543"]
                  calculationPeriod: {
                    start: "2024-01-01T00:00:00.000Z"
                    end: "2024-01-31T23:59:59.999Z"
                  }
                ) {
                  key
                  value {
                    calculationId
                  }
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(Server, operation);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.RequestSettlementReportAsync")]
    public async Task RequestSettlementReportAsync()
    {
        var operation =
            $$"""
              mutation {
                requestSettlementReport(input: {
                  calculationType: BALANCE_FIXING
                  period: { start: "2024-01-01T00:00:00.000Z", end: "2024-01-31T23:59:59.999Z" }
                  gridAreasWithCalculations: [
                    { calculationId: "0197b1bb-3cc6-7e81-b685-435752e7191f", gridAreaCode: "543" }
                  ]
                  combineResultInASingleFile: false
                  preventLargeTextFiles: false
                  includeBasisData: false
                  energySupplier: "5790001330552"
                  csvLanguage: "en"
                  requestAsActorId: "5790001330552"
                  requestAsMarketRole: ENERGY_SUPPLIER
                }) {
                  boolean
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(Server, operation);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.CancelSettlementReportAsync")]
    public async Task CancelSettlementReportAsync()
    {
        var operation =
            $$"""
              mutation {
                cancelSettlementReport(input: {
                  id: "12345678-1234-1234-1234-123456789012"
                }) {
                  boolean
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(Server, operation);
    }
}
