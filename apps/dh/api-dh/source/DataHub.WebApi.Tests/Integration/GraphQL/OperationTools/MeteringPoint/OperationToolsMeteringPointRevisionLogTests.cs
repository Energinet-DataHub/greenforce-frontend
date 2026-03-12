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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPointDebug.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.ClearMigrationEventsDeadLetterQueue.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.DeleteAllEventSourcingData.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.GetMeteringPointMigratedCount.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.RebuildProjections.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.ReplayMigrationEventsDeadLetterQueue.V1;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.OperationTools.MeteringPoint;

public class OperationToolsMeteringPointRevisionLogTests
{
    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.GetOperationToolsMeteringPointAsync")]
    public async Task GetOperationToolsMeteringPoint()
    {
        var operation =
            $$"""
                query($id: String!) {
                  operationToolsMeteringPoint(id: $id) {
                    meteringPointJson
                  }
                }
              """;

        var server = new GraphQLTestService();
        var result = Result<GetMeteringPointDebugResultDtoV1>.Success(
            new GetMeteringPointDebugResultDtoV1(
                MeteringPointJson: "{\"id\":\"570000000000000008\"}",
                MeteringPointWithRelationsJson: null,
                Events: []));

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<GetMeteringPointDebugQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "id", "570000000000000008" } });
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.GetMeteringPointMigratedCountAsync")]
    public async Task GetMeteringPointMigratedCount()
    {
        var operation =
            """
                query {
                  meteringPointMigratedCount
                }
            """;

        var server = new GraphQLTestService();
        var result = Result<GetMeteringPointMigratedCountResultDtoV1>.Success(
            new GetMeteringPointMigratedCountResultDtoV1(Count: 42));

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<GetMeteringPointMigratedCountQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation, []);
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.RebuildProjectionsAsync")]
    public async Task RebuildProjections()
    {
        var operation =
            """
                mutation($input: RebuildProjectionsInput!) {
                  rebuildProjections(input: $input) {
                    boolean
                  }
                }
            """;

        var server = new GraphQLTestService();
        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<RebuildProjectionsCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success());

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                {
                    "input", new Dictionary<string, object?>
                    {
                        { "projection", "METERING_POINT" },
                        { "timeout", 60 },
                    }
                },
            });
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.ReplayMigrationEventsDeadLetterQueueAsync")]
    public async Task ReplayMigrationEventsDeadLetterQueue()
    {
        var operation =
            """
                mutation {
                  replayMigrationEventsDeadLetterQueue {
                    replayMigrationEventsDeadLetterQueueResultDtoV1 {
                      dlqCount
                      processedCount
                    }
                  }
                }
            """;

        var server = new GraphQLTestService();
        var result = Result<ReplayMigrationEventsDeadLetterQueueResultDtoV1>.Success(
            new ReplayMigrationEventsDeadLetterQueueResultDtoV1(DlqCount: 10, ProcessedCount: 5));

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<ReplayMigrationEventsDeadLetterQueueCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation, []);
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.ClearMigrationEventsDeadLetterQueueAsync")]
    public async Task ClearMigrationEventsDeadLetterQueue()
    {
        var operation =
            """
                mutation {
                  clearMigrationEventsDeadLetterQueue {
                    clearMigrationEventsDeadLetterQueueResultDtoV1 {
                      dlqCount
                      processedCount
                    }
                  }
                }
            """;

        var server = new GraphQLTestService();
        var result = Result<ClearMigrationEventsDeadLetterQueueResultDtoV1>.Success(
            new ClearMigrationEventsDeadLetterQueueResultDtoV1(DlqCount: 10, ProcessedCount: 10));

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<ClearMigrationEventsDeadLetterQueueCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation, []);
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.DeleteAllEventSourcingDataAsync")]
    public async Task DeleteAllEventSourcingData()
    {
        var operation =
            """
                mutation {
                  deleteAllEventSourcingData {
                    boolean
                  }
                }
            """;

        var server = new GraphQLTestService();
        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<DeleteAllEventSourcingDataCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success());

        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation, []);
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.GetMeteringPointCountAsync")]
    public async Task GetMeteringPointCount()
    {
        var operation =
            """
                query {
                  meteringPointCount {
                    totalCount
                    quarantinedCount
                  }
                }
            """;

        var server = new GraphQLTestService();

        server.ElectricityMarketClientV1Mock.Setup(
                c => c.MeteringPointCountAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(new MeteringPointCountDto { TotalCount = 1000, QuarantinedCount = 5 });

        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation, []);
    }

    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.SyncJobSetJobVersionEventStoreExportAsync")]
    public async Task SyncJobSetJobVersionEventStoreExport()
    {
        var operation =
            """
                mutation($input: SyncJobSetJobVersionEventStoreExportInput!) {
                  syncJobSetJobVersionEventStoreExport(input: $input) {
                    boolean
                  }
                }
            """;

        var server = new GraphQLTestService();

        server.ElectricityMarketClientV1Mock.Setup(
                c => c.SyncjobSetJobVersionEventStoreExportAsync(It.IsAny<DateTimeOffset?>(), It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .Returns(Task.CompletedTask);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                {
                    "input", new Dictionary<string, object?>
                    {
                        { "version", "2024-01-15T10:30:00Z" },
                    }
                },
            });
    }
}
