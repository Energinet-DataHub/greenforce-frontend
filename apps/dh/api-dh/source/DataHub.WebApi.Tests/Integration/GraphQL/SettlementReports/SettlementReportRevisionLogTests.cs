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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using FluentAssertions;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.SettlementReports;

public class SettlementReportRevisionLogTests
{
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
            operation,
            new() { { "id", "1" } });
    }

    [Fact]
    [RevisionLogTest("CalculationOperations.GetCalculationsAsync")]
    public async Task GetCalculationsAsync()
    {
        var operation =
            $$"""
              query ($first: Int!) {
                calculations(
                  input: {}
                  first: $first
                ) {
                  nodes {
                    id
                  }
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "first", 1 } });
    }

    [Fact]
    [RevisionLogTest("CalculationOperations.GetLatestCalculationAsync")]
    public async Task GetLatestCalculationAsync()
    {
        var operation =
            $$"""
              query ($calculationType: StartCalculationType!) {
                latestCalculation(
                  period: { interval: { start: "2024-12-03T23:00:00.000Z", end: "2024-12-05T22:59:59.999Z" } }
                  calculationType: $calculationType
                ) {
                  id
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "calculationType", StartCalculationType.BalanceFixing } });
    }

    [Fact]
    [RevisionLogTest("CalculationOperations.CreateCalculationAsync")]
    public async Task CreateCalculationAsync()
    {
        var operation =
            $$"""
              mutation (
                $calculationType: StartCalculationType!
                $executionType: CalculationExecutionType!
              ) {
                createCalculation(input: {
                  calculationType: $calculationType,
                  executionType: $executionType,
                  period: { yearMonth: "2025-01" }
                }) {
                  uuid
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new()
            {
                { "calculationType", StartCalculationType.CapacitySettlement },
                { "executionType", CalculationExecutionType.External },
            });
    }

    [Fact]
    [RevisionLogTest("CalculationOperations.CancelScheduledCalculationAsync")]
    public async Task CancelScheduledCalculationAsync()
    {
        var operation =
            $$"""
              mutation ($id: UUID!) {
                cancelScheduledCalculation(input: { id: $id }) {
                  boolean
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "id", Guid.Parse("0197b1bb-3cc6-7e81-b685-435752e7191f") } });
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

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            []);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.GetSettlementReportGridAreaCalculationsForPeriodAsync")]
    public async Task GetSettlementReportGridAreaCalculationsForPeriodAsync()
    {
        // This test requires a custom implementation due to HttpContextAccessor requirements
        var actorId = Guid.NewGuid();
        var server = new GraphQLTestService();

        // Set up HttpContextAccessor with user claims
        server.HttpContextAccessorMock
            .Setup(accessor => accessor.HttpContext)
            .Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                [
                    new("azp", actorId.ToString()),
                ])),
            });

        // Mock the market participant client
        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(actorId, null))
            .ReturnsAsync(new ActorDto
            {
                MarketRole = new ActorMarketRoleDto
                {
                    EicFunction = EicFunction.EnergySupplier,
                },
            });

        // Mock calculations client to return empty results
        server.CalculationsClientMock
            .Setup(x => x.QueryCalculationsAsync(It.IsAny<CalculationsQueryInput>(), CancellationToken.None))
            .ReturnsAsync([]);

        // Set up revision log capture
        var loggedActivity = string.Empty;
        server.RevisionLogClientMock
            .Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<object?>(), It.IsAny<string?>(), It.IsAny<string?>()))
            .Returns<string, object?, string, string?>(async (activity, payload, affectedEntityType, affectedEntityKey) =>
            {
                loggedActivity = activity;
                await Task.CompletedTask;
            });

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

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(operation));

        // Verify no errors and revision log was called
        var operationResult = result as IOperationResult;
        operationResult.Should().NotBeNull();
        operationResult!.Errors.Should().BeNullOrEmpty();
        loggedActivity.Should().Be("settlementReportGridAreaCalculationsForPeriod");
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.RequestSettlementReportAsync")]
    public async Task RequestSettlementReportAsync()
    {
        var operation =
            $$"""
              mutation {
                requestSettlementReport(requestSettlementReportInput: {
                  calculationType: BALANCE_FIXING
                  period: { start: "2024-01-01T00:00:00.000Z", end: "2024-01-31T23:59:59.999Z" }
                  gridAreasWithCalculations: [
                    { calculationId: "0197b1bb-3cc6-7e81-b685-435752e7191f", gridAreaCode: "543" }
                  ]
                  combineResultInASingleFile: false
                  preventLargeTextFiles: false
                  includeMonthlySums: true
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

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            []);
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.CancelSettlementReportAsync")]
    public async Task CancelSettlementReportAsync()
    {
        var operation =
            $$"""
              mutation {
                cancelSettlementReport(input: {
                  requestId: { id: "12345678-1234-1234-1234-123456789012" }
                }) {
                  boolean
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            []);
    }
}
