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
using Energinet.DataHub.ElectricityMarket.Abstractions.Processes.BRS_011.Shared.V1;
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
    private const int WindowDays = 60;

    // The 60-calendar-day correction windows (BRS-011 incorrect move-in and BRS-003 change of
    // supplier) are counted in Danish time, since cutoff dates are Danish calendar dates, so a
    // window boundary must be the start of a Danish calendar day, not an instant offset from "now".
    private static readonly DateTimeZone _danishTimeZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

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
        IChangeOfSupplierCorrectionEligibilityDataLoader changeOfSupplierCorrectionEligibilityDataLoader,
        IMoveInCorrectionRollbackEligibilityDataLoader moveInCorrectionRollbackEligibilityDataLoader,
        IIncorrectMoveOutEligibilityDataLoader incorrectMoveOutEligibilityDataLoader,
        ILatestCustomerMoveOutProcessIdDataLoader latestCustomerMoveOutProcessIdDataLoader,
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

        // Hide actions for IncorrectMove and RollbackChangeOfSupplier processes
        // when the user is the initiator (FAS exempted).
        if (process.BusinessReason == BusinessReason.IncorrectMove ||
            process.BusinessReason == BusinessReason.RollbackChangeOfSupplier)
        {
            if (httpContextAccessor.HttpContext?.User.IsFas() == true) return actions;
            return httpContextAccessor.GetUserActorNumber() == process.ActorNumber
                ? []
                : actions;
        }

        if (process.BusinessReason == BusinessReason.ChangeOfEnergySupplier)
        {
            // Offer the correction only for change-of-supplier processes the eligibility loader
            // accepts. The loader checks the rules over the whole process history, so the answer
            // does not depend on the overview date filter.
            if (process.MeteringPointId is null) return actions;

            var eligibleProcessIds = await changeOfSupplierCorrectionEligibilityDataLoader
                .LoadAsync(process.MeteringPointId, cancellationToken)
                .ConfigureAwait(false);

            return eligibleProcessIds is not null && eligibleProcessIds.Contains(process.Id)
                ? actions.Append(MeteringPointProcessAction.HandlingOfIncorrectChangeOfSupplier)
                : actions;
        }

        if (process.MeteringPointId is null ||
            (process.BusinessReason != BusinessReason.CustomerMoveIn &&
             process.BusinessReason != BusinessReason.CustomerMoveOut))
        {
            return actions;
        }

        // team-volt#2053: the move-out correction mirrors the move-in correction gate below, but with
        // the narrower BRS-010 rule set (no rollback / already-initiated blocks), so it is delegated to
        // its own helper before the move-in logic, which stays untouched.
        if (process.BusinessReason == BusinessReason.CustomerMoveOut)
        {
            return await GetCustomerMoveOutActionsAsync(
                process,
                actions,
                incorrectMoveOutEligibilityDataLoader,
                latestCustomerMoveOutProcessIdDataLoader,
                httpContextAccessor,
                cancellationToken);
        }

        // InitiateIncorrectMoveIn corrects a customer move-in that has already completed,
        // so only Succeeded processes are candidates. Anything still pending/running, or
        // terminated with a non-success state, must not surface the action.
        if (process.State != MeteringPointProcessState.Succeeded)
        {
            return actions;
        }

        // The action is offered only on the single latest effective CustomerMoveIn on the metering
        // point, and only when that latest process itself succeeded. A move-in becomes effective
        // once its cutoff date is reached; a future-dated move-in (cutoff not yet reached) or one
        // terminated without taking effect (rejected, canceled, failed) is ignored, so it does not
        // suppress correction of the last effective move-in. The latest loader queries PM with a
        // wide window so the result is independent of the user's overview date filter.
        var latestProcessId = await latestCustomerMoveInProcessIdDataLoader
            .LoadAsync(process.MeteringPointId, cancellationToken)
            .ConfigureAwait(false);

        if (latestProcessId != process.Id)
        {
            return actions;
        }

        // Both the FAS 60-calendar-day window and the EM moves query below key off the move-in's
        // validity date (skæringsdato), so it must be present. A latest succeeded move-in is
        // expected to carry one; if it is absent, eligibility cannot be evaluated, so fail closed.
        if (process.CutoffDate is not { } moveInValidityDate)
        {
            return actions;
        }

        // team-volt#2063: hide the move-in correction button when a BRS-003 (rollback change of
        // supplier) with a strictly newer validity date is active or completed on the metering
        // point. The rule spans the whole process history, so a wide-window loader evaluates it
        // independent of the overview date filter, and it applies to both the FAS and supplier
        // paths below.
        var moveInCorrectionEligibleIds = await moveInCorrectionRollbackEligibilityDataLoader
            .LoadAsync(process.MeteringPointId, cancellationToken)
            .ConfigureAwait(false);

        if (moveInCorrectionEligibleIds is null || !moveInCorrectionEligibleIds.Contains(process.Id))
        {
            return actions;
        }

        // FAS surfaces every supported action (disabled in the UI) and has no supplier GLN to scope
        // the EM moves query against, so its eligibility is the process's own cutoff falling inside
        // the 60-calendar-day correction window. The previous-supplier gate (team-volt#2050) cannot
        // be evaluated for FAS because the moves query is supplier-scoped, so it is not applied here.
        if (httpContextAccessor.HttpContext?.User.IsFas() == true)
        {
            return moveInValidityDate >= IncorrectMoveInWindowStart(SystemClock.Instance.GetCurrentInstant())
                ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveIn)
                : actions;
        }

        // A supplier is eligible when ElectricityMarket reports a move-in it made on this metering
        // point at this validity date within the 60-day window, AND a previous energy supplier was
        // registered the day before that move-in. The correction reverts supply to that previous
        // supplier, so it is meaningless without one (team-volt#2050). The loader is keyed only by
        // (metering point, supplier) so HotChocolate dedupes the EM call; this resolver matches the
        // specific move-in by validity date at Danish calendar-day granularity (skæringsdato).
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var supplierMoveIns = await incorrectMoveInEligibilityDataLoader
            .LoadAsync((process.MeteringPointId, userIdentity.ActorNumber.Value), cancellationToken)
            .ConfigureAwait(false) ?? [];

        var isEligibleForIncorrectMoveIn = supplierMoveIns
            .Any(m => m.HasPreviousEnergySupplier && ToDanishDate(m.ValidityDate) == ToDanishDate(moveInValidityDate));

        return isEligibleForIncorrectMoveIn
            ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveIn)
            : actions;
    }

    [DataLoader]
    public static Task<IReadOnlyDictionary<(string MeteringPointId, string EnergySupplierId), IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>>> GetIncorrectMoveInEligibilityAsync(
        IReadOnlyList<(string MeteringPointId, string EnergySupplierId)> keys,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken cancellationToken) =>
        GetMoveEligibilityAsync(keys, electricityMarketClient, static result => result.MoveIns, cancellationToken);

    [DataLoader]
    public static Task<IReadOnlyDictionary<(string MeteringPointId, string EnergySupplierId), IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>>> GetIncorrectMoveOutEligibilityAsync(
        IReadOnlyList<(string MeteringPointId, string EnergySupplierId)> keys,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken cancellationToken) =>
        GetMoveEligibilityAsync(keys, electricityMarketClient, static result => result.MoveOuts, cancellationToken);

    [DataLoader]
    public static Task<IReadOnlyDictionary<string, string?>> GetLatestCustomerMoveInProcessIdAsync(
        IReadOnlyList<string> meteringPointIds,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken) =>
        GetLatestEffectiveProcessIdAsync(
            meteringPointIds,
            BusinessReason.CustomerMoveIn,
            processManagerClient,
            httpContextAccessor,
            cancellationToken);

    [DataLoader]
    public static Task<IReadOnlyDictionary<string, string?>> GetLatestCustomerMoveOutProcessIdAsync(
        IReadOnlyList<string> meteringPointIds,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken) =>
        GetLatestEffectiveProcessIdAsync(
            meteringPointIds,
            BusinessReason.CustomerMoveOut,
            processManagerClient,
            httpContextAccessor,
            cancellationToken);

    [DataLoader]
    public static async Task<IReadOnlySet<string>> GetChangeOfSupplierCorrectionEligibilityAsync(
        string meteringPointId,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        try
        {
            // Fetch the whole process history (wide default window) so eligibility does not depend
            // on the overview date filter.
            var now = SystemClock.Instance.GetCurrentInstant();
            var created = ResolveCreatedInterval(null, now);
            var query = new SearchWorkflowInstancesByMeteringPointIdQuery(
                httpContextAccessor.CreateUserIdentity(),
                meteringPointId,
                created.Start.ToDateTimeOffset(),
                created.End.ToDateTimeOffset());

            var instances = await processManagerClient
                .SearchWorkflowInstancesByMeteringPointIdQueryAsync(query, cancellationToken)
                .ConfigureAwait(false);

            var processes = instances
                .Select(w => MapToMeteringPointProcess(w, meteringPointId))
                .ToList();

            var today = now.InZone(_danishTimeZone).Date;
            return processes
                .Where(p => IsChangeOfSupplierCorrectionEligible(p, processes, today))
                .Select(p => p.Id)
                .ToHashSet();
        }
        catch (Exception) when (!cancellationToken.IsCancellationRequested)
        {
            // Fail closed so a process-manager error hides the action instead of failing the field.
            return new HashSet<string>();
        }
    }

    [DataLoader]
    public static async Task<IReadOnlySet<string>> GetMoveInCorrectionRollbackEligibilityAsync(
        string meteringPointId,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        try
        {
            // Fetch the whole process history (wide default window) so the rule does not depend on
            // the overview date filter.
            var now = SystemClock.Instance.GetCurrentInstant();
            var created = ResolveCreatedInterval(null, now);
            var query = new SearchWorkflowInstancesByMeteringPointIdQuery(
                httpContextAccessor.CreateUserIdentity(),
                meteringPointId,
                created.Start.ToDateTimeOffset(),
                created.End.ToDateTimeOffset());

            var instances = await processManagerClient
                .SearchWorkflowInstancesByMeteringPointIdQueryAsync(query, cancellationToken)
                .ConfigureAwait(false);

            var processes = instances
                .Select(w => MapToMeteringPointProcess(w, meteringPointId))
                .ToList();

            return processes
                .Where(p => p.BusinessReason == BusinessReason.CustomerMoveIn)
                .Where(p => !IsMoveInCorrectionBlockedByNewerRollback(p, processes))
                .Where(p => !IsMoveInCorrectionAlreadyInitiated(p, processes))
                .Select(p => p.Id)
                .ToHashSet();
        }
        catch (Exception) when (!cancellationToken.IsCancellationRequested)
        {
            // Fail closed so a process-manager error hides the action instead of failing the field.
            return new HashSet<string>();
        }
    }

    /// <summary>
    /// Whether the "request correction" action should be offered for a completed change of
    /// supplier. Dates are compared at Danish calendar-day granularity; <paramref name="today"/>
    /// is the current Danish date, passed in so the rule is deterministic and unit-testable.
    /// Superseding processes that did not take effect (failed, canceled, rejected) are ignored, with
    /// one exception: a same-day RollbackChangeOfSupplier correcting this change of supplier blocks
    /// once initiated regardless of its outcome, so the action does not come back if it is rejected
    /// (team-volt#2037).
    /// </summary>
    internal static bool IsChangeOfSupplierCorrectionEligible(
        MeteringPointProcess process,
        IReadOnlyList<MeteringPointProcess> allProcesses,
        LocalDate today)
    {
        // Evaluated against every process on the metering point, so guard the candidate's type.
        if (process.BusinessReason != BusinessReason.ChangeOfEnergySupplier) return false;
        if (process.State != MeteringPointProcessState.Succeeded) return false;
        if (process.CutoffDate is null) return false;

        var effectiveDate = ToDanishDate(process.CutoffDate.Value);
        var window = new DateInterval(today.PlusDays(-WindowDays), today);
        if (!window.Contains(effectiveDate)) return false;

        // team-volt#2037: once a rollback correcting this change of supplier has been initiated, hide
        // the action permanently regardless of the rollback's outcome, so it does not come back even
        // if the rollback is rejected. A rollback is registered after the change of supplier it
        // corrects, and the action is offered only on the latest eligible change of supplier, so any
        // RollbackChangeOfSupplier registered after this one is a correction of it. The rollback's
        // validity date is assigned by Process Manager and need not match, so the link is the
        // registration instant, not the skæringsdato.
        var ownRollbackInitiated = allProcesses.Any(p =>
            p.BusinessReason == BusinessReason.RollbackChangeOfSupplier
            && p.CreatedAt > process.CreatedAt);
        if (ownRollbackInitiated) return false;

        return !allProcesses
            .Where(p => p.Id != process.Id)
            .Where(IsActiveOrSucceeded)
            .Any(other =>
            {
                if (other.CutoffDate is null) return false;
                var cutoff = ToDanishDate(other.CutoffDate.Value);
                var reason = other.BusinessReason;

                // BusinessReason is a value object, not an enum, so it cannot be a switch label.
                if (reason == BusinessReason.ChangeOfEnergySupplier)
                    return cutoff > effectiveDate && window.Contains(cutoff);

                // RollbackChangeOfSupplier is intentionally not handled here: it is a correction whose
                // validity date is assigned by Process Manager, so it is linked to the change of
                // supplier by registration order in ownRollbackInitiated above, not by cutoff.
                if (reason == BusinessReason.EndOfSupply
                    || reason == BusinessReason.CloseDownMeteringPoint
                    || reason == BusinessReason.CustomerMoveOut
                    || reason == BusinessReason.ProductionObligation)
                    return cutoff > effectiveDate;

                if (reason == BusinessReason.CustomerMoveIn)
                    return other.State == MeteringPointProcessState.Succeeded && cutoff > effectiveDate;

                if (reason == BusinessReason.IncorrectMove)
                    return ToDanishDate(other.CreatedAt) > effectiveDate && cutoff < effectiveDate;

                return false;
            });
    }

    /// <summary>
    /// Whether the BRS-011 move-in correction button must be hidden for <paramref name="moveIn"/>
    /// because a BRS-003 (rollback change of supplier) with a strictly newer validity date is active
    /// or has taken effect on the metering point (team-volt#2063). Dates are compared at Danish
    /// calendar-day granularity. A rollback that did not take effect (failed, canceled, rejected) or
    /// carries no validity date does not block.
    /// </summary>
    internal static bool IsMoveInCorrectionBlockedByNewerRollback(
        MeteringPointProcess moveIn,
        IReadOnlyList<MeteringPointProcess> allProcesses)
    {
        if (moveIn.CutoffDate is not { } moveInCutoff) return false;
        var moveInDate = ToDanishDate(moveInCutoff);

        return allProcesses
            .Where(p => p.BusinessReason == BusinessReason.RollbackChangeOfSupplier)
            .Where(IsActiveOrSucceeded)
            .Any(rollback =>
                rollback.CutoffDate is { } cutoff && ToDanishDate(cutoff) > moveInDate);
    }

    /// <summary>
    /// Whether the BRS-011 move-in correction button must be hidden for <paramref name="moveIn"/>
    /// because an incorrect-move-in correction has already been initiated for it (team-volt#2037).
    /// A correction is always registered after the move-in it corrects, and the button is offered only
    /// on the latest effective move-in, so any IncorrectMove created after this move-in is a correction
    /// of it. The correction's validity date is assigned by Process Manager and need not match the
    /// move-in's, so the link is the registration instant, not the skæringsdato. Created-at is compared
    /// as an instant because the correction and the move-in can fall on the same calendar day. Once a
    /// correction has been initiated the button stays hidden regardless of the correction's outcome,
    /// so it does not come back even if the correction is rejected.
    /// </summary>
    internal static bool IsMoveInCorrectionAlreadyInitiated(
        MeteringPointProcess moveIn,
        IReadOnlyList<MeteringPointProcess> allProcesses)
    {
        return allProcesses.Any(p =>
            p.BusinessReason == BusinessReason.IncorrectMove
            && p.CreatedAt > moveIn.CreatedAt);
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

    /// <summary>
    /// Start of the Danish calendar day 60 days before <paramref name="now"/>, the inclusive
    /// lower bound of the incorrect-move-in correction window. Comparing against
    /// DateTimeOffset.UtcNow.AddDays(-60) would carry the current time of day and exclude a
    /// move-in whose cutoff (Danish midnight) is exactly 60 calendar days back, so the window
    /// starts at the beginning of the Danish day. Pure by design: <paramref name="now"/> is
    /// passed in so the boundary is unit-testable for a fixed instant.
    /// </summary>
    internal static DateTimeOffset IncorrectMoveInWindowStart(Instant now) =>
        now.InZone(_danishTimeZone)
            .Date
            .PlusDays(-60)
            .AtStartOfDayInZone(_danishTimeZone)
            .ToDateTimeOffset();

    // team-volt#2053: BRS-010 move-out correction gate, mirroring the move-in logic in
    // GetAvailableActionsAsync (Succeeded -> latest effective -> cutoff present -> FAS window or
    // supplier has-previous-supplier date match). The move-in-only #2063 rollback and #2037
    // already-initiated blocks are intentionally not part of BRS-010, so they are not applied here.
    private static async Task<IEnumerable<MeteringPointProcessAction>> GetCustomerMoveOutActionsAsync(
        MeteringPointProcess process,
        IEnumerable<MeteringPointProcessAction> actions,
        IIncorrectMoveOutEligibilityDataLoader incorrectMoveOutEligibilityDataLoader,
        ILatestCustomerMoveOutProcessIdDataLoader latestCustomerMoveOutProcessIdDataLoader,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        // InitiateIncorrectMoveOut corrects a customer move-out that has already completed, so only
        // Succeeded processes are candidates. Anything still pending/running, or terminated with a
        // non-success state, must not surface the action.
        if (process.State != MeteringPointProcessState.Succeeded)
        {
            return actions;
        }

        // The action is offered only on the single latest effective CustomerMoveOut on the metering
        // point, and only when that latest process itself succeeded. A move-out becomes effective
        // once its cutoff date is reached; a future-dated move-out (cutoff not yet reached) or one
        // terminated without taking effect (rejected, canceled, failed) is ignored. The latest loader
        // queries PM with a wide window so the result is independent of the user's overview date filter.
        var latestProcessId = await latestCustomerMoveOutProcessIdDataLoader
            .LoadAsync(process.MeteringPointId!, cancellationToken)
            .ConfigureAwait(false);

        if (latestProcessId != process.Id)
        {
            return actions;
        }

        // Both the FAS 60-calendar-day window and the EM moves query below key off the move-out's
        // validity date (skæringsdato), so it must be present. A latest succeeded move-out is
        // expected to carry one; if it is absent, eligibility cannot be evaluated, so fail closed.
        if (process.CutoffDate is not { } moveOutValidityDate)
        {
            return actions;
        }

        // FAS surfaces every supported action (disabled in the UI) and has no supplier GLN to scope
        // the EM moves query against, so its eligibility is the process's own cutoff falling inside
        // the 60-calendar-day correction window (shared with the move-in window helper).
        if (httpContextAccessor.HttpContext?.User.IsFas() == true)
        {
            return moveOutValidityDate >= IncorrectMoveInWindowStart(SystemClock.Instance.GetCurrentInstant())
                ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveOut)
                : actions;
        }

        // A supplier is eligible when ElectricityMarket reports a move-out it made on this metering
        // point at this validity date within the 60-day window, AND a previous energy supplier was
        // registered the day before that move-out. The loader is keyed only by
        // (metering point, supplier) so HotChocolate dedupes the EM call; this resolver matches the
        // specific move-out by validity date at Danish calendar-day granularity (skæringsdato).
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var supplierMoveOuts = await incorrectMoveOutEligibilityDataLoader
            .LoadAsync((process.MeteringPointId!, userIdentity.ActorNumber.Value), cancellationToken)
            .ConfigureAwait(false) ?? [];

        var isEligibleForIncorrectMoveOut = supplierMoveOuts
            .Any(m => m.HasPreviousEnergySupplier && ToDanishDate(m.ValidityDate) == ToDanishDate(moveOutValidityDate));

        return isEligibleForIncorrectMoveOut
            ? actions.Append(MeteringPointProcessAction.InitiateIncorrectMoveOut)
            : actions;
    }

    private static async Task<IReadOnlyDictionary<(string MeteringPointId, string EnergySupplierId), IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>>> GetMoveEligibilityAsync(
        IReadOnlyList<(string MeteringPointId, string EnergySupplierId)> keys,
        IElectricityMarketClient electricityMarketClient,
        Func<GetMovesByEnergySupplierIdResultDtoV1, List<GetMovesByEnergySupplierIdResultDtoV1.MoveDto>> selectMoves,
        CancellationToken cancellationToken)
    {
        // Keyed only by (metering point, supplier), the same parameters the EM moves query takes, so
        // HotChocolate dedupes one EM call per supplier per request (the resolver matches the
        // specific move by validity date). The query returns the supplier's moves from the
        // 60-calendar-day window start, each flagged with whether an energy supplier was registered
        // the day before its validity date. Mirrors GetChangeOfSupplierCorrectionEligibilityAsync.
        var from = IncorrectMoveInWindowStart(SystemClock.Instance.GetCurrentInstant());
        var results = new Dictionary<(string MeteringPointId, string EnergySupplierId), IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>>(keys.Count);
        foreach (var key in keys)
        {
            var query = new GetMovesByEnergySupplierIdQueryV1(
                MeteringPointId: key.MeteringPointId,
                EnergySupplierId: key.EnergySupplierId,
                From: from);

            var result = await electricityMarketClient.SendAsync(query, cancellationToken).ConfigureAwait(false);

            // Intentionally fail closed: this gates a display-only action, so an EM transport
            // failure yields no moves (hiding the button) instead of erroring the whole
            // availableActions field.
            results[key] = result.IsSuccess && result.Data is not null
                ? selectMoves(result.Data).Select(m => (m.ValidityDate, m.HasPreviousEnergySupplier)).ToList()
                : [];
        }

        return results;
    }

    private static async Task<IReadOnlyDictionary<string, string?>> GetLatestEffectiveProcessIdAsync(
        IReadOnlyList<string> meteringPointIds,
        BusinessReason businessReason,
        IProcessManagerClient processManagerClient,
        IHttpContextAccessor httpContextAccessor,
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

            // "Latest" is the most recent process of the requested business reason that has actually
            // taken effect: its cutoff (ExpectedValidityDate) has been reached and it was not
            // terminated without taking effect (rejected, canceled, failed). A future-dated one whose
            // cutoff has not been reached, and a rejected/canceled/failed one, therefore do not steal
            // the correction slot from the last effective one. Lifecycle state is not a reliable
            // discriminator: an accepted move stays in Sleeping both before and (while customer master
            // data is outstanding) after its cutoff, so the cutoff date is what decides whether it has
            // taken effect.
            var now = SystemClock.Instance.GetCurrentInstant().ToDateTimeOffset();
            var latest = instances
                .Where(x => x.BusinessReason == businessReason)
                .Where(x => x.ExpectedValidityDate is { } validity && validity <= now)
                .Where(x => x.Lifecycle.TerminationState
                    is not (WorkflowInstanceTerminationState.Rejected
                        or WorkflowInstanceTerminationState.Canceled
                        or WorkflowInstanceTerminationState.Failed))
                .OrderByDescending(x => x.ExpectedValidityDate ?? DateTimeOffset.MinValue)
                .ThenByDescending(x => x.Lifecycle.CreatedAt)
                .ThenByDescending(x => x.Id)
                .FirstOrDefault();

            results[meteringPointId] = latest?.Id.ToString();
        }

        return results;
    }

    private static bool IsActiveOrSucceeded(MeteringPointProcess process) =>
        process.State is MeteringPointProcessState.Pending
            or MeteringPointProcessState.Running
            or MeteringPointProcessState.Succeeded;

    private static LocalDate ToDanishDate(DateTimeOffset value) =>
        Instant.FromDateTimeOffset(value).InZone(_danishTimeZone).Date;

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.TransactionId);
        descriptor.Field(f => f.BusinessReason);
        descriptor.Field(f => f.ProcessType);
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
                ctx.DataLoader<IChangeOfSupplierCorrectionEligibilityDataLoader>(),
                ctx.DataLoader<IMoveInCorrectionRollbackEligibilityDataLoader>(),
                ctx.DataLoader<IIncorrectMoveOutEligibilityDataLoader>(),
                ctx.DataLoader<ILatestCustomerMoveOutProcessIdDataLoader>(),
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
            meteringPointId: meteringPointId,
            workflowDescriptionName: workflowInstance.WorkflowDescriptionName);

    private static MeteringPointProcess MapToMeteringPointProcess(WorkflowInstanceWithStepsDto workflowInstanceWithSteps, string meteringPointId) =>
        CreateMeteringPointProcess(
            workflowInstanceWithSteps.Id,
            null,
            workflowInstanceWithSteps.Lifecycle,
            workflowInstanceWithSteps.BusinessReason,
            workflowInstanceWithSteps.ExpectedValidityDate,
            actions: workflowInstanceWithSteps.Actions.ToArray(),
            workflowSteps: workflowInstanceWithSteps.Steps,
            meteringPointId: meteringPointId,
            workflowDescriptionName: workflowInstanceWithSteps.WorkflowDescriptionName);

    private static MeteringPointProcess CreateMeteringPointProcess(
        Guid id,
        string? transactionId,
        WorkflowInstanceLifecycleDto lifecycle,
        BusinessReason businessReason,
        DateTimeOffset? cuteoffDate = null,
        WorkflowAction[]? actions = null,
        IReadOnlyCollection<WorkflowStepInstanceDto>? workflowSteps = null,
        string? meteringPointId = null,
        string? workflowDescriptionName = null)
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

        // The process type the UI labels by is the workflow plus the business reason: most
        // workflows cover several reasons (e.g. Brs_007_008_013), and one reason spans two
        // workflows (Brs_005 vs Brs_038 both DataAlignmentForMasterDataMeteringPoint).
        // Normalize the workflow name casing (it varies by process-manager version, e.g.
        // BRS_015 vs Brs_015) so the composite key is stable across environments.
        var processType = workflowDescriptionName is null
            ? null
            : $"{workflowDescriptionName.ToUpperInvariant()}_{businessReason.Name}";

        return new MeteringPointProcess(
            Id: id.ToString(),
            TransactionId: transactionId,
            CreatedAt: lifecycle.CreatedAt,
            CutoffDate: cuteoffDate,
            BusinessReason: businessReason,
            ProcessType: processType,
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
