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

using Energinet.DataHub.ProcessManager.Abstractions.Api.OperatingIdentity.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;
using NodaTime;

using WorkflowAction = Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model.WorkflowAction;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive;

[ObjectType<MeteringPointProcess>]
public static partial class MeteringPointProcessNode
{
    [Query]
    public static async Task<IEnumerable<MeteringPointProcess>> GetMeteringPointProcessOverviewAsync(
        string meteringPointId,
        Interval created,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var query = new SearchWorkflowInstancesByMeteringPointIdQuery(
            userIdentity,
            meteringPointId,
            created.Start.ToDateTimeOffset(),
            created.End.ToDateTimeOffset());

        var workflowInstances = await processManagerClient.SearchWorkflowInstancesByMeteringPointIdQueryAsync(query, cancellationToken);

        return workflowInstances.Select(MapToMeteringPointProcess);
    }

    [Query]
    public static async Task<MeteringPointProcess?> GetMeteringPointProcessByIdAsync(
        string id,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var query = new GetWorkflowInstanceByIdQuery(userIdentity, Guid.Parse(id));

        var workflowInstanceWithSteps = await processManagerClient.GetWorkflowInstanceByIdQueryAsync(query, cancellationToken);

        return workflowInstanceWithSteps is not null ? MapToMeteringPointProcess(workflowInstanceWithSteps) : null;
    }

    public static async Task<ActorDto?> GetInitiatorAsync(
        [Parent] MeteringPointProcess process,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader) =>
        Enum.TryParse<EicFunction>(process.ActorRole, out var role)
            ? await dataLoader.LoadAsync((process.ActorNumber, role))
            : null;

    public static IEnumerable<MeteringPointProcessStep> GetSteps(
        [Parent] MeteringPointProcess process)
    {
        if (process.WorkflowSteps is null or { Count: 0 })
        {
            return [];
        }

        return process.WorkflowSteps.Select(step => new MeteringPointProcessStep(
            Id: step.Id.ToString(),
            Step: GetStepIdentifier(step),
            Comment: null, // TODO: REPLACE WHEN PROCESS MANAGER IS READY
            CompletedAt: step.Lifecycle.CompletedAt,
            DueDate: null, // DueDate was removed in ProcessManager 8.1.0
            ActorNumber: step.Actor?.ActorNumber.Value ?? string.Empty,
            ActorRole: step.Actor?.ActorRole.Name ?? string.Empty,
            State: MapStepStateToMeteringPointProcessState(step.Lifecycle.State),
            MessageId: step.ArchivedMessageId?.ToString(),
            Description: step.Description));
    }

    public static IEnumerable<WorkflowAction> GetAvailableActions(
        [Parent] MeteringPointProcess process)
    {
        // Return the action from the workflow instance as an array
        // Filter out NoAction to return an empty array when there are no actions
        return process.Actions is null ? [] : process.Actions.Where(a => a != WorkflowAction.NoAction);
    }

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.BusinessReason);
        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.CutoffDate);
        descriptor.Field(f => f.State);
        descriptor.Field("availableActions")
            .Type<ListType<NonNullType<EnumType<WorkflowAction>>>>()
            .Resolve(ctx => GetAvailableActions(ctx.Parent<MeteringPointProcess>()));
    }

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceDto workflowInstance) =>
        CreateMeteringPointProcess(
            workflowInstance.Id,
            workflowInstance.Lifecycle,
            workflowInstance.BusinessReason.Name,
            workflowInstance.BusinessReason,
            workflowInstance.ExpectedValidityDate,
            actions: workflowInstance.Actions.ToArray(),
            workflowSteps: null);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceWithStepsDto workflowInstanceWithSteps) =>
        CreateMeteringPointProcess(
            workflowInstanceWithSteps.Id,
            workflowInstanceWithSteps.Lifecycle,
            workflowInstanceWithSteps.BusinessReason.Name,
            workflowInstanceWithSteps.BusinessReason,
            workflowInstanceWithSteps.ExpectedValidityDate,
            actions: workflowInstanceWithSteps.Actions.ToArray(),
            workflowSteps: workflowInstanceWithSteps.Steps);

    private static MeteringPointProcess CreateMeteringPointProcess(
        Guid id,
        WorkflowInstanceLifecycleDto lifecycle,
        string businessReasonString,
        BusinessReason businessReason,
        DateTimeOffset? cuteoffDate = null,
        WorkflowAction[]? actions = null,
        IReadOnlyCollection<WorkflowStepInstanceDto>? workflowSteps = null)
    {
        var actorIdentity = lifecycle.CreatedBy as ActorIdentityDto;

        return new MeteringPointProcess(
            Id: id.ToString(),
            CreatedAt: lifecycle.CreatedAt,
            CutoffDate: cuteoffDate,
            BusinessReason: businessReason,
            ActorNumber: actorIdentity?.ActorNumber.Value ?? string.Empty,
            ActorRole: actorIdentity?.ActorRole.Name ?? string.Empty,
            State: MapWorkflowStateToMeteringPointProcessState(lifecycle.State, lifecycle.TerminationState),
            Actions: actions,
            WorkflowSteps: workflowSteps);
    }

    private static MeteringPointProcessState MapWorkflowStateToMeteringPointProcessState(
        WorkflowInstanceLifecycleState workflowState,
        WorkflowInstanceTerminationState? terminationState) =>
        workflowState switch
        {
            WorkflowInstanceLifecycleState.Pending or WorkflowInstanceLifecycleState.Sleeping => MeteringPointProcessState.Pending,
            WorkflowInstanceLifecycleState.Active => MeteringPointProcessState.Running,
            WorkflowInstanceLifecycleState.Terminated => MapWorkflowTerminationState(terminationState),
            _ => MeteringPointProcessState.Pending,
        };

    private static MeteringPointProcessState MapStepStateToMeteringPointProcessState(
        WorkflowStepInstanceLifecycleState stepState) =>
        stepState switch
        {
            WorkflowStepInstanceLifecycleState.Pending => MeteringPointProcessState.Pending,
            WorkflowStepInstanceLifecycleState.Completed => MeteringPointProcessState.Succeeded,
            _ => MeteringPointProcessState.Pending,
        };

    private static MeteringPointProcessState MapWorkflowTerminationState(WorkflowInstanceTerminationState? terminationState) =>
        terminationState switch
        {
            WorkflowInstanceTerminationState.Succeeded => MeteringPointProcessState.Succeeded,
            WorkflowInstanceTerminationState.Failed => MeteringPointProcessState.Failed,
            WorkflowInstanceTerminationState.Canceled => MeteringPointProcessState.Canceled,
            WorkflowInstanceTerminationState.Rejected => MeteringPointProcessState.Rejected,
            _ => MeteringPointProcessState.Failed,
        };

    /// <summary>
    /// Generates a step identifier based on the workflow's unique name and step sequence.
    /// Format: {PROCESS_NAME}_V{VERSION}_STEP_{SEQUENCE}
    /// Example: BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1
    /// </summary>
    private static string GetStepIdentifier(WorkflowStepInstanceDto step)
    {
        // Normalize the process name: replace dots and spaces with underscores, convert to uppercase
        var processName = step.UniqueName.Name
            .Replace(".", "_")
            .Replace(" ", string.Empty)
            .ToUpperInvariant();

        return $"{processName}_V{step.UniqueName.Version}_STEP_{step.Sequence}";
    }
}
