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

using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class NextSlotTests
{
    [Fact]
    public void Hourly_Advances1Hour()
    {
        var slot = Utc(2024, 6, 15, 10, 0);
        ChargesClient.NextSlot(slot, Resolution.Hourly)
            .Should().Be(Utc(2024, 6, 15, 11, 0));
    }

    [Fact]
    public void Daily_Advances1Day()
    {
        // Midnight UTC on June 15 in Danish summer time (UTC+2) is June 15 02:00 local
        // We want to test that it advances by one calendar day in Danish time
        var tz = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var slot = new LocalDate(2024, 6, 15).AtStartOfDayInZone(tz).ToInstant();
        var expected = new LocalDate(2024, 6, 16).AtStartOfDayInZone(tz).ToInstant();
        ChargesClient.NextSlot(slot, Resolution.Daily)
            .Should().Be(expected);
    }

    [Fact]
    public void Daily_AcrossDstTransition()
    {
        // DST spring forward in Denmark: March 31 2024 at 02:00 → 03:00
        var tz = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var slot = new LocalDate(2024, 3, 30).AtStartOfDayInZone(tz).ToInstant();
        var expected = new LocalDate(2024, 3, 31).AtStartOfDayInZone(tz).ToInstant();
        ChargesClient.NextSlot(slot, Resolution.Daily)
            .Should().Be(expected);
    }

    [Fact]
    public void Monthly_Advances1Month()
    {
        var tz = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var slot = new LocalDate(2024, 1, 1).AtStartOfDayInZone(tz).ToInstant();
        var expected = new LocalDate(2024, 2, 1).AtStartOfDayInZone(tz).ToInstant();
        ChargesClient.NextSlot(slot, Resolution.Monthly)
            .Should().Be(expected);
    }

    [Fact]
    public void Monthly_AcrossYearBoundary()
    {
        var tz = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var slot = new LocalDate(2024, 12, 1).AtStartOfDayInZone(tz).ToInstant();
        var expected = new LocalDate(2025, 1, 1).AtStartOfDayInZone(tz).ToInstant();
        ChargesClient.NextSlot(slot, Resolution.Monthly)
            .Should().Be(expected);
    }

    private static Instant Utc(int year, int month, int day, int hour = 0, int minute = 0)
        => Instant.FromUtc(year, month, day, hour, minute);
}
