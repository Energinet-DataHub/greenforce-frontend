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

using Energinet.DataHub.ProcessManager.Abstractions.Api.OrchestrationInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.FailedProcesses.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.FailedProcesses;

public static class FailedProcessOperations
{
    [Query]
    [Authorize(Roles = ["failed-processes-overview:view"])]
    [Authorize(Policy = "fas")]
    public static async Task<FailedProcessesResult> GetFailedProcessesAsync(
        IProcessManagerClient processManagerClient,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var query = new SearchSuspendedWorkflowInstancesQuery(userIdentity, pageSize: 100);

        var result = await processManagerClient.SearchSuspendedWorkflowInstancesAsync(query, cancellationToken);

        return new FailedProcessesResult(
            result.Instances.Select(MapToFailedProcess).ToList(),
            result.TotalCount);
    }

    private static FailedProcess MapToFailedProcess(SuspendedWorkflowInstanceDto instance)
    {
        var createdBy = instance.Lifecycle.CreatedBy;
        var orchestrationLifecycle = instance.SuspendedOrchestrationInstance.Lifecycle;

        return new FailedProcess(
            Id: instance.Id,
            BusinessReason: instance.BusinessReason,
            MeteringPointId: instance.MeteringPointId,
            ActorNumber: createdBy.ActorNumber?.Value ?? string.Empty,
            ActorRole: createdBy.ActorRole.Name,
            CreatedAt: instance.Lifecycle.CreatedAt,
            SuspendedAt: instance.Lifecycle.SuspendedAt,
            SuspendReason: MapSuspendReason(orchestrationLifecycle.SuspendReason),
            SuspendContext: orchestrationLifecycle.SuspendContext,
            OrchestrationInstanceId: instance.SuspendedOrchestrationInstance.Id);
    }

    private static FailedProcessSuspendReason MapSuspendReason(OrchestrationInstanceSuspendReason suspendReason) =>
        suspendReason switch
        {
            OrchestrationInstanceSuspendReason.RetryDurationExceeded => FailedProcessSuspendReason.RetryDurationExceeded,
            OrchestrationInstanceSuspendReason.UnhandledFailure => FailedProcessSuspendReason.UnhandledFailure,
            OrchestrationInstanceSuspendReason.UserRequested => FailedProcessSuspendReason.UserRequested,
            OrchestrationInstanceSuspendReason.OrchestrationFailed => FailedProcessSuspendReason.OrchestrationFailed,
            _ => FailedProcessSuspendReason.UnhandledFailure,
        };
}
