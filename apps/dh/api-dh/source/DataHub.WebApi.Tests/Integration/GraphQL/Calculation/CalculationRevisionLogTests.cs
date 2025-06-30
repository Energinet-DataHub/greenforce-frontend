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
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.Traits;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationRevisionLogTests
{
    [Fact]
    [RevisionLogTest("CalculationOperations.GetCalculationByIdAsync")]
    public async Task GetCalculationByIdAsync()
    {
        var operation =
            $$"""
              query($id: UUID!) {
                calculationById(id: $id) {
                  id
                }
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new() { { "id", Guid.Parse("12a276b0-2d82-46a7-bb57-92876ed1e3f5") } });
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
}
