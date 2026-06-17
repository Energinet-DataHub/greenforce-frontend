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
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.OperatingIdentity.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Modules.MessageArchive;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.MessageArchive;

public class MeteringPointProcessNodeTests
{
    private const string MeteringPointId = "571313180400000005";
    private const string EnergySupplierGln = "5790001330552";
    private static readonly Guid _processOrchestrationId = Guid.Parse("6f1d24c8-8f64-4e9f-85ee-637de6d61512");
    private static readonly Guid _otherProcessOrchestrationId = Guid.Parse("aa1d24c8-8f64-4e9f-85ee-637de6d6151a");

    [Fact]
    public async Task GetAvailableActionsAsync_EligibleCustomerMoveIn_IncludesInitiateIncorrectMoveIn()
    {
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader(isEligible: true);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
        dataLoader.Verify(
            x => x.LoadAsync(
                It.Is<(string MeteringPointId, string EnergySupplierId)>(
                    k => k.MeteringPointId == MeteringPointId && k.EnergySupplierId == EnergySupplierGln),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IneligibleCustomerMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // Eligibility data loader returns false, modeling the case where no matching
        // move-in exists in EM within the 60-day lookback window.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader(isEligible: false);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NonCustomerMoveInBusinessReason_DoesNotInvokeDataLoaderAndDoesNotIncludeInitiateIncorrectMoveIn()
    {
        var process = CreateProcess(BusinessReason.EndOfSupply, meteringPointId: MeteringPointId);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        dataLoader.Verify(
            x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_CustomerMoveInWithinWindow_IncludesInitiateIncorrectMoveInWithoutCallingDataLoader()
    {
        // FAS has no supplier GLN to scope EM against; we surface the action whenever the
        // process's own cutoff is inside the 60-day window. Strict mock fails if the data
        // loader is touched.
        var cutoff = DateTimeOffset.UtcNow.AddDays(-10);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_CustomerMoveInOutsideWindow_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        var cutoff = DateTimeOffset.UtcNow.AddDays(-61);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_CutoffExactly60CalendarDaysAgo_IncludesInitiateIncorrectMoveIn()
    {
        // The correction window is 60 Danish calendar days. A cutoff at the start of the Danish
        // day exactly 60 days ago is the inclusive boundary and must surface the action. The old
        // DateTimeOffset.UtcNow.AddDays(-60) comparison carried the current time of day and wrongly
        // excluded this case (a move-in 60 calendar days back showed no button).
        var danishZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var todayInDenmark = SystemClock.Instance.GetCurrentInstant().InZone(danishZone).Date;
        var cutoff = todayInDenmark.PlusDays(-60).AtStartOfDayInZone(danishZone).ToDateTimeOffset();
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_Cutoff61CalendarDaysAgo_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // One day past the boundary: a cutoff at the start of the Danish day 61 days ago is outside
        // the 60-calendar-day window and must not surface the action.
        var danishZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var todayInDenmark = SystemClock.Instance.GetCurrentInstant().InZone(danishZone).Date;
        var cutoff = todayInDenmark.PlusDays(-61).AtStartOfDayInZone(danishZone).ToDateTimeOffset();
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_PendingCustomerMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // A still-pending CustomerMoveIn cannot be corrected, so the action must not appear.
        // Strict mocks on both loaders prove the short-circuit happens before any data is loaded.
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            state: MeteringPointProcessState.Pending);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_SucceededButNotLatest_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // The process is Succeeded but a newer CustomerMoveIn supersedes it on the same
        // metering point, so InitiateIncorrectMoveIn must not be offered. The EM loader is
        // strict to prove the latest gate short-circuits before per-supplier eligibility is checked.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _otherProcessOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_NotLatest_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // Same "latest" gate as the non-FAS path. The cutoff is inside the 60-day FAS
        // window so the only reason the action should not appear is the latest check.
        var cutoff = DateTimeOffset.UtcNow.AddDays(-10);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _otherProcessOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IncorrectMove_FasUser_ReturnsActions()
    {
        var process = CreateProcess(
            BusinessReason.IncorrectMove,
            meteringPointId: MeteringPointId,
            actions: [WorkflowAction.CancelWorkflow]);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IncorrectMove_Initiator_ReturnsEmpty()
    {
        // When the logged-in user is the initiator of the IncorrectMove process,
        // all actions should be hidden.
        var process = CreateProcess(
            BusinessReason.IncorrectMove,
            meteringPointId: MeteringPointId,
            actions: [WorkflowAction.CancelWorkflow]);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IncorrectMove_NonInitiator_ReturnsActions()
    {
        // When the logged-in user is NOT the initiator, actions should be visible.
        var process = CreateProcess(
            BusinessReason.IncorrectMove,
            meteringPointId: MeteringPointId,
            actorNumber: "9999999999999",
            actions: [WorkflowAction.CancelWorkflow]);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_AllWorkflowActionsExceptNoAction_MapWithoutThrowing()
    {
        // Converts a future additive WorkflowAction package bump into a test failure here
        // instead of a runtime serialization error in production. EndOfSupply short-circuits
        // before any loader (strict mocks prove it), so only the enum mapping is exercised.
        var allActions = Enum.GetValues<WorkflowAction>()
            .Where(a => a != WorkflowAction.NoAction)
            .ToArray();
        var process = CreateProcess(BusinessReason.EndOfSupply, MeteringPointId, actions: allActions);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = (await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None)).ToList();

        actions.Should().HaveCount(allActions.Length);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_UnknownWorkflowAction_IsSilentlyFiltered()
    {
        // Forward compatibility: if PM ships a new WorkflowAction before this BFF learns to
        // map it, the unknown value must be skipped silently. Throwing would surface a
        // serialization error on the entire availableActions field for every process that
        // carries the new action, taking down the overview for the affected user.
        const WorkflowAction unknownAction = (WorkflowAction)9999;
        var process = CreateProcess(
            BusinessReason.EndOfSupply,
            MeteringPointId,
            actions: [WorkflowAction.SendInformation, unknownAction]);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = (await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None)).ToList();

        actions.Should().BeEquivalentTo([MeteringPointProcessAction.SendInformation]);
    }

    [Fact]
    public async Task GetLatestCustomerMoveInProcessId_NewerRejectedMoveIn_DoesNotSupersedeOlderSucceededMoveIn()
    {
        // Product rule: "latest" is the most recent move-in that has taken effect. A rejected
        // move-in never took effect, so it must not suppress correction of the last good move-in;
        // the loader returns the older succeeded id, not the rejected one (both cutoffs are past).
        // The even newer EndOfSupply instance is noise proving other business reasons are ignored.
        var olderSucceededMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000aa"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2025, 12, 1, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var newerRejectedMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000bb"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2026, 1, 15, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Rejected);
        var newestEndOfSupply = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000cc"),
            businessReason: BusinessReason.EndOfSupply,
            expectedValidityDate: new DateTimeOffset(2026, 3, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2026, 2, 15, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var processManagerClient = CreateProcessManagerClient(
            olderSucceededMoveIn,
            newerRejectedMoveIn,
            newestEndOfSupply);

        var result = await MeteringPointProcessNode.GetLatestCustomerMoveInProcessIdAsync(
            [MeteringPointId],
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result[MeteringPointId].Should().Be(olderSucceededMoveIn.Id.ToString());
    }

    [Fact]
    public async Task GetLatestCustomerMoveInProcessId_NewerCanceledMoveIn_DoesNotSupersedeOlderSucceededMoveIn()
    {
        // Like the rejected case: a canceled move-in never took effect and must not suppress
        // correction of the last good move-in, even though its cutoff is in the past.
        var olderSucceededMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000aa"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2025, 12, 1, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var newerCanceledMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000bb"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2026, 1, 15, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Canceled);
        var processManagerClient = CreateProcessManagerClient(
            olderSucceededMoveIn,
            newerCanceledMoveIn);

        var result = await MeteringPointProcessNode.GetLatestCustomerMoveInProcessIdAsync(
            [MeteringPointId],
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result[MeteringPointId].Should().Be(olderSucceededMoveIn.Id.ToString());
    }

    [Fact]
    public async Task GetLatestCustomerMoveInProcessId_FutureMoveIn_DoesNotSupersedeOlderEffectiveMoveIn()
    {
        // A future-dated move-in (cutoff not yet reached) has not taken effect, so it must not
        // suppress correction of the last completed move-in. An accepted future move-in sits in
        // Sleeping (mapped to "Afventer" in the UI), so it is the cutoff date, not the lifecycle
        // state, that excludes it. The correction stays on the older effective move-in until the
        // future one's cutoff is reached.
        var now = DateTimeOffset.UtcNow;
        var olderEffectiveMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000aa"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: now.AddDays(-30),
            createdAt: now.AddDays(-35),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var futureMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000bb"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: now.AddDays(30),
            createdAt: now.AddDays(-1),
            lifecycleState: WorkflowInstanceLifecycleState.Sleeping,
            terminationState: null);
        var processManagerClient = CreateProcessManagerClient(
            olderEffectiveMoveIn,
            futureMoveIn);

        var result = await MeteringPointProcessNode.GetLatestCustomerMoveInProcessIdAsync(
            [MeteringPointId],
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result[MeteringPointId].Should().Be(olderEffectiveMoveIn.Id.ToString());
    }

    [Fact]
    public async Task GetLatestCustomerMoveInProcessId_PastCutoffSleepingMoveIn_SupersedesOlderSucceededMoveIn()
    {
        // A newer move-in whose cutoff has been reached but which is still Sleeping (awaiting
        // customer master data) HAS taken effect. It is the current effective move-in and must
        // take over the correction slot from the older completed one, even though it is not itself
        // correctable yet. Excluding it (e.g. by filtering on lifecycle state) would wrongly leave
        // the correction on a superseded move-in.
        var now = DateTimeOffset.UtcNow;
        var olderSucceededMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000aa"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: now.AddDays(-60),
            createdAt: now.AddDays(-65),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var newerEffectiveSleepingMoveIn = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-0000000000bb"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: now.AddDays(-20),
            createdAt: now.AddDays(-25),
            lifecycleState: WorkflowInstanceLifecycleState.Sleeping,
            terminationState: null);
        var processManagerClient = CreateProcessManagerClient(
            olderSucceededMoveIn,
            newerEffectiveSleepingMoveIn);

        var result = await MeteringPointProcessNode.GetLatestCustomerMoveInProcessIdAsync(
            [MeteringPointId],
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result[MeteringPointId].Should().Be(newerEffectiveSleepingMoveIn.Id.ToString());
    }

    [Fact]
    public async Task GetLatestCustomerMoveInProcessId_EqualExpectedValidityDate_LaterCreatedAtWins()
    {
        // The ids are chosen so the final Id tiebreak alone would pick the earlier-created
        // instance, proving Lifecycle.CreatedAt decides before Id.
        var expectedValidityDate = new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero);
        var createdLater = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-000000000001"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: expectedValidityDate,
            createdAt: new DateTimeOffset(2026, 1, 20, 0, 0, 0, TimeSpan.Zero));
        var createdEarlier = CreateWorkflowInstance(
            id: Guid.Parse("00000000-0000-0000-0000-000000000002"),
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: expectedValidityDate,
            createdAt: new DateTimeOffset(2026, 1, 10, 0, 0, 0, TimeSpan.Zero));
        var processManagerClient = CreateProcessManagerClient(createdEarlier, createdLater);

        var result = await MeteringPointProcessNode.GetLatestCustomerMoveInProcessIdAsync(
            [MeteringPointId],
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result[MeteringPointId].Should().Be(createdLater.Id.ToString());
    }

    private static MeteringPointProcess CreateCustomerMoveInProcess() =>
        CreateProcess(
            BusinessReason.CustomerMoveIn,
            meteringPointId: MeteringPointId,
            state: MeteringPointProcessState.Succeeded);

    private static MeteringPointProcess CreateProcess(
        BusinessReason businessReason,
        string? meteringPointId,
        DateTimeOffset? cutoffDate = null,
        MeteringPointProcessState state = MeteringPointProcessState.Pending,
        WorkflowAction[]? actions = null,
        string? actorNumber = null) =>
        new(
            Id: _processOrchestrationId.ToString(),
            TransactionId: "transaction-id",
            CreatedAt: new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            CutoffDate: cutoffDate,
            BusinessReason: businessReason,
            ActorNumber: actorNumber ?? EnergySupplierGln,
            ActorRole: ActorRole.EnergySupplier.Name,
            State: state,
            Actions: actions ?? [WorkflowAction.CancelWorkflow],
            WorkflowSteps: null,
            MeteringPointId: meteringPointId);

    private static WorkflowInstanceDto CreateWorkflowInstance(
        Guid id,
        BusinessReason businessReason,
        DateTimeOffset? expectedValidityDate,
        DateTimeOffset createdAt,
        WorkflowInstanceLifecycleState lifecycleState = WorkflowInstanceLifecycleState.Terminated,
        WorkflowInstanceTerminationState? terminationState = WorkflowInstanceTerminationState.Succeeded)
    {
        var isTerminated = lifecycleState == WorkflowInstanceLifecycleState.Terminated;
        return new(
            Id: id,
            BusinessReason: businessReason,
            ExpectedValidityDate: expectedValidityDate,
            TransactionId: "transaction-id",
            Lifecycle: new WorkflowInstanceLifecycleDto(
                CreatedBy: new MaskedActorIdentityDto(
                    ActorNumber.Create(EnergySupplierGln),
                    ActorRole.EnergySupplier),
                State: lifecycleState,
                TerminationState: isTerminated ? terminationState : null,
                CreatedAt: createdAt,
                TerminatedAt: isTerminated ? createdAt : null,
                CanceledByWorkflowInstanceId: null),
            Action: WorkflowAction.NoAction,
            Actions: []);
    }

    private static Mock<IProcessManagerClient> CreateProcessManagerClient(params WorkflowInstanceDto[] instances)
    {
        var processManagerClient = new Mock<IProcessManagerClient>();
        processManagerClient
            .Setup(x => x.SearchWorkflowInstancesByMeteringPointIdQueryAsync(
                It.IsAny<SearchWorkflowInstancesByMeteringPointIdQuery>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(instances);
        return processManagerClient;
    }

    private static Mock<IIncorrectMoveInEligibilityDataLoader> CreateEligibilityDataLoader(bool isEligible)
    {
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(isEligible);
        return dataLoader;
    }

    private static Mock<ILatestCustomerMoveInProcessIdDataLoader> CreateLatestDataLoader(string? latestProcessId)
    {
        var dataLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(latestProcessId);
        return dataLoader;
    }

    private static Mock<IHttpContextAccessor> CreateHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        var user = new ClaimsPrincipal(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim("actornumber", EnergySupplierGln),
                new Claim("marketroles", ActorRole.EnergySupplier.Name),
            },
            "MockedAuthenticationType"));
        httpContextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext { User = user });
        return httpContextAccessor;
    }

    private static Mock<IHttpContextAccessor> CreateFasHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        var user = new ClaimsPrincipal(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim("multitenancy", "true"),
            },
            "MockedAuthenticationType"));
        httpContextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext { User = user });
        return httpContextAccessor;
    }
}
