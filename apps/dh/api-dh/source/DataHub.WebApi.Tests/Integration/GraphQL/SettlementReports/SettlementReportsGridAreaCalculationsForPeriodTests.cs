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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class SettlementReportsGridAreaCalculationsForPeriodTests
{
    private static readonly string Query =
    $$"""
      query {
        settlementReportGridAreaCalculationsForPeriod(
          calculationType: BALANCE_FIXING
          gridAreaId: ["001", "002", "003", "004"]
          calculationPeriod: {
            start: "2024-12-31T23:00:00.000Z",
            end: "2025-01-12T22:59:59.999Z"
          }
        ) {
          key
          value {
            calculationId
          }
        }
      }
    """;

    [Fact]
    public async Task GetSettlementReportGridAreaCalculationsForPeriodAsync()
    {
        var server = new GraphQLTestService();

        server.WholesaleClientV3Mock
            .Setup(x => x.GetApplicableCalculationsAsync(
                CalculationType.BalanceFixing,
                It.IsAny<DateTimeOffset>(),
                It.IsAny<DateTimeOffset>(),
                It.IsAny<string[]>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("6047f21d-d271-4155-b78c-68a4bf2b2ffe"),
                    GridAreaCode = "001",
                },
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("27b3cfd1-065f-4fac-8006-fc8d2a60e5ab"),
                    GridAreaCode = "002",
                },
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("41e7d617-60b7-471a-b4dd-4c4069c3da97"),
                    GridAreaCode = "002",
                },
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("dd2b6d4b-20a6-469d-8655-02e64bbbf6b9"),
                    GridAreaCode = "003",
                },
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("36562fff-ea78-414f-a4ce-55820b335970"),
                    GridAreaCode = "003",
                },
                new SettlementReportApplicableCalculationDto()
                {
                    CalculationId = new Guid("4ef37b81-d733-4f07-ba59-a7ea1ed31977"),
                    GridAreaCode = "003",
                },
            ]);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(Query));
        await result.MatchSnapshotAsync();
    }
}
