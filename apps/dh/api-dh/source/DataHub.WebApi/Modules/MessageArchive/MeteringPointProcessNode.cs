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

using System.Collections.Immutable;
using System.Reactive.Linq;
using Energinet.DataHub.ElectricityMarket.Abstractions.Processes.BRS_011.IncorrectMoveIn.V1;
using Energinet.DataHub.ElectricityMarket.Client;
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
        Interval? created,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        // Hidden default period: when the frontend sends no period it leaves the period filter
        // visually blank, so the BFF applies a wide default window covering all relevant processes
        // (start = 2016-01-01 UTC, end = now + 1 year, recomputed per request). This default lives
        // only here, in the query method, as the single source of truth (see ResolveCreatedInterval).
        // The subscription delegates to this method (see OnMeteringPointProcessUpdatedAsync), so it
        // inherits the same default.
        var resolvedCreated = ResolveCreatedInterval(created, SystemClock.Instance.GetCurrentInstant());

        var query = new SearchWorkflowInstancesByMeteringPointIdQuery(
            userIdentity,
            meteringPointId,
            resolvedCreated.Start.ToDateTimeOffset(),
            resolvedCreated.End.ToDateTimeOffset());

        var workflowInstances = await processManagerClient.SearchWorkflowInstancesByMeteringPointIdQueryAsync(query, cancellationToken);

        return workflowInstances.Select(w => MapToMeteringPointProcess(w, meteringPointId));
    }

    [Query]
    public static async Task<MeteringPointProcess?> GetMeteringPointProcessByIdAsync(
        string id,
        string meteringPointId,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var query = new GetWorkflowInstanceByIdQuery(userIdentity, Guid.Parse(id));

        var workflowInstanceWithSteps = await processManagerClient.GetWorkflowInstanceByIdQueryAsync(query, cancellationToken);

        return workflowInstanceWithSteps is not null ? MapToMeteringPointProcess(workflowInstanceWithSteps, meteringPointId) : null;
    }

    [Subscription]
    [Subscribe(With = nameof(OnMeteringPointProcessUpdatedAsync))]
    public static MeteringPointProcess MeteringPointProcessUpdated(
        string meteringPointId,
        Interval? created,
        [EventMessage] MeteringPointProcess process) => process;

    // This resolver fetches one extra workflow instance per parent process. It is only selected by the
    // single-process detail query (GetMeteringPointProcessById), so it issues at most one extra call.
    // If a future query selects cancelledByProcess across the overview list, introduce a workflow-instance
    // DataLoader keyed by id to avoid an N+1.
    public static async Task<MeteringPointProcess?> GetCancelledByProcessAsync(
        [Parent] MeteringPointProcess process,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(process.CancelledByProcessId))
        {
            return null;
        }

        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var query = new GetWorkflowInstanceByIdQuery(userIdentity, Guid.Parse(process.CancelledByProcessId));

        var workflowInstanceWithSteps = await processManagerClient.GetWorkflowInstanceByIdQueryAsync(query, cancellationToken);

        return workflowInstanceWithSteps is not null
            ? MapToMeteringPointProcess(workflowInstanceWithSteps, process.MeteringPointId ?? string.Empty)
            : null;
    }

    public static async Task<ActorDto?> GetInitiatorAsync(
        [Parent] MeteringPointProcess process,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader)
    {
        // Masked foreign actors carry a populated ActorRole but an empty ActorNumber,
        // so guard the DataLoader to avoid an upstream lookup with an empty number.
        // Callers fall back to `initiatorRole` for the role label.
        if (string.IsNullOrEmpty(process.ActorNumber)) return null;
        if (!Enum.TryParse<EicFunction>(process.ActorRole, out var role)) return null;
        return await dataLoader.LoadAsync((process.ActorNumber, role));
    }

    // The role is always available (the backend masks only the actor number for foreign actors),
    // so it is exposed independently of the number-keyed initiator resolution above. This lets the
    // frontend show the actor role for every involved actor while the GLN/name stays hidden when masked.
    public static EicFunction? GetInitiatorRole(
        [Parent] MeteringPointProcess process) =>
        Enum.TryParse<EicFunction>(process.ActorRole, out var role) ? role : null;

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
            Comment: step.PreviewField,
            CompletedAt: step.Lifecycle.CompletedAt,
            DueDate: null, // DueDate was removed in ProcessManager 8.1.0
            ActorNumber: step.Actor?.ActorNumber?.Value ?? string.Empty,
            ActorRole: step.Actor?.ActorRole.Name ?? string.Empty,
            State: MapStepStateToMeteringPointProcessState(step.Lifecycle.State),
            MessageId: step.ArchivedMessageId == Guid.Empty ? null : step.ArchivedMessageId?.ToString(),
            Description: step.Description));
    }

    public static async Task<IEnumerable<MeteringPointProcessAction>> GetAvailableActionsAsync(
        [Parent] MeteringPointProcess process,
        IIncorrectMoveInEligibilityDataLoader incorrectMoveInEligibilityDataLoader,
        ILatestCustomerMoveInProcessIdDataLoader latestCustomerMoveInProcessIdDataLoader,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        // Unknown PM actions are skipped silently so the overview keeps working when PM
        // introduces a new WorkflowAction value before this BFF learns to map it.
        var actions = process.Actions is null
            ? Enumerable.Empty<MeteringPointProcessAction>()
            : process.Actions
                .Where(a => a != WorkflowAction.NoAction)
                .Select(MapWorkflowActionToMeteringPointProcessAction)
                .Where(a => a.HasValue)
                .Select(a => a!.Value);


        // Hide all actions for IncorrectMove processes when the user is the initiator
        if (process.BusinessReason == BusinessReason.IncorrectMove)
        {
            if (httpContextAccessor.HttpContext?.User.IsFas() == true) return actions;
            return httpContextAccessor?.GetUserActorNumber() == process.ActorNumber
                ? []
                : actions;
        }

        if (process.BusinessReason != BusinessReason.CustomerMoveIn || process.MeteringPointId is null)
        {
            return actions;
        }

        // InitiateIncorrectMoveIn corrects a customer move-in that has already completed,
        // so only Succeeded processes are candidates. Anything still pending/running, or
        // terminated with a non-success state, must not surface the action.
        if (process.State != MeteringPointProcessState.Succeeded)
        {
            return actions;
        }

        // The action is offered only on the single latest CustomerMoveIn on the metering point
        // (latest across all lifecycle states), and only when that latest process itself
        // succeeded. A newer move-in in any state, including rejected or pending, intentionally
        // suppresses correction of older move-ins. The latest loader queries PM with a wide
        // window so the result is independent of the user's overview date filter.
        var latestProcessId = await latestCustomerMoveInProcessIdDataLoader
            .LoadAsync(process.MeteringPointId, cancellationToken)
            .ConfigureAwait(false);

        if (latestProcessId != process.Id)
        {
            return actions;
        }

        // FAS surfaces every supported action (disabled in the UI) and has no supplier GLN
        // to scope the EM query, so eligibility is reduced to the process's own cutoff
        // falling inside the same 60-day window the supplier-scoped EM query enforces.
        if (httpContextAccessor.HttpContext?.User.IsFas() == true)
        {
            return process.CutoffDate.HasValue
                   && process.CutoffDate.Value >= DateTimeOffset.UtcNow.AddDays(-60)
                ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveIn)
                : actions;
        }

        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var isEligibleForIncorrectMoveIn = await incorrectMoveInEligibilityDataLoader
            .LoadAsync((process.MeteringPointId, userIdentity.ActorNumber.Value), cancellationToken)
            .ConfigureAwait(false);

        return isEligibleForIncorrectMoveIn
            ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveIn)
            : actions;
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<(string MeteringPointId, string EnergySupplierId), bool>> GetIncorrectMoveInEligibilityAsync(
        IReadOnlyList<(string MeteringPointId, string EnergySupplierId)> keys,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken cancellationToken)
    {
        // HotChocolate dedupes identical keys within a single request, so multiple
        // CustomerMoveIn processes on the same metering point trigger one EM call.
        // Eligibility is presence-of-any-move-in within the EM 60-day lookback window.
        var results = new Dictionary<(string MeteringPointId, string EnergySupplierId), bool>(keys.Count);
        foreach (var key in keys)
        {
            var query = new GetMoveInsByEnergySupplierIdQueryV1(
                MeteringPointId: key.MeteringPointId,
                EnergySupplierId: key.EnergySupplierId,
                From: DateTimeOffset.UtcNow.AddDays(-60));

            var result = await electricityMarketClient.SendAsync(query, cancellationToken).ConfigureAwait(false);

            // Intentionally fail closed: this gates a display-only action, so an EM transport
            // failure hides the button instead of erroring the whole availableActions field.
            results[key] = result.IsSuccess && result.Data is not null && result.Data.MoveIns.Any();
        }

        return results;
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, string?>> GetLatestCustomerMoveInProcessIdAsync(
        IReadOnlyList<string> meteringPointIds,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var results = new Dictionary<string, string?>(meteringPointIds.Count);

        // PM lookup is done with a wide range so the "latest" check is independent of the
        // overview user-supplied date filter; the rule says "latest ever", not "latest visible".
        var earliest = new DateTimeOffset(2000, 1, 1, 0, 0, 0, TimeSpan.Zero);
        var farFuture = DateTimeOffset.UtcNow.AddYears(10);

        foreach (var meteringPointId in meteringPointIds)
        {
            var query = new SearchWorkflowInstancesByMeteringPointIdQuery(
                userIdentity,
                meteringPointId,
                earliest,
                farFuture);

            var instances = await processManagerClient
                .SearchWorkflowInstancesByMeteringPointIdQueryAsync(query, cancellationToken)
                .ConfigureAwait(false);

            var latest = instances
                .Where(x => x.BusinessReason == BusinessReason.CustomerMoveIn)
                .OrderByDescending(x => x.ExpectedValidityDate ?? DateTimeOffset.MinValue)
                .ThenByDescending(x => x.Lifecycle.CreatedAt)
                .ThenByDescending(x => x.Id)
                .FirstOrDefault();

            results[meteringPointId] = latest?.Id.ToString();
        }

        return results;
    }

    /// <summary>
    /// Resolves the period used to search for processes. When the frontend sends no period
    /// (<paramref name="created"/> is null), a wide hidden-default window is applied:
    /// start = 2016-01-01 UTC, end = <paramref name="now"/> + 1 calendar year. This is the single
    /// source of truth for that default (the query and subscription both route through it).
    /// Pure by design: <paramref name="now"/> is passed in (no SystemClock call here) so the
    /// date-defaulting is unit-testable for a fixed instant.
    /// </summary>
    internal static Interval ResolveCreatedInterval(Interval? created, Instant now) =>
        created ?? new Interval(
            Instant.FromUtc(2016, 1, 1, 0, 0),
            now.InUtc().LocalDateTime.PlusYears(1).InUtc().ToInstant());

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.TransactionId);
        descriptor.Field(f => f.BusinessReason);
        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.CutoffDate);
        descriptor.Field(f => f.State);
        descriptor.Field(f => f.CancellationTimestamp);
        descriptor.Field("availableActions")
            .Type<ListType<NonNullType<EnumType<MeteringPointProcessAction>>>>()
            .Resolve((ctx, ct) => GetAvailableActionsAsync(
                ctx.Parent<MeteringPointProcess>(),
                ctx.DataLoader<IIncorrectMoveInEligibilityDataLoader>(),
                ctx.DataLoader<ILatestCustomerMoveInProcessIdDataLoader>(),
                ctx.Service<IHttpContextAccessor>(),
                ct));
    }

    private static MeteringPointProcessAction? MapWorkflowActionToMeteringPointProcessAction(WorkflowAction action) =>
        action switch
        {
            WorkflowAction.SendInformation => MeteringPointProcessAction.SendInformation,
            WorkflowAction.CancelWorkflow => MeteringPointProcessAction.CancelWorkflow,
            WorkflowAction.ConfirmWorkflow => MeteringPointProcessAction.ConfirmWorkflow,
            WorkflowAction.RejectRequest => MeteringPointProcessAction.RejectRequest,
            _ => null,
        };

    private static IObservable<MeteringPointProcess> OnMeteringPointProcessUpdatedAsync(
        string meteringPointId,
        Interval? created,
        IProcessManagerClient processManagerClient,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken) =>
        // Pass the nullable period straight through; the hidden default period is resolved in
        // GetMeteringPointProcessOverviewAsync (single source of truth) so it stays consistent
        // between the initial query and subsequent subscription updates.
        Observable
            .Interval(TimeSpan.FromSeconds(10))
            .StartWith(0)
            .SelectMany(_ => Observable.FromAsync(() => GetMeteringPointProcessOverviewAsync(
                meteringPointId,
                created,
                processManagerClient,
                httpContextAccessor,
                cancellationToken)))
            .Scan(
                (Snapshots: ImmutableDictionary<string, MeteringPointProcessSnapshot>.Empty,
                 Changed: Enumerable.Empty<MeteringPointProcess>()),
                (acc, processes) =>
                {
                    var current = processes.ToImmutableDictionary(
                        process => process.Id,
                        MeteringPointProcessSnapshot.From);

                    var changed = processes.Where(process =>
                        !acc.Snapshots.TryGetValue(process.Id, out var previous)
                        || previous != current[process.Id]);

                    return (current, changed);
                })
            .SelectMany(state => state.Changed);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceDto workflowInstance, string? meteringPointId = null) =>
        CreateMeteringPointProcess(
            workflowInstance.Id,
            workflowInstance.TransactionId,
            workflowInstance.Lifecycle,
            workflowInstance.BusinessReason,
            workflowInstance.ExpectedValidityDate,
            actions: workflowInstance.Actions.ToArray(),
            workflowSteps: null,
            meteringPointId: meteringPointId);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceWithStepsDto workflowInstanceWithSteps, string meteringPointId) =>
        CreateMeteringPointProcess(
            workflowInstanceWithSteps.Id,
            null,
            workflowInstanceWithSteps.Lifecycle,
            workflowInstanceWithSteps.BusinessReason,
            workflowInstanceWithSteps.ExpectedValidityDate,
            actions: workflowInstanceWithSteps.Actions.ToArray(),
            workflowSteps: workflowInstanceWithSteps.Steps,
            meteringPointId: meteringPointId);

    private static MeteringPointProcess CreateMeteringPointProcess(
        Guid id,
        string? transactionId,
        WorkflowInstanceLifecycleDto lifecycle,
        BusinessReason businessReason,
        DateTimeOffset? cuteoffDate = null,
        WorkflowAction[]? actions = null,
        IReadOnlyCollection<WorkflowStepInstanceDto>? workflowSteps = null,
        string? meteringPointId = null)
    {
        var actorIdentity = lifecycle.CreatedBy;
        // TODO: Check if the actor has been masked.
        // If yes, we clean the information to memic the old behaviour
        // Before we introduced MaskedActorIdentity
        var actorIdentityIsNotMasked = actorIdentity.ActorNumber?.Value != null;

        // TerminatedAt is set for every termination (succeeded/failed/rejected too), so only
        // surface it as the cancellation timestamp when the process was actually canceled.
        var cancellationTimestamp =
            lifecycle.TerminationState == WorkflowInstanceTerminationState.Canceled
                ? lifecycle.TerminatedAt
                : null;

        return new MeteringPointProcess(
            Id: id.ToString(),
            TransactionId: transactionId,
            CreatedAt: lifecycle.CreatedAt,
            CutoffDate: cuteoffDate,
            BusinessReason: businessReason,
            ActorNumber: actorIdentityIsNotMasked ? actorIdentity.ActorNumber!.Value : string.Empty,
            ActorRole: actorIdentity.ActorRole.Name, // Always keep the role; only the number is masked for foreign actors.
            State: MapWorkflowStateToMeteringPointProcessState(lifecycle.State, lifecycle.TerminationState),
            CancelledByProcessId: lifecycle.CanceledByWorkflowInstanceId?.ToString(),
            CancellationTimestamp: cancellationTimestamp,
            Actions: actions,
            WorkflowSteps: workflowSteps,
            MeteringPointId: meteringPointId);
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
