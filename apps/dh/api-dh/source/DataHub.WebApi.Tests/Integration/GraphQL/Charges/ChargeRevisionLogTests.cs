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

using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeRevisionLogTests
{
    [Fact]
    [RevisionLogTest("ChargeNode.GetChargeByIdAsync")]
    public async Task GetChargeByIdAsync()
    {
        var operation =
            $$"""
              query ($id: String!) {
                chargeById(id: $id) {
                  id
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "id", "eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9" } });
    }

    [Fact]
    [RevisionLogTest("ChargeNode.GetChargesByTypeAsync")]
    public async Task GetChargesByTypeAsync()
    {
        var operation =
            $$"""
              query ($type: ChargeType!) {
                chargesByType(type: $type) {
                  id
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "type", "TARIFF" } });
    }

    [Fact]
    [RevisionLogTest("ChargeNode.CreateChargeAsync")]
    public async Task CreateChargeAsync()
    {
        var operation =
            $$"""
              mutation (
                $code: String!
                $name: String!
                $description: String!
                $type: ChargeType!
                $resolution: ChargeResolution!
                $validFrom: DateTime!
                $vat: Boolean!
              ) {
                createCharge(input: {
                  code: $code,
                  name: $name,
                  description: $description,
                  type: $type,
                  resolution: $resolution,
                  validFrom: $validFrom,
                  vat: $vat
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "code", "TEST" },
                { "name", "Test Charge" },
                { "description", "Test Description" },
                { "type", "TARIFF" },
                { "resolution", "HOURLY" },
                { "validFrom", "2025-01-01T00:00:00Z" },
                { "vat", true },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeNode.UpdateChargeAsync")]
    public async Task UpdateChargeAsync()
    {
        var operation =
            $$"""
              mutation (
                $id: String!
                $name: String!
                $description: String!
                $cutoffDate: DateTime!
                $vat: Boolean!
                $transparentInvoicing: Boolean!
              ) {
                updateCharge(input: {
                  id: $id,
                  name: $name,
                  description: $description,
                  cutoffDate: $cutoffDate,
                  vat: $vat,
                  transparentInvoicing: $transparentInvoicing
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "id", "eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9" },
                { "name", "Updated Charge" },
                { "description", "Updated Description" },
                { "cutoffDate", "2025-01-01T00:00:00Z" },
                { "vat", true },
                { "transparentInvoicing", true },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeNode.StopChargeAsync")]
    public async Task StopChargeAsync()
    {
        var operation =
            $$"""
              mutation (
                $id: String!
                $terminationDate: DateTime!
              ) {
                stopCharge(input: {
                  id: $id,
                  terminationDate: $terminationDate
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "id", "eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9" },
                { "terminationDate", "2025-06-01T00:00:00Z" },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeNode.AddChargeSeriesAsync")]
    public async Task AddChargeSeriesAsync()
    {
        var operation =
            $$"""
              mutation (
                $id: String!
                $start: DateTime!
                $end: DateTime!
                $points: [ChargePointV2Input!]!
              ) {
                addChargeSeries(input: {
                  id: $id,
                  start: $start,
                  end: $end,
                  points: $points
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "id", "eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9" },
                { "start", "2025-01-01T00:00:00Z" },
                { "end", "2025-01-02T00:00:00Z" },
                { "points", new List<Dictionary<string, object?>> { new() { { "position", 1 }, { "priceAmount", 1.5m } } } },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeOverviewItemNode.GetChargeOverviewAsync")]
    public async Task GetChargeOverviewAsync()
    {
        var operation =
            $$"""
              query ($first: Int!) {
                chargeOverview(first: $first) {
                  nodes {
                    charge {
                      id
                    }
                  }
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "first", 1 } });
    }
}
