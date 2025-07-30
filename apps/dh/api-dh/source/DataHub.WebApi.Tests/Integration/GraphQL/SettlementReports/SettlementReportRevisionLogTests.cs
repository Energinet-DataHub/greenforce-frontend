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
using Energinet.DataHub.Reports.Abstractions.Model;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.Traits;
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
            new());
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.GetSettlementReportGridAreaCalculationsForPeriodAsync")]
    public async Task GetLatestCalculGetSettlementReportGridAreaCalculationsForPeriodAsyncationAsync()
    {
        var operation =
            $$"""
                query($gridAreaId: String[]!) {
                  settlementReportGridAreaCalculationsForPeriod(
                    gridAreaId: $gridAreaId,
                    calculationPeriod: { interval: { start: "2024-12-03T23:00:00.000Z", end: "2024-12-05T22:59:59.999Z" } })
                    {
                        id
                    }
                }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "first", 1 } });
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.RequestSettlementReportAsync")]
    public async Task RequestSettlementReportAsync()
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
            new() { { "first", 1 } });
    }

    [Fact]
    [RevisionLogTest("SettlementReportOperations.CancelSettlementReportAsync")]
    public async Task CancelSettlementReportAsync()
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
            new() { { "first", 1 } });
    }
}
