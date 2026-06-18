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
    private static readonly DateOnly _today = new(2026, 6, 1);
    private static readonly DateOnly _pv = new(2026, 5, 1);

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
        var future = ChangeOfSupplier("Q", MeteringPointProcessState.Succeeded, new DateOnly(2026, 6, 15));

        IsEligible(p, [p, future]).Should().BeTrue();
    }

    [Fact] // TC2
    public void ActiveEndOfSupplyAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, MeteringPointProcessState.Pending, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC3.1
    public void ActiveRollbackChangeOfSupplierAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.RollbackChangeOfSupplier, MeteringPointProcessState.Running, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC3.2
    public void NewerCompletedChangeOfSupplier_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Succeeded, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC4
    public void CloseDownMeteringPointAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CloseDownMeteringPoint, MeteringPointProcessState.Succeeded, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC5
    public void ActiveCustomerMoveInAfter_IsEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveIn, MeteringPointProcessState.Pending, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact] // TC6
    public void CompletedCustomerMoveInAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveIn, MeteringPointProcessState.Succeeded, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC7
    public void CustomerMoveOutAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.CustomerMoveOut, MeteringPointProcessState.Succeeded, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC8
    public void IncorrectMoveCreatedAfterAndCutoffBefore_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new DateOnly(2026, 4, 15),
            createdAt: new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
    }

    [Fact] // TC9
    public void ProductionObligationAfter_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.ProductionObligation, MeteringPointProcessState.Succeeded, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeFalse();
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
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.AddDays(-60));

        IsEligible(p, [p]).Should().BeTrue();
    }

    [Fact]
    public void CutoffOneDayBeforeWindowStart_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.AddDays(-61));

        IsEligible(p, [p]).Should().BeFalse();
    }

    [Fact]
    public void CutoffInTheFuture_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _today.AddDays(1));

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
        // The supersede checks are strict-after, so a competing process with the same cutoff day
        // as P does not hide the action.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, MeteringPointProcessState.Running, _pv);

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Theory]
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    [InlineData(MeteringPointProcessState.Rejected)]
    public void TerminalStateCompetingProcessAfter_IsIgnored(MeteringPointProcessState terminalState)
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process("Q", BusinessReason.EndOfSupply, terminalState, new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Theory]
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    [InlineData(MeteringPointProcessState.Rejected)]
    public void TerminalStateIncorrectMoveSibling_IsIgnored(MeteringPointProcessState terminalState)
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            terminalState,
            cutoff: new DateOnly(2026, 4, 15),
            createdAt: new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void IncorrectMoveWithCutoffAfterPv_IsEligible()
    {
        // Rule 6 only supersedes when the incorrect move corrects an EARLIER move-in (cutoff
        // before P). A cutoff after P does not supersede, and IncorrectMove is not a rule-5 reason.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new DateOnly(2026, 5, 15),
            createdAt: new DateOnly(2026, 5, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void NewerInflightChangeOfSupplierWithinWindow_IsNotEligible()
    {
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Pending, new DateOnly(2026, 5, 20));

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
        var q = ChangeOfSupplier("Q", MeteringPointProcessState.Pending, new DateOnly(2026, 6, 15));

        IsEligible(p, [p, q]).Should().BeTrue();
    }

    [Fact]
    public void IncorrectMoveCreatedBeforePv_IsEligible()
    {
        // Rule 6 supersedes only when the incorrect move was started AFTER P's validity; one
        // created before P (even with a cutoff before P) does not block. Isolates createdAt > pv.
        var p = ChangeOfSupplier("P", MeteringPointProcessState.Succeeded, _pv);
        var q = Process(
            "Q",
            BusinessReason.IncorrectMove,
            MeteringPointProcessState.Succeeded,
            cutoff: new DateOnly(2026, 4, 15),
            createdAt: new DateOnly(2026, 4, 20));

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
        DateOnly cutoff) =>
        Process(id, BusinessReason.ChangeOfEnergySupplier, state, cutoff);

    private static MeteringPointProcess Process(
        string id,
        BusinessReason businessReason,
        MeteringPointProcessState state,
        DateOnly? cutoff = null,
        DateOnly? createdAt = null) =>
        new(
            Id: id,
            TransactionId: null,
            CreatedAt: ToUtcMidnight(createdAt ?? cutoff ?? new DateOnly(2026, 1, 1)),
            CutoffDate: cutoff is { } c ? ToUtcMidnight(c) : null,
            BusinessReason: businessReason,
            ActorNumber: "5790001330552",
            ActorRole: "EnergySupplier",
            State: state,
            MeteringPointId: "571313180400000005");

    private static DateTimeOffset ToUtcMidnight(DateOnly date) =>
        new(date.Year, date.Month, date.Day, 0, 0, 0, TimeSpan.Zero);
}
