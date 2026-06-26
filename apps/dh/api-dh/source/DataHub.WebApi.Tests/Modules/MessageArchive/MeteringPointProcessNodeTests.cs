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
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.ElectricityMarket.Abstractions.Processes.BRS_011.Shared.V1;
using Energinet.DataHub.ElectricityMarket.Client;
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
using NodaTime.Text;
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
        // The loader returns the supplier's move-ins; the resolver matches the one at this process's
        // validity date and requires its previous-supplier flag (team-volt#2050), so a matching
        // flagged move-in surfaces the action. The Verify pins the loader key to (metering point,
        // supplier GLN), the same parameters the moves query takes.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader((process.CutoffDate!.Value, HasPreviousEnergySupplier: true));
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
        // The loader returns no move-ins for this supplier (EM reports none in the 60-day window),
        // so nothing matches the process validity date and the action is hidden.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader();
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_LatestMoveInWithoutPreviousSupplier_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // team-volt#2050: the supplier's move-in at this validity date is found, but EM reports no
        // energy supplier the day before it (the first move-in, or a preceding end of supply), so
        // there is nothing to revert supply to and the action is hidden.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader((process.CutoffDate!.Value, HasPreviousEnergySupplier: false));
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_MoveInSameDanishCalendarDayDifferentInstant_IncludesInitiateIncorrectMoveIn()
    {
        // The resolver matches the supplier's move-in to the process by Danish calendar day, not by
        // instant: EM's ValidityDate (Danish midnight) and the process cutoff (UTC midnight) are the
        // same skæringsdato expressed differently, so they must match. A naive instant comparison
        // would miss this and wrongly hide the button. (red-green verified)
        var cutoff = new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero); // UTC midnight, 1 May
        var moveInValidityDate = new DateTimeOffset(2026, 4, 30, 22, 0, 0, TimeSpan.Zero); // Danish midnight, 1 May (CEST)
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = CreateEligibilityDataLoader((moveInValidityDate, HasPreviousEnergySupplier: true));
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NonCustomerMoveInBusinessReason_DoesNotInvokeDataLoaderAndDoesNotIncludeInitiateIncorrectMoveIn()
    {
        // State is Succeeded so that deleting the business-reason guard would fall through to the
        // strict latest loader and throw, keeping this test falsifiable for the CustomerMoveIn gate.
        var process = CreateProcess(
            BusinessReason.EndOfSupply,
            meteringPointId: MeteringPointId,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
        // FAS has no supplier GLN to scope the moves query against, so it surfaces the action
        // whenever the process's own cutoff is inside the 60-day window. The previous-supplier gate
        // is supplier-scoped and therefore not applied to FAS. The strict eligibility loader proves
        // FAS never consults it.
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Theory]
    // Summer (CEST, UTC+2): 60 days before 2026-06-17 is 2026-04-18; its Danish start-of-day is 2026-04-17T22:00Z.
    [InlineData("2026-06-17T09:00:00Z", "2026-04-17T22:00:00Z")]
    // Winter (CET, UTC+1): 60 days before 2026-02-10 is 2025-12-12; its Danish start-of-day is 2025-12-11T23:00Z.
    [InlineData("2026-02-10T09:00:00Z", "2025-12-11T23:00:00Z")]
    public void IncorrectMoveInWindowStart_ReturnsStartOfDanishCalendarDay60DaysBack(string nowUtc, string expectedUtc)
    {
        // The 60-day correction window must start at the beginning of the Danish calendar day, so a
        // cutoff at Danish midnight exactly 60 days back is included. Counting from
        // DateTimeOffset.UtcNow.AddDays(-60) (the previous behavior) carried the current time of day
        // and excluded that case; this deterministic boundary check pins the calendar-day semantics
        // across both DST offsets. The time of day in `now` must not affect the result.
        var now = InstantPattern.ExtendedIso.Parse(nowUtc).Value;

        var result = MeteringPointProcessNode.IncorrectMoveInWindowStart(now);

        Instant.FromDateTimeOffset(result)
            .Should().Be(InstantPattern.ExtendedIso.Parse(expectedUtc).Value);
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_LatestSucceededMoveInWithoutCutoff_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // The move-in's validity date drives both the FAS window check and the EM moves query, so a
        // latest succeeded move-in with no cutoff cannot be evaluated and fails closed. Strict
        // loaders prove the short-circuit happens before eligibility is consulted.
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoffDate: null,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NewerActiveRollbackBlocksMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // team-volt#2063: the move-in is the latest succeeded one and would otherwise be eligible,
        // but a strictly newer active/completed BRS-003 rollback blocks it, so the rollback
        // eligibility loader excludes this process id (empty set) and the button is hidden on the
        // supplier path. The strict EM eligibility loader proves the gate short-circuits before the
        // per-supplier eligibility check is consulted.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader().Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_NewerActiveRollbackBlocksMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // team-volt#2063: the gate applies to FAS too. The move-in is latest and inside the 60-day
        // FAS window, so without the rollback it would surface the action; the rollback eligibility
        // loader returns an empty set (a strictly newer active/completed BRS-003 rollback), so the
        // button is hidden even for FAS.
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader().Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_EligibleChangeOfSupplier_IncludesHandlingOfIncorrectChangeOfSupplier()
    {
        // The eligibility loader returns a set containing this process's id, so the correction
        // action is offered. Eligibility itself is exercised by IsChangeOfSupplierCorrectionEligible tests.
        var process = CreateProcess(
            BusinessReason.ChangeOfEnergySupplier,
            MeteringPointId,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);
        var correctionLoader = CreateCorrectionEligibilityDataLoader(_processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            correctionLoader.Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.HandlingOfIncorrectChangeOfSupplier);
        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IneligibleChangeOfSupplier_DoesNotIncludeHandlingOfIncorrectChangeOfSupplier()
    {
        // The eligibility loader returns a set that does not contain this process's id, so the
        // correction action is hidden while the regular workflow actions remain.
        var process = CreateProcess(
            BusinessReason.ChangeOfEnergySupplier,
            MeteringPointId,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);
        var correctionLoader = CreateCorrectionEligibilityDataLoader(_otherProcessOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            correctionLoader.Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.HandlingOfIncorrectChangeOfSupplier);
        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_ChangeOfSupplierWithoutMeteringPointId_DoesNotCallLoaderOrIncludeAction()
    {
        // With no metering point id the loader cannot be keyed, so the action is hidden and the
        // strict loader proves it is never invoked.
        var process = CreateProcess(
            BusinessReason.ChangeOfEnergySupplier,
            meteringPointId: null,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);
        var correctionLoader = new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            correctionLoader.Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.HandlingOfIncorrectChangeOfSupplier);
        correctionLoader.Verify(
            x => x.LoadAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()),
            Times.Never);
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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
            new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>(MockBehavior.Strict).Object,
            CreateRollbackEligibilityDataLoader(_processOrchestrationId.ToString()).Object,
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

    [Fact]
    public async Task GetMoveInCorrectionRollbackEligibility_NoBlockingRollback_IncludesMoveIn()
    {
        // No rollback on the metering point, so the succeeded move-in is eligible: its id is returned.
        var moveIn = CreateWorkflowInstance(
            id: _processOrchestrationId,
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2025, 12, 1, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var processManagerClient = CreateProcessManagerClient(moveIn);

        var result = await MeteringPointProcessNode.GetMoveInCorrectionRollbackEligibilityAsync(
            MeteringPointId,
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result.Should().Contain(_processOrchestrationId.ToString());
    }

    [Fact]
    public async Task GetMoveInCorrectionRollbackEligibility_NewerCompletedRollback_ExcludesMoveIn()
    {
        // A BRS-003 rollback with a strictly newer validity date has completed on the metering
        // point, so it blocks the move-in: the move-in id is excluded from the eligible set.
        var moveIn = CreateWorkflowInstance(
            id: _processOrchestrationId,
            businessReason: BusinessReason.CustomerMoveIn,
            expectedValidityDate: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2025, 12, 1, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var newerRollback = CreateWorkflowInstance(
            id: _otherProcessOrchestrationId,
            businessReason: BusinessReason.RollbackChangeOfSupplier,
            expectedValidityDate: new DateTimeOffset(2026, 2, 15, 0, 0, 0, TimeSpan.Zero),
            createdAt: new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero),
            terminationState: WorkflowInstanceTerminationState.Succeeded);
        var processManagerClient = CreateProcessManagerClient(moveIn, newerRollback);

        var result = await MeteringPointProcessNode.GetMoveInCorrectionRollbackEligibilityAsync(
            MeteringPointId,
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result.Should().NotContain(_processOrchestrationId.ToString());
    }

    [Fact]
    public async Task GetMoveInCorrectionRollbackEligibility_ProcessManagerThrows_FailsClosed_ReturnsEmpty()
    {
        // A process-manager failure must hide the action (fail closed), not error the field, so the
        // loader swallows the exception and returns an empty set.
        var processManagerClient = new Mock<IProcessManagerClient>();
        processManagerClient
            .Setup(x => x.SearchWorkflowInstancesByMeteringPointIdQueryAsync(
                It.IsAny<SearchWorkflowInstancesByMeteringPointIdQuery>(),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("process manager unavailable"));

        var result = await MeteringPointProcessNode.GetMoveInCorrectionRollbackEligibilityAsync(
            MeteringPointId,
            processManagerClient.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetIncorrectMoveInEligibility_ProjectsSupplierMoveIns_AndQueriesEmWithSupplierKey()
    {
        // The loader scopes the moves query to (metering point, supplier) and the 60-day window
        // start, and projects each returned move-in to its (validity date, previous-supplier flag),
        // preserving order. The resolver does the date matching, so the loader just surfaces the
        // supplier's move-ins. The Verify pins the supplier-scoped, window-from query construction.
        var key = (MeteringPointId, EnergySupplierGln);
        var withPrevious = new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero);
        var withoutPrevious = new DateTimeOffset(2026, 4, 1, 0, 0, 0, TimeSpan.Zero);
        var electricityMarketClient = CreateMovesClient(
            MovesResult(
                new GetMovesByEnergySupplierIdResultDtoV1.MoveDto(withPrevious, Guid.NewGuid(), HasPreviousEnergySupplier: true),
                new GetMovesByEnergySupplierIdResultDtoV1.MoveDto(withoutPrevious, Guid.NewGuid(), HasPreviousEnergySupplier: false)));

        // Capture the expected window start before invoking, so the assertion does not recompute it
        // at verification time (which could differ if the test crossed Danish midnight in between).
        var expectedWindowStart = MeteringPointProcessNode.IncorrectMoveInWindowStart(SystemClock.Instance.GetCurrentInstant());

        var result = await MeteringPointProcessNode.GetIncorrectMoveInEligibilityAsync(
            [key],
            electricityMarketClient.Object,
            CancellationToken.None);

        result[key].Should().Equal(
            [(withPrevious, true), (withoutPrevious, false)]);
        electricityMarketClient.Verify(
            x => x.SendAsync(
                It.Is<GetMovesByEnergySupplierIdQueryV1>(
                    q => q.MeteringPointId == MeteringPointId
                        && q.EnergySupplierId == EnergySupplierGln
                        && q.From == expectedWindowStart),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetIncorrectMoveInEligibility_SuccessWithNoData_ReturnsEmpty()
    {
        var moveIns = await InvokeIncorrectMoveInEligibilityAsync(
            Result<GetMovesByEnergySupplierIdResultDtoV1>.SuccessWithNoData());

        moveIns.Should().BeEmpty();
    }

    [Fact]
    public async Task GetIncorrectMoveInEligibility_FailedResult_FailsClosed_ReturnsEmpty()
    {
        // Fail closed: an EM transport failure yields no move-ins (hiding the action) rather than
        // erroring the whole availableActions field.
        var moveIns = await InvokeIncorrectMoveInEligibilityAsync(
            Result<GetMovesByEnergySupplierIdResultDtoV1>.Fail("EM transport error"));

        moveIns.Should().BeEmpty();
    }

    private static async Task<IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>> InvokeIncorrectMoveInEligibilityAsync(
        Result<GetMovesByEnergySupplierIdResultDtoV1> electricityMarketResult)
    {
        var key = (MeteringPointId, EnergySupplierGln);
        var electricityMarketClient = CreateMovesClient(electricityMarketResult);

        var result = await MeteringPointProcessNode.GetIncorrectMoveInEligibilityAsync(
            [key],
            electricityMarketClient.Object,
            CancellationToken.None);

        return result[key];
    }

    private static Mock<IElectricityMarketClient> CreateMovesClient(
        Result<GetMovesByEnergySupplierIdResultDtoV1> electricityMarketResult)
    {
        var electricityMarketClient = new Mock<IElectricityMarketClient>();
        electricityMarketClient
            .Setup(x => x.SendAsync(
                It.IsAny<GetMovesByEnergySupplierIdQueryV1>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(electricityMarketResult);
        return electricityMarketClient;
    }

    private static Result<GetMovesByEnergySupplierIdResultDtoV1> MovesResult(
        params GetMovesByEnergySupplierIdResultDtoV1.MoveDto[] moveIns) =>
        Result<GetMovesByEnergySupplierIdResultDtoV1>.Success(
            new GetMovesByEnergySupplierIdResultDtoV1(moveIns.ToList(), []));

    private static MeteringPointProcess CreateCustomerMoveInProcess() =>
        CreateProcess(
            BusinessReason.CustomerMoveIn,
            meteringPointId: MeteringPointId,
            cutoffDate: DateTimeOffset.UtcNow.AddDays(-10),
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
            Actions: [],
            WorkflowDescriptionName: string.Empty);
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

    private static Mock<IIncorrectMoveInEligibilityDataLoader> CreateEligibilityDataLoader(
        params (DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)[] supplierMoveIns)
    {
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((IReadOnlyList<(DateTimeOffset ValidityDate, bool HasPreviousEnergySupplier)>)supplierMoveIns.ToList());
        return dataLoader;
    }

    private static Mock<IChangeOfSupplierCorrectionEligibilityDataLoader> CreateCorrectionEligibilityDataLoader(
        params string[] eligibleProcessIds)
    {
        var dataLoader = new Mock<IChangeOfSupplierCorrectionEligibilityDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IReadOnlySet<string>)eligibleProcessIds.ToHashSet());
        return dataLoader;
    }

    private static Mock<IMoveInCorrectionRollbackEligibilityDataLoader> CreateRollbackEligibilityDataLoader(
        params string[] eligibleProcessIds)
    {
        var dataLoader = new Mock<IMoveInCorrectionRollbackEligibilityDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IReadOnlySet<string>)eligibleProcessIds.ToHashSet());
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
