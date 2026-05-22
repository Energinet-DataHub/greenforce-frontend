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
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Models;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using FluentAssertions;
using NodaTime.Extensions;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class ChargeSeriesPeriodsTests
{
    [Fact]
    public void BuildSeriesPeriods_MonthlyResolution_BuildsOneSeriesPeriodPerPointWithPositionOne()
    {
        var charge = CreateCharge(Resolution.Monthly);
        var start = new DateTimeOffset(2026, 9, 14, 22, 0, 0, TimeSpan.Zero);
        var points = new List<ChargePointV2>
        {
            new(Position: 3, PriceAmount: 10.101259m),
            new(Position: 7, PriceAmount: 10.101259m),
            new(Position: 2, PriceAmount: 10.101259m),
            new(Position: 1, PriceAmount: 10.101259m),
        };

        // Compute end by applying NextSlot for each point (aligned with production slot logic)
        var slotStart = start.ToInstant();
        for (var i = 0; i < points.Count; i++)
            slotStart = ChargesClient.NextSlot(slotStart, Resolution.Monthly);

        var end = slotStart.ToDateTimeOffset();

        var periods = ChargesClient.BuildSeriesPeriods(charge, start, end, points);

        periods.Should().HaveCount(4);

        var actualPeriodStart = start.ToInstant();
        foreach (var period in periods)
        {
            var expectedEnd = ChargesClient.NextSlot(actualPeriodStart, Resolution.Monthly);
            period.Start.Should().Be(actualPeriodStart.ToDateTimeOffset());
            period.End.Should().Be(expectedEnd.ToDateTimeOffset());
            period.Points.Should().ContainSingle();
            period.Points.Single().Position.Should().Be(1);
            actualPeriodStart = expectedEnd;
        }
    }

    [Fact]
    public void BuildSeriesPeriods_NonMonthlyResolution_BuildsSingleSeriesPeriodWithAllPoints()
    {
        var charge = CreateCharge(Resolution.Hourly);
        var start = new DateTimeOffset(2026, 9, 14, 22, 0, 0, TimeSpan.Zero);
        var end = start.AddHours(4);
        var points = new List<ChargePointV2>
        {
            new(Position: 1, PriceAmount: 1m),
            new(Position: 2, PriceAmount: 2m),
            new(Position: 3, PriceAmount: 3m),
            new(Position: 4, PriceAmount: 4m),
        };

        var periods = ChargesClient.BuildSeriesPeriods(charge, start, end, points);

        periods.Should().ContainSingle();
        periods[0].Resolution.Should().Be(ResolutionV2.PT1H);
        periods[0].Start.Should().Be(start);
        periods[0].End.Should().Be(end);
        periods[0].Points.Should().BeEquivalentTo(points);
    }

    [Fact]
    public void BuildMonthlySeriesPeriods_IrregularStartDate_BuildsPeriodsAdvancingOneMonthPerSlot()
    {
        var charge = CreateCharge(Resolution.Monthly);
        var start = new DateTimeOffset(2026, 9, 14, 22, 0, 0, TimeSpan.Zero);
        var points = new List<ChargePointV2>
        {
            new(Position: 2, PriceAmount: 1m),
            new(Position: 2, PriceAmount: 2m),
            new(Position: 2, PriceAmount: 3m),
        };

        var periods = ChargesClient.BuildMonthlySeriesPeriods(charge, start, points);

        periods.Should().HaveCount(3);

        var firstExpectedEnd = ChargesClient.NextSlot(start.ToInstant(), Resolution.Monthly).ToDateTimeOffset();
        periods[0].Start.Should().Be(start);
        periods[0].End.Should().Be(firstExpectedEnd);
        periods[1].Start.Should().Be(firstExpectedEnd);
        periods[2].Start.Should().Be(periods[1].End);
        periods.SelectMany(p => p.Points).Should().OnlyContain(p => p.Position == 1);
    }

    [Fact]
    public void BuildMonthlySeriesPeriods_SinglePoint_BuildsSingleSeriesPeriod()
    {
        var charge = CreateCharge(Resolution.Monthly);
        var start = new DateTimeOffset(2027, 1, 31, 23, 0, 0, TimeSpan.Zero);
        var points = new List<ChargePointV2> { new(Position: 9, PriceAmount: 1.44m) };

        var periods = ChargesClient.BuildMonthlySeriesPeriods(charge, start, points);

        periods.Should().ContainSingle();
        periods[0].Start.Should().Be(start);
        periods[0].End.Should().Be(ChargesClient.NextSlot(start.ToInstant(), Resolution.Monthly).ToDateTimeOffset());
        periods[0].Points.Should().ContainSingle();
        periods[0].Points.Single().Position.Should().Be(1);
        periods[0].Points.Single().PriceAmount.Should().Be(1.44m);
    }

    private static Charge CreateCharge(Resolution resolution)
        => new(
            Id: new ChargeIdentifierDto("TEST", "1234567890", ChargeTypeDto.Tariff),
            Resolution: resolution,
            TaxIndicator: false,
            SpotDependingPrice: false,
            TypeDisplayName: "Tariff",
            PeriodDtos: []);
}
