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

public class ChargeLinkRevisionLogTests
{
    [Fact]
    [RevisionLogTest("ChargeLinkPeriodNode.GetChargeLinkPeriodsAsync")]
    public async Task GetChargeLinkPeriodsAsync()
    {
        var operation =
            $$"""
              query ($meteringPointId: String!) {
                chargeLinkPeriods(meteringPointId: $meteringPointId) {
                  charge {
                    id
                  }
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "meteringPointId", "571313180000000005" } });
    }

    [Fact]
    [RevisionLogTest("ChargeLinkMutations.StopChargeLinkAsync")]
    public async Task StopChargeLinkAsync()
    {
        var operation =
            $$"""
              mutation (
                $id: String!
                $stopDate: DateTime!
              ) {
                stopChargeLink(input: {
                  id: $id,
                  stopDate: $stopDate
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
                { "id", "eyJtZXRlcmluZ1BvaW50SWQiOiI1NzEzMTMxODAwMDAwMDAwMDUiLCJjaGFyZ2VJZCI6eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9fQ==" },
                { "stopDate", "2025-06-01T00:00:00Z" },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeLinkMutations.EditChargeLinkAsync")]
    public async Task EditChargeLinkAsync()
    {
        var operation =
            $$"""
              mutation (
                $id: String!
                $newStartDate: DateTime!
                $factor: Int!
              ) {
                editChargeLink(input: {
                  id: $id,
                  newStartDate: $newStartDate,
                  factor: $factor
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
                { "id", "eyJtZXRlcmluZ1BvaW50SWQiOiI1NzEzMTMxODAwMDAwMDAwMDUiLCJjaGFyZ2VJZCI6eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9fQ==" },
                { "newStartDate", "2025-01-01T00:00:00Z" },
                { "factor", 1 },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeLinkMutations.CreateChargeLinkAsync")]
    public async Task CreateChargeLinkAsync()
    {
        var operation =
            $$"""
              mutation (
                $chargeId: String!
                $meteringPointId: String!
                $newStartDate: DateTime!
                $factor: Int!
              ) {
                createChargeLink(input: {
                  chargeId: $chargeId,
                  meteringPointId: $meteringPointId,
                  newStartDate: $newStartDate,
                  factor: $factor
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
                { "chargeId", "eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9" },
                { "meteringPointId", "571313180000000005" },
                { "newStartDate", "2025-01-01T00:00:00Z" },
                { "factor", 1 },
            });
    }

    [Fact]
    [RevisionLogTest("ChargeLinkMutations.CancelChargeLinkAsync")]
    public async Task CancelChargeLinkAsync()
    {
        var operation =
            $$"""
              mutation ($id: String!) {
                cancelChargeLink(input: {
                  id: $id
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
                { "id", "eyJtZXRlcmluZ1BvaW50SWQiOiI1NzEzMTMxODAwMDAwMDAwMDUiLCJjaGFyZ2VJZCI6eyJ0eXBlIjowLCJjb2RlIjoiVEVTVCIsIm93bmVyIjoiMTIzNDU2Nzg5MCJ9fQ==" },
            });
    }
}
