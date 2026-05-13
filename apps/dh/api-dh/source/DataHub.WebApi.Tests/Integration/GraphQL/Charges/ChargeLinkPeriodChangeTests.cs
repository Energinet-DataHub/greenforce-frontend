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

using System.Collections.Generic;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeLinkPeriodChangeTests
{
    private static readonly Instant _t0 = Instant.FromUtc(2024, 1, 1, 0, 0);
    private static readonly Instant _t1 = Instant.FromUtc(2024, 6, 1, 0, 0);
    private static readonly Instant _t2 = Instant.FromUtc(2024, 3, 1, 0, 0);

    [Fact]
    public void SinglePeriod_ReturnsStarted()
    {
        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, _t1, _t0),
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Single(changes);
        Assert.Equal(ChargeLinkPeriodChangeType.Started, changes[0].ChangeType);
        Assert.Equal(_t0.ToDateTimeOffset(), changes[0].EffectiveDate);
        Assert.Equal(1, changes[0].Period.Factor);
        Assert.Null(changes[0].PreviousPeriod);
    }

    [Fact]
    public void CancelledPeriod_FromEqualsTo_ReturnsCancelled()
    {
        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, _t1, _t0),
            MakePeriod(1, _t0, _t0, _t1),
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Equal(2, changes.Count);
        Assert.Equal(ChargeLinkPeriodChangeType.Started, changes[0].ChangeType);
        Assert.Equal(ChargeLinkPeriodChangeType.Cancelled, changes[1].ChangeType);
        Assert.Equal(_t0.ToDateTimeOffset(), changes[1].EffectiveDate);
        Assert.NotNull(changes[1].PreviousPeriod);
    }

    [Fact]
    public void StoppedPeriod_ToShortenedFromNull_ReturnsStopped()
    {
        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, null, _t0),
            MakePeriod(1, _t0, _t2, _t1),
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Equal(2, changes.Count);
        Assert.Equal(ChargeLinkPeriodChangeType.Stopped, changes[1].ChangeType);
        Assert.Equal(_t2.ToDateTimeOffset(), changes[1].EffectiveDate);
        Assert.NotNull(changes[1].PreviousPeriod);
    }

    [Fact]
    public void StoppedPeriod_ToShortenedFromLater_ReturnsStopped()
    {
        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, _t1, _t0),
            MakePeriod(1, _t0, _t2, _t1),
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Equal(2, changes.Count);
        Assert.Equal(ChargeLinkPeriodChangeType.Stopped, changes[1].ChangeType);
        Assert.Equal(_t2.ToDateTimeOffset(), changes[1].EffectiveDate);
    }

    [Fact]
    public void EditedPeriod_FactorChanged_ReturnsEditedWithNewFactor()
    {
        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, _t1, _t0),
            MakePeriod(3, _t0, _t1, _t1),
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Equal(2, changes.Count);
        Assert.Equal(ChargeLinkPeriodChangeType.Edited, changes[1].ChangeType);
        Assert.Equal(3, changes[1].Period.Factor);
        Assert.Equal(1, changes[1].PreviousPeriod?.Factor);
        Assert.Equal(_t0.ToDateTimeOffset(), changes[1].EffectiveDate);
    }

    [Fact]
    public void MultipleChanges_FullLifecycle()
    {
        var t3 = Instant.FromUtc(2024, 9, 1, 0, 0);
        var t4 = Instant.FromUtc(2024, 12, 1, 0, 0);

        var periods = new List<ChargeLinkPeriodDto>
        {
            MakePeriod(1, _t0, null, _t0),          // Started
            MakePeriod(2, _t0, null, _t1),           // Edited (factor 1 → 2)
            MakePeriod(2, _t0, t3, t3),              // Stopped at t3
            MakePeriod(2, _t0, _t0, t4),             // Cancelled
        };

        var changes = ChargeLinkPeriodChange.FromPeriods(periods);

        Assert.Equal(4, changes.Count);
        Assert.Equal(ChargeLinkPeriodChangeType.Started, changes[0].ChangeType);
        Assert.Equal(ChargeLinkPeriodChangeType.Edited, changes[1].ChangeType);
        Assert.Equal(ChargeLinkPeriodChangeType.Stopped, changes[2].ChangeType);
        Assert.Equal(ChargeLinkPeriodChangeType.Cancelled, changes[3].ChangeType);
    }

    private static ChargeLinkPeriodDto MakePeriod(
        int factor, Instant from, Instant? to, Instant created, bool isActual = false) =>
        new(factor, from, to, created, string.Empty, isActual);
}
