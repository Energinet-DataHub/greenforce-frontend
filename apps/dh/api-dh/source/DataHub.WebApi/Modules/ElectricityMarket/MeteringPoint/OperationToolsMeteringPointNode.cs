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

using System.Text.Json;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPointDebug.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.ClearMigrationEventsDeadLetterQueue.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.DeleteAllEventSourcingData.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.GetMeteringPointMigratedCount.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.GetProjectionsStatus.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.RebuildProjections.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Operations.ReplayMigrationEventsDeadLetterQueue.V1;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;

public static class OperationToolsMeteringPointNode
{
    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    public static async Task<string> GetDebugViewAsync(
        string meteringPointId,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .MeteringPointDebugViewAsync(meteringPointId, ct)
            .Then(r => r.Result);

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    [UseRevisionLog]
    public static async Task<string> GetMeteringPointDebugJsonAsync(
        string id,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .MeteringPointDebugJsonAsync(id, ct);

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    public static async Task<IEnumerable<MeteringPointsGroupByPackageNumber>> GetMeteringPointsByGridAreaCodeAsync(
        string gridAreaCode,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .MeteringPointDebugAsync(gridAreaCode, ct)
            .Then(r => r
                .GroupBy(x => x.Identification.Substring(10, 4))
                .Select(x => new MeteringPointsGroupByPackageNumber(x.Key, x))
                .OrderBy(x => x.PackageNumber));

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    [UseRevisionLog]
    public static async Task<MeteringPointCountDto> GetMeteringPointCountAsync(
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient.MeteringPointCountAsync(ct);

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    [UseRevisionLog]
    public static async Task<long> GetMeteringPointMigratedCountAsync(
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient.SendAsync(new GetMeteringPointMigratedCountQueryV1(), ct);
        return !result.IsSuccess || !result.HasData
            ? throw new InvalidOperationException($"Failed to get metering point migrated count: {result.DiagnosticMessage}.")
            : result.Data.Count;
    }

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    [UseRevisionLog]
    public static async Task<GetMeteringPointDebugResultDtoV1?> GetOperationToolsMeteringPointAsync(
        string id,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient.SendAsync(new GetMeteringPointDebugQueryV1(id), ct);
        return !result.IsSuccess
            ? throw new InvalidOperationException($"Failed to get metering point {id}: {result.DiagnosticMessage}.")
            : result.Data;
    }

    [Query]
    [Authorize(Roles = ["operation-tools:view"])]
    [UseRevisionLog]
    public static async Task<GetProjectionsStatusResultDtoV1> GetProjectionsStatusAsync(
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient.SendAsync(new GetProjectionsStatusQueryV1(), ct);

        return !result.IsSuccess || !result.HasData
            ? throw new InvalidOperationException($"Failed to get projections status: {result.DiagnosticMessage}.")
            : result.Data;
    }

    [Mutation]
    [Authorize(Roles = ["operation-tools:manage"])]
    [UseRevisionLog]
    public static async Task<bool> RebuildProjectionsAsync(
        ProjectionType projection,
        int timeout,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .SendAsync(new RebuildProjectionsCommandV1(projection, timeout), ct)
            .Then(r => r.IsSuccess);

    [Mutation]
    [UseMutationConvention(Disable = true)]
    [Authorize(Roles = ["operation-tools:manage"])]
    [UseRevisionLog]
    public static async Task<ReplayMigrationEventsDeadLetterQueueResultDtoV1> ReplayMigrationEventsDeadLetterQueueAsync(
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient.SendAsync(new ReplayMigrationEventsDeadLetterQueueCommandV1(), ct);
        return !result.IsSuccess || !result.HasData
            ? throw new InvalidOperationException($"Failed to replay migration events dead letter queue: {result.DiagnosticMessage}.")
            : result.Data;
    }

    [Mutation]
    [UseMutationConvention(Disable = true)]
    [Authorize(Roles = ["operation-tools:manage"])]
    [UseRevisionLog]
    public static async Task<ClearMigrationEventsDeadLetterQueueResultDtoV1> ClearMigrationEventsDeadLetterQueueAsync(
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient.SendAsync(new ClearMigrationEventsDeadLetterQueueCommandV1(), ct);
        return !result.IsSuccess || !result.HasData
            ? throw new InvalidOperationException($"Failed to clear migration events dead letter queue: {result.DiagnosticMessage}.")
            : result.Data;
    }

    [Mutation]
    [Authorize(Roles = ["operation-tools:manage"])]
    [UseRevisionLog]
    public static async Task<bool> DeleteAllEventSourcingDataAsync(
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .SendAsync(new DeleteAllEventSourcingDataCommandV1(), ct)
            .Then(r => r.IsSuccess);

    [Mutation]
    [Authorize(Roles = ["operation-tools:manage"])]
    [UseRevisionLog]
    public static async Task<bool> SyncJobSetJobVersionEventStoreExportAsync(
        DateTimeOffset? version,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        CancellationToken ct) => await electricityMarketClient
            .SyncjobSetJobVersionEventStoreExportAsync(version, ct)
            .Then(() => true);
}
