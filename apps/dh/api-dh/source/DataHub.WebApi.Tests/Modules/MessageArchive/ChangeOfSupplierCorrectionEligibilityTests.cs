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
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Modules.MessageArchive;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.MessageArchive;

/// <summary>
/// Unit tests for <see cref="MeteringPointProcessNode.IsChangeOfSupplierCorrectionEligible"/>,
/// the pure BRS-003 correction visibility rule ported from the frontend (#2019).
///
/// Fixed dates keep the assertions deterministic. <c>today</c> is 2026-06-01, so the validity
/// window is [2026-04-02, 2026-06-01] inclusive and the candidate process P has cutoff 2026-05-01.
/// Cutoff/createdAt are stored as UTC midnight, which maps to the same calendar day in the Danish
/// time zone the rule uses, so the day comparisons land on the intended dates.
/// </summary>
public class ChangeOfSupplierCorrectionEligibilityTests
{
    private static readonly LocalDate _today = new(2026, 6, 1);
    private static readonly LocalDate _pv = new(2026, 5, 1);

    [Fact]
    public void LonelyCompletedChangeOfSupplierWithinWindow_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);

        IsEligible(p, [p]).Should().BeTrue();
    }

    [Fact] // TC1
    public void NewerChangeOfSupplierWithFutureCutoff_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var future = ChangeOfSupplier("Q", MeteringPointProcessState.Succeeded, new LocalDate(2026, 6, 15));

        IsEligible(p, [p, future]).Should().BeTrue();
    }

    [Fact] // TC2
    public void ActiveEndOfSupplyAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, MeteringPointProcessState.Pending, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC3.1
    public void ActiveRollbackChangeOfSupplierAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.RollbackChangeOfSupplier, MeteringPointProcessState.Running, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC3.2
    public void NewerCompletedChangeOfSupplier_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Succeeded, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC4
    public void CloseDownMeteringPointAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CloseDownMeteringPoint, MeteringPointProcessState.Succeeded, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC5
    public void ActiveCustomerMoveInAfter_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveIn, MeteringPointProcessState.Pending, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact] // TC6
    public void CompletedCustomerMoveInAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveIn, MeteringPointProcessState.Succeeded, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC7
    public void CustomerMoveOutAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveOut, MeteringPointProcessState.Succeeded, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC8
    public void IncorrectMoveRegisteredAfterP_CutoffBefore_IsNotEligible()
    {
        // A BRS-011 registered after P hides the action. Its Process-Manager-assigned cutoff (here
        // before P) is not part of the link; the registration order is (team-volt#2071).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 4, 15),
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC9
    public void ProductionObligationAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.ProductionObligation, MeteringPointProcessState.Succeeded, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071 scenario 2
    public void ProductionObligationSameCutoffDay_IsNotEligible()
    {
        // A BRS-036 production obligation taking effect on the same day as P hides the action. The
        // other strict-after reasons keep an equal cutoff day eligible (see
        // CompetingProcessWithEqualCutoffDay_IsEligible), but production obligation does not.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.ProductionObligation, MeteringPointProcessState.Succeeded, _pv);

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071
    public void ProductionObligationBeforeCutoffDay_IsEligible()
    {
        // A production obligation taking effect BEFORE P is older than the change of supplier and
        // does not supersede it, so the action stays visible. Pins the lower boundary of the >= rule.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.ProductionObligation, MeteringPointProcessState.Succeeded, new LocalDate(2026, 4, 20));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void CutoffExactlyToday_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today);

        IsEligible(p, [p]).Should().BeTrue();
    }

    [Fact]
    public void CutoffExactlyWindowStart_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.PlusDays(-60));

        IsEligible(p, [p]).Should().BeTrue();
    }

    [Fact]
    public void CutoffOneDayBeforeWindowStart_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.PlusDays(-61));

        IsEligible(p, [p]).Should().BeFalse();
    }

    [Fact]
    public void CutoffInTheFuture_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.PlusDays(1));

        IsEligible(p, [p]).Should().BeFalse();
    }

    [Fact]
    public void ProcessNotSucceeded_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Running, _pv);

        IsEligible(p, [p]).Should().BeFalse();
    }

    [Fact]
    public void CompetingProcessWithEqualCutoffDay_IsEligible()
    {
        // The strict-after reasons (EndOfSupply, etc.) only supersede strictly after P, so a competing
        // one with the same cutoff day as P does not hide the action.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, MeteringPointProcessState.Running, _pv);

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void ActiveRollbackRegisteredAfterP_IsNotEligible()
    {
        // team-volt#2037 (same shape as BRS-011 on dev003): a rollback correcting P is registered after
        // P. Its validity date is assigned by Process Manager and need not match P's (here it is even
        // before P), so the link is the registration order, not the cutoff. Once the rollback is active
        // the action is hidden so a duplicate cannot be started.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.RollbackChangeOfSupplier,
            MeteringPointProcessState.Running,
            cutoff: new LocalDate(2026, 4, 28),
            createdAt: new LocalDate(2026, 5, 10));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact]
    public void SucceededRollbackRegisteredAfterP_IsNotEligible()
    {
        // A completed rollback correcting P keeps the action hidden (team-volt#2037).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.RollbackChangeOfSupplier,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 4, 28),
            createdAt: new LocalDate(2026, 5, 10));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Theory]
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    [InlineData(MeteringPointProcessState.Rejected)]
    public void TerminatedRollbackRegisteredAfterP_IsNotEligible(MeteringPointProcessState terminalState)
    {
        // kommer ikke igen hvis processen afvises: a terminal rollback registered after P keeps the
        // action hidden, so it does not come back even if the rollback is rejected (or canceled/failed).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.RollbackChangeOfSupplier,
            terminalState,
            cutoff: new LocalDate(2026, 4, 28),
            createdAt: new LocalDate(2026, 5, 10));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact]
    public void RollbackRegisteredBeforeP_IsEligible()
    {
        // A rollback registered before P corrects an earlier change of supplier, not P, so a newer
        // change of supplier stays eligible and its action is shown (team-volt#2037).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.RollbackChangeOfSupplier,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 4, 1),
            createdAt: new LocalDate(2026, 4, 1));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Theory]
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    [InlineData(MeteringPointProcessState.Rejected)]
    public void TerminalStateCompetingProcessAfter_IsIgnored(MeteringPointProcessState terminalState)
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, terminalState, new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Theory] // team-volt#2071
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    [InlineData(MeteringPointProcessState.Rejected)]
    public void TerminalIncorrectMoveRegisteredAfterP_IsNotEligible(MeteringPointProcessState terminalState)
    {
        // kommer ikke igen hvis processen afvises: once a BRS-011 incorrect move-in is registered
        // after P, the action stays hidden regardless of the correction's outcome, so it does not
        // come back even if the BRS-011 is rejected (mirrors the rollback rule in team-volt#2037).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            terminalState,
            cutoff: new LocalDate(2026, 4, 15),
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071
    public void IncorrectMoveRegisteredAfterP_WithCutoffAfterPv_IsNotEligible()
    {
        // A BRS-011 registered after P hides the action regardless of its Process-Manager-assigned
        // cutoff, which is not used for the link. Here the cutoff is even after P.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 5, 15),
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071 scenario 1
    public void IncorrectMoveRegisteredAfterP_WithCutoffOnPvDay_IsNotEligible()
    {
        // The dev003 bug: a BRS-011 correcting a move-in just before P is assigned a Process-Manager
        // validity date that lands on P's own day (not strictly before it), so the old cutoff-based
        // rule left the action visible. Registration order hides it: the BRS-011 was created after P.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: _pv,
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071
    public void IncorrectMoveWithoutCutoffRegisteredAfterP_IsNotEligible()
    {
        // The link is the registration instant, not the cutoff, so a BRS-011 with no Process-Manager
        // validity date still hides the action once registered after P. Locks in that the rule is
        // evaluated before the null-cutoff guard in the matrix loop.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: null,
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071
    public void PendingIncorrectMoveRegisteredAfterP_IsNotEligible()
    {
        // A BRS-011 still in flight (Pending) registered after P hides the action too: the rule is
        // state-agnostic, so it does not wait for the correction to complete.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Pending,
            cutoff: new LocalDate(2026, 4, 15),
            createdAt: new LocalDate(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // team-volt#2071
    public void IncorrectMoveRegisteredAfterPCreatedButBeforePCutoff_IsNotEligible()
    {
        // The rule keys off P's registration instant, not its effective/cutoff date. P is registered
        // 04-20 with a later cutoff of 05-01; a BRS-011 registered 04-25 (after P was created, before
        // P's cutoff) hides the action. Under the old effectiveDate-based rule this stayed eligible,
        // so it pins the reference point to process.CreatedAt.
        var p = Process(
            "P",
            BusinessReason.ChangeOfEnergySupplier,
            MeteringPointProcessState.Succeeded,
            cutoff: _pv,
            createdAt: new LocalDate(2026, 4, 20));
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 4, 15),
            createdAt: new LocalDate(2026, 4, 25));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact]
    public void NewerInflightChangeOfSupplierWithinWindow_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Pending, new LocalDate(2026, 5, 20));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact]
    public void NonChangeOfSupplierCandidate_IsNotEligible()
    {
        var p = Process("P", BusinessReason.EndOfSupply, MeteringPointProcessState.Succeeded, _pv);

        IsEligible(p, [p]).Should().BeFalse();
    }

    [Fact]
    public void NewerInflightChangeOfSupplierWithFutureCutoff_IsEligible()
    {
        // A newer in-flight supplier change OUTSIDE the window (future cutoff) does not block:
        // rule 4 only considers in-flight changes whose cutoff is within [windowStart, today].
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Pending, new LocalDate(2026, 6, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void IncorrectMoveRegisteredBeforeP_IsEligible()
    {
        // A BRS-011 registered BEFORE P corrects an earlier move-in, unrelated to P, so it does not
        // hide the action (mirrors RollbackRegisteredBeforeP_IsEligible). Isolates the
        // registration-order boundary: createdAt < P.CreatedAt (team-volt#2071).
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new LocalDate(2026, 4, 15),
            createdAt: new LocalDate(2026, 4, 20));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void NewerCompletedChangeOfSupplierWithCutoffExactlyToday_IsNotEligible()
    {
        // A more recent completed supplier change whose cutoff is exactly today (not future)
        // unseats P. Pins rule 3's non-future guard to its inclusive "<= today" boundary.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Succeeded, _today);

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    private static bool IsEligible(MeteringPointProcess process, IReadOnlyList<MeteringPointProcess> all) =>
        MeteringPointProcessNode.IsChangeOfSupplierCorrectionEligible(process, all, _today);

    private static MeteringPointProcess ChangeOfSupplier(
        string id,
        MeteringPointProcessState state,
        LocalDate cutoff) =>
        Process(id, BusinessReason.ChangeOfEnergySupplier, state, cutoff);

    private static MeteringPointProcess Process(
        string id,
        BusinessReason businessReason,
        MeteringPointProcessState state,
        LocalDate? cutoff = null,
        LocalDate? createdAt = null) =>
        new(
            Id: id,
            TransactionId: null,
            CreatedAt: ToUtcMidnight(createdAt ?? cutoff ?? new LocalDate(2026, 1, 1)),
            CutoffDate: cutoff is { } c ? ToUtcMidnight(c) : null,
            BusinessReason: businessReason,
            ActorNumber: "5790001330552",
            ActorRole: "EnergySupplier",
            State: state,
            MeteringPointId: "571313180400000005");

    private static DateTimeOffset ToUtcMidnight(LocalDate date) =>
        new(date.Year, date.Month, date.Day, 0, 0, 0, TimeSpan.Zero);
}
