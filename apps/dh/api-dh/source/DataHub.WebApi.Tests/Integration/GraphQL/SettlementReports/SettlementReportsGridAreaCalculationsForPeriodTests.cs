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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.SettlementReports;

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
        var actorId = Guid.NewGuid();
        var mockedLifecycle = new OrchestrationInstanceLifecycleDto(
            null!,
            OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceTerminationState.Succeeded,
            null,
            DateTimeOffset.UtcNow,
            null,
            null,
            null,
            null);

        var server = new GraphQLTestService();
        server.HttpContextAccessorMock
            .Setup(accessor => accessor.HttpContext)
            .Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
                {
                    new("azp", actorId.ToString()),
                })),
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(actorId, null))
            .ReturnsAsync(new ActorDto
            {
                MarketRole = new ActorMarketRoleDto
                {
                    EicFunction = EicFunction.EnergySupplier,
                },
            });

        server.CalculationsClientMock
            .Setup(x => x.QueryCalculationsAsync(It.IsAny<CalculationsQueryInput>(), CancellationToken.None))
            .ReturnsAsync(
            [
                new WholesaleCalculationResultV1(
                    new Guid("6047f21d-d271-4155-b78c-68a4bf2b2ffe"),
                    mockedLifecycle,
                    [],
                    string.Empty,
                    new CalculationInputV1(
                        CalculationType: CalculationType.BalanceFixing,
                        IsInternalCalculation: false,
                        GridAreaCodes: ["001"],
                        PeriodStartDate: DateTimeOffset.UtcNow,
                        PeriodEndDate: DateTimeOffset.UtcNow.AddDays(30))),
                new WholesaleCalculationResultV1(
                    new Guid("27b3cfd1-065f-4fac-8006-fc8d2a60e5ab"),
                    mockedLifecycle,
                    [],
                    string.Empty,
                    new CalculationInputV1(
                        CalculationType: CalculationType.BalanceFixing,
                        IsInternalCalculation: false,
                        GridAreaCodes: ["002"],
                        PeriodStartDate: DateTimeOffset.UtcNow,
                        PeriodEndDate: DateTimeOffset.UtcNow.AddDays(30))),
                new WholesaleCalculationResultV1(
                    new Guid("dd2b6d4b-20a6-469d-8655-02e64bbbf6b9"),
                    mockedLifecycle,
                    [],
                    string.Empty,
                    new CalculationInputV1(
                        CalculationType: CalculationType.BalanceFixing,
                        IsInternalCalculation: false,
                        GridAreaCodes: ["003"],
                        PeriodStartDate: DateTimeOffset.UtcNow,
                        PeriodEndDate: DateTimeOffset.UtcNow.AddDays(30))),
            ]);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(Query));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task GetSettlementReportGridAreaCalculationsForPeriod_WrongGridArea_ThrowsException()
    {
        var actorId = Guid.NewGuid();

        var server = new GraphQLTestService();
        server.HttpContextAccessorMock
            .Setup(accessor => accessor.HttpContext)
            .Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
                {
                    new("azp", actorId.ToString()),
                })),
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(actorId, null))
            .ReturnsAsync(new ActorDto
            {
                MarketRole = new ActorMarketRoleDto
                {
                    EicFunction = EicFunction.GridAccessProvider,
                    GridAreas = [new ActorGridAreaDto { Id = Guid.NewGuid() }],
                },
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.GridAreaGetAsync(CancellationToken.None, null))
            .ReturnsAsync([]);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(Query));
        var errors = ((OperationResult)result).Errors ?? [];
        Assert.Single(errors, err => err.Exception is UnauthorizedAccessException);
    }
}
