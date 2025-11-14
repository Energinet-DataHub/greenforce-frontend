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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_002.EndOfSupply.V1;
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
    [UsePaging]
    [UseSorting(typeof(MeteringPointProcessSortType))]
    public static async Task<IEnumerable<MeteringPointProcess>> GetMeteringPointProcessOverviewAsync(
        string meteringPointId,
        Interval created,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var query = new SearchWorkflowInstancesByMeteringPointQuery(
            MeteringPointId.Create(meteringPointId),
            created.Start.ToDateTimeOffset(),
            created.End.ToDateTimeOffset(),
            userIdentity);

        var workflowInstances = await processManagerClient.GetWorkflowInstancesByMeteringPointQueryAsync(query, cancellationToken);

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

        var query = new GetWorkflowInstanceByIdQuery(userIdentity, new WorkflowInstanceId(Guid.Parse(id)));

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
            Id: step.Id.Id.ToString(),
            Step: GetStepName(step),
            Comment: null, // TODO: REPLACE WHEN PROCESS MANAGER IS READY
            CreatedAt: step.Lifecycle.CreatedAt,
            DueDate: step.Lifecycle.DueDate,
            ActorNumber: step.Actor?.ActorNumber.Value ?? string.Empty,
            ActorRole: step.Actor?.ActorRole.Name ?? string.Empty,
            State: MapStepStateToProcessState(step.Lifecycle.State),
            MessageId: step.MessageId ?? "a7d4c835d67c4d0d88345e27d33c538b")); // MessageId which exists on test001
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
            action: workflowInstance.Action,
            workflowSteps: null);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceWithStepsDto workflowInstanceWithSteps) =>
        CreateMeteringPointProcess(
            workflowInstanceWithSteps.Id,
            workflowInstanceWithSteps.Lifecycle,
            workflowInstanceWithSteps.BusinessReason.Name,
            action: null,
            workflowSteps: workflowInstanceWithSteps.Steps);

    private static MeteringPointProcess CreateMeteringPointProcess(
        WorkflowInstanceId id,
        WorkflowInstanceLifecycleDto lifecycle,
        string businessReasonString,
        WorkflowAction? action = null,
        IReadOnlyCollection<WorkflowStepInstanceDto>? workflowSteps = null)
    {
        var actorIdentity = lifecycle.CreatedBy as ActorIdentityDto;

        return new MeteringPointProcess(
            Id: id.Value.ToString(),
            CreatedAt: lifecycle.CreatedAt,
            CutoffDate: lifecycle.CutoffDate ?? lifecycle.CreatedAt,
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

    private static string GetStepName(WorkflowStepInstanceDto step)
    {
        return step.UniqueName switch
        {
            var uniqueName when uniqueName == Brs_002_EndOfSupply.V1 => GetNameForEndOfSupplyV1Step(step.Sequence),
            _ => "Unknown Step",
        };
    }

    private static string GetNameForEndOfSupplyV1Step(int number)
    {
        return number switch
        {
            1 => "End of Supply Request",
            2 => "End of Supply Confirm",
            3 => "End of Supply Reject",
            4 => "End of Supply Notify",
            _ => throw new ArgumentOutOfRangeException(nameof(number), number, null),
        };
    }
}
