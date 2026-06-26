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
/// Unit tests for <see cref="MeteringPointProcessNode.IsMoveInCorrectionBlockedByNewerRollback"/>,
/// the pure BRS-011 move-in correction visibility rule that hides the button when a strictly newer
/// BRS-003 (rollback change of supplier) is active or has taken effect (team-volt#2063).
///
/// Fixed dates keep the assertions deterministic. The candidate move-in M has cutoff 2026-01-01,
/// a "newer" rollback cutoff is 2026-02-15, and an "older" rollback cutoff is 2025-12-15. Cutoffs
/// are stored as UTC midnight, which maps to the same calendar day in the Danish time zone the rule
/// uses, so the day comparisons land on the intended dates.
/// </summary>
public class MoveInCorrectionRollbackEligibilityTests
{
    private static readonly LocalDate _moveInDate = new(2026, 1, 1);
    private static readonly LocalDate _newerDate = new(2026, 2, 15);
    private static readonly LocalDate _olderDate = new(2025, 12, 15);

    [Fact] // AC1
    public void SucceededMoveIn_PendingNewerRollback_IsBlocked()
    {
        // move-in @01/01 (succeeded) + BRS-001 @15/02 (completed) + BRS-003 @15/02 (pending).
        // The pending rollback is active and strictly newer than the move-in, so the button hides.
        // The completed change of supplier is noise: it does not affect the rollback-only rule.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var changeOfSupplier = ChangeOfSupplier("C", MeteringPointProcessState.Succeeded, _newerDate);
        var rollback = Rollback("R", MeteringPointProcessState.Pending, _newerDate);

        IsBlocked(moveIn, [moveIn, changeOfSupplier, rollback]).Should().BeTrue();
    }

    [Fact] // AC2
    public void SucceededMoveIn_SucceededNewerRollback_IsBlocked()
    {
        // move-in @01/01 (succeeded) + BRS-001 @15/02 (cancelled) + BRS-003 @15/02 (completed).
        // The completed rollback is strictly newer than the move-in, so the button hides; the
        // cancelled change of supplier is irrelevant.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var changeOfSupplier = ChangeOfSupplier("C", MeteringPointProcessState.Canceled, _newerDate);
        var rollback = Rollback("R", MeteringPointProcessState.Succeeded, _newerDate);

        IsBlocked(moveIn, [moveIn, changeOfSupplier, rollback]).Should().BeTrue();
    }

    [Fact]
    public void RunningNewerRollback_IsBlocked()
    {
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var rollback = Rollback("R", MeteringPointProcessState.Running, _newerDate);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeTrue();
    }

    [Fact]
    public void NoRollback_IsNotBlocked()
    {
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);

        IsBlocked(moveIn, [moveIn]).Should().BeFalse();
    }

    [Theory]
    [InlineData(MeteringPointProcessState.Rejected)]
    [InlineData(MeteringPointProcessState.Canceled)]
    [InlineData(MeteringPointProcessState.Failed)]
    public void TerminatedNewerRollback_IsNotBlocked(MeteringPointProcessState terminalState)
    {
        // A rollback that did not take effect (rejected, canceled, failed) does not block, even
        // though it is strictly newer than the move-in.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var rollback = Rollback("R", terminalState, _newerDate);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeFalse();
    }

    [Fact]
    public void OlderRollback_IsNotBlocked()
    {
        // A rollback strictly OLDER than the move-in does not block.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var rollback = Rollback("R", MeteringPointProcessState.Succeeded, _olderDate);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeFalse();
    }

    [Fact]
    public void RollbackOnSameDanishCalendarDay_IsNotBlocked()
    {
        // The comparison is strictly after, so a rollback on the same Danish calendar day as the
        // move-in does not block.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var rollback = Rollback("R", MeteringPointProcessState.Succeeded, _moveInDate);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeFalse();
    }

    [Fact]
    public void RollbackWithoutCutoff_IsNotBlocked()
    {
        // A rollback carrying no validity date cannot be compared, so it does not block.
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, _moveInDate);
        var rollback = Rollback("R", MeteringPointProcessState.Succeeded, cutoff: null);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeFalse();
    }

    [Fact]
    public void MoveInWithoutCutoff_IsNotBlocked()
    {
        // Without a move-in validity date there is nothing to compare against, so the rule yields
        // "not blocked" (the caller already fails closed elsewhere).
        var moveIn = MoveIn("M", MeteringPointProcessState.Succeeded, cutoff: null);
        var rollback = Rollback("R", MeteringPointProcessState.Succeeded, _newerDate);

        IsBlocked(moveIn, [moveIn, rollback]).Should().BeFalse();
    }

    private static bool IsBlocked(MeteringPointProcess moveIn, IReadOnlyList<MeteringPointProcess> all) =>
        MeteringPointProcessNode.IsMoveInCorrectionBlockedByNewerRollback(moveIn, all);

    private static MeteringPointProcess MoveIn(
        string id,
        MeteringPointProcessState state,
        LocalDate? cutoff) =>
        Process(id, BusinessReason.CustomerMoveIn, state, cutoff);

    private static MeteringPointProcess Rollback(
        string id,
        MeteringPointProcessState state,
        LocalDate? cutoff) =>
        Process(id, BusinessReason.RollbackChangeOfSupplier, state, cutoff);

    private static MeteringPointProcess ChangeOfSupplier(
        string id,
        MeteringPointProcessState state,
        LocalDate? cutoff) =>
        Process(id, BusinessReason.ChangeOfEnergySupplier, state, cutoff);

    private static MeteringPointProcess Process(
        string id,
        BusinessReason businessReason,
        MeteringPointProcessState state,
        LocalDate? cutoff) =>
        new(
            Id: id,
            TransactionId: null,
            CreatedAt: ToUtcMidnight(cutoff ?? new LocalDate(2026, 1, 1)),
            CutoffDate: cutoff is { } c ? ToUtcMidnight(c) : null,
            BusinessReason: businessReason,
            ActorNumber: "5790001330552",
            ActorRole: "EnergySupplier",
            State: state,
            MeteringPointId: "571313180400000005");

    private static DateTimeOffset ToUtcMidnight(LocalDate date) =>
        new(date.Year, date.Month, date.Day, 0, 0, 0, TimeSpan.Zero);
}
