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
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
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
            Step: GetStepIdentifier(process.ReasonCode, step),
            Comment: null, // TODO: REPLACE WHEN PROCESS MANAGER IS READY
            CompletedAt: step.Lifecycle.CompletedAt,
            DueDate: null, // DueDate was removed in ProcessManager 8.1.0
            ActorNumber: step.Actor?.ActorNumber.Value ?? string.Empty,
            ActorRole: step.Actor?.ActorRole.Name ?? string.Empty,
            State: MapStepStateToProcessState(step.Lifecycle.State),
            MessageId: step.ArchivedMessageId?.ToString()));
    }

    public static IEnumerable<WorkflowAction> GetAvailableActions(
        [Parent] MeteringPointProcess process)
    {
        // Return the action from the workflow instance as an array
        // Filter out NoAction to return an empty array when there are no actions
        return process.Action is null or WorkflowAction.NoAction ? [] : [process.Action.Value];
    }

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.ReasonCode);
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
            workflowInstance.ExpectedValidityDate,
            action: workflowInstance.Action,
            workflowSteps: null);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceWithStepsDto workflowInstanceWithSteps) =>
        CreateMeteringPointProcess(
            workflowInstanceWithSteps.Id,
            workflowInstanceWithSteps.Lifecycle,
            workflowInstanceWithSteps.BusinessReason.Name,
            workflowInstanceWithSteps.ExpectedValidityDate,
            action: null,
            workflowSteps: workflowInstanceWithSteps.Steps);

    private static MeteringPointProcess CreateMeteringPointProcess(
        Guid id,
        WorkflowInstanceLifecycleDto lifecycle,
        string businessReasonString,
        DateTimeOffset? cuteoffDate = null,
        WorkflowAction? action = null,
        IReadOnlyCollection<WorkflowStepInstanceDto>? workflowSteps = null)
    {
        var actorIdentity = lifecycle.CreatedBy as ActorIdentityDto;

        return new MeteringPointProcess(
            Id: id.ToString(),
            CreatedAt: lifecycle.CreatedAt,
            CutoffDate: cuteoffDate,
            ReasonCode: businessReasonString,
            ActorNumber: actorIdentity?.ActorNumber.Value ?? string.Empty,
            ActorRole: actorIdentity?.ActorRole.Name ?? string.Empty,
            State: MapWorkflowStateToProcessState(lifecycle.State, lifecycle.TerminationState),
            Action: action,
            WorkflowSteps: workflowSteps);
    }

    private static ProcessState MapWorkflowStateToProcessState(
        WorkflowInstanceLifecycleState workflowState,
        WorkflowInstanceTerminationState? terminationState) =>
        workflowState switch
        {
            WorkflowInstanceLifecycleState.Pending or WorkflowInstanceLifecycleState.Sleeping => ProcessState.Pending,
            WorkflowInstanceLifecycleState.Active => ProcessState.Running,
            WorkflowInstanceLifecycleState.Terminated => MapWorkflowTerminationState(terminationState),
            _ => ProcessState.Pending,
        };

    private static ProcessState MapStepStateToProcessState(
        WorkflowStepInstanceLifecycleState stepState) =>
        stepState switch
        {
            WorkflowStepInstanceLifecycleState.Pending => ProcessState.Pending,
            WorkflowStepInstanceLifecycleState.Completed => ProcessState.Succeeded,
            _ => ProcessState.Pending,
        };

    private static ProcessState MapWorkflowTerminationState(WorkflowInstanceTerminationState? terminationState) =>
        terminationState switch
        {
            WorkflowInstanceTerminationState.Succeeded => ProcessState.Succeeded,
            WorkflowInstanceTerminationState.Failed => ProcessState.Failed,
            WorkflowInstanceTerminationState.UserCanceled => ProcessState.Canceled,
            _ => ProcessState.Failed,
        };

    /// <summary>
    /// Generates a step identifier based on the workflow's business reason and step's sequence,
    /// and maps it to a known ProcessStepType enum value.
    /// Format: {REASON_CODE}_V{VERSION}_STEP_{SEQUENCE}
    /// Example: ENDOFSUPPLY_V1_STEP_1
    ///
    /// If the generated identifier doesn't match any known enum value, returns ProcessStepType.UNKNOWN.
    /// This allows new processes to work without breaking the application.
    /// </summary>
    private static ProcessStepType GetStepIdentifier(string reasonCode, WorkflowStepInstanceDto step)
    {
        var businessReason = reasonCode.ToUpperInvariant();

        var identifier = $"{businessReason}_V{step.UniqueName.Version}_STEP_{step.Sequence}";

        // Try to parse the identifier to a known ProcessStepType enum value
        if (Enum.TryParse<ProcessStepType>(identifier, ignoreCase: true, out var stepType))
        {
            return stepType;
        }

        // If not found, return UNKNOWN (new processes that haven't been added to the enum yet)
        return ProcessStepType.UNKNOWN;
    }
}
