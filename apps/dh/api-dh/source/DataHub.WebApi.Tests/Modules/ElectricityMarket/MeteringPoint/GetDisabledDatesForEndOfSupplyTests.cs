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
using Energinet.DataHub.Core.App.Common.Calendar;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.MeteringPoint;

public class GetSelectableDatesForEndOfSupplyTests
{
    private static readonly DateTimeZone CopenhagenZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

    [Fact]
    public void ReturnsOnlyWorkingDays()
    {
        // Arrange - a regular Wednesday
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - all selectable dates should be working days
        result.Should().NotBeEmpty();

        foreach (var date in selectableLocalDates)
        {
            var dayOfWeek = date.DayOfWeek;
            var isWeekend = dayOfWeek == IsoDayOfWeek.Saturday || dayOfWeek == IsoDayOfWeek.Sunday;
            var isHoliday = IsKnownDanishHoliday(date);

            (isWeekend || isHoliday).Should().BeFalse(
                $"date {date} should be a working day but is {dayOfWeek}");
        }
    }

    [Fact]
    public void FirstSelectableIsTomorrow()
    {
        // Arrange - Wednesday Jan 15; tomorrow (Thu Jan 16) is a working day.
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - today is excluded; tomorrow is the first selectable date.
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 1, 15), "today is not selectable");
        selectableLocalDates.First().Should().Be(new LocalDate(2025, 1, 16), "tomorrow (Thursday) is the first selectable date");
    }

    [Fact]
    public void IncludesAllWorkingDaysFromTomorrow()
    {
        // Arrange - Wednesday Jan 15, first selectable = Jan 16 (Thu)
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToHashSet();

        // Assert - all working days from tomorrow onward should be included
        var start = new LocalDate(2025, 1, 16); // first selectable (tomorrow)
        var end = new LocalDate(2025, 3, 16);   // day 60

        var current = start;
        while (current <= end)
        {
            var dayOfWeek = current.DayOfWeek;
            var isWeekend = dayOfWeek == IsoDayOfWeek.Saturday || dayOfWeek == IsoDayOfWeek.Sunday;
            var isHoliday = IsKnownDanishHoliday(current);

            if (!isWeekend && !isHoliday)
            {
                selectableLocalDates.Should().Contain(
                    current,
                    $"working day {current} ({dayOfWeek}) should be selectable");
            }

            current = current.PlusDays(1);
        }
    }

    [Fact]
    public void DSTSpringForward_DoesNotSkipDates()
    {
        // Arrange - Clock at Feb 15 (Saturday); first selectable = Mon Feb 17 (next working day)
        var calendar = CreateCalendar(new LocalDate(2025, 2, 15));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToHashSet();

        // Assert - weekends around DST transition should NOT be selectable
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 3, 29), "Saturday before DST transition");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 3, 30), "Sunday (DST spring forward day)");

        // Working days around DST should be selectable
        selectableLocalDates.Should().Contain(new LocalDate(2025, 3, 28), "Friday before DST transition");
        selectableLocalDates.Should().Contain(new LocalDate(2025, 3, 31), "Monday after DST transition");
    }

    [Fact]
    public void DSTFallBack_DoesNotDuplicateDates()
    {
        // Arrange - Clock at Sep 1 (Monday); first selectable = Tue Sep 2 (tomorrow)
        var calendar = CreateCalendar(new LocalDate(2025, 9, 1));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - no duplicate dates
        selectableLocalDates.Should().OnlyHaveUniqueItems("DST fall back should not cause duplicate dates");

        // Weekends around DST should not be included
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 10, 25), "Saturday before DST transition");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 10, 26), "Sunday (DST fall back day)");
    }

    [Fact]
    public void CurrentDayIsNonWorkingDay_ReturnsExpectedDates()
    {
        // Arrange - current day is a Saturday (Jan 18); the weekend is skipped.
        var calendar = CreateCalendar(new LocalDate(2025, 1, 18)); // Saturday

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        result.Should().NotBeEmpty();

        // First selectable is the next working day, Monday Jan 20.
        selectableLocalDates.First().Should().Be(new LocalDate(2025, 1, 20));
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 1, 18), "today (Saturday) is not selectable");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 1, 19), "Sunday is not a working day");
    }

    [Fact]
    public void EasterHolidays_AreNotSelectable()
    {
        // Arrange - set clock so Easter 2025 (April 20) holidays fall within the window
        var calendar = CreateCalendar(new LocalDate(2025, 3, 1));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - Easter-related Danish holidays should NOT be selectable
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 4, 17), "Maundy Thursday");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 4, 18), "Good Friday");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 4, 20), "Easter Sunday");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 4, 21), "Easter Monday");
    }

    [Fact]
    public void ChristmasAndNewYear_AreNotSelectable()
    {
        // Arrange
        var calendar = CreateCalendar(new LocalDate(2025, 12, 10));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 12, 24), "Christmas Eve");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 12, 25), "Christmas Day");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 12, 26), "Second Christmas Day");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 12, 31), "New Year's Eve");
        selectableLocalDates.Should().NotContain(new LocalDate(2026, 1, 1), "New Year's Day");
    }

    [Fact]
    public void AscensionAndWhitMonday_AreNotSelectable()
    {
        // Arrange
        var calendar = CreateCalendar(new LocalDate(2025, 5, 1));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 5, 29), "Ascension Day (Kristi Himmelfartsdag)");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 5, 30), "Day after Ascension Day");
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 6, 9), "Whit Monday (2. Pinsedag)");
    }

    [Fact]
    public void ConstitutionDay_IsNotSelectable()
    {
        // Arrange
        var calendar = CreateCalendar(new LocalDate(2025, 5, 1));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        selectableLocalDates.Should().NotContain(new LocalDate(2025, 6, 5), "Constitution Day (Grundlovsdag)");
    }

    [Fact]
    public void ThursdayThe12th_FirstSelectableIsFridayThe13th()
    {
        // Arrange - Thursday Feb 12, 2026; tomorrow (Fri Feb 13) is a working day.
        var calendar = CreateCalendar(new LocalDate(2026, 2, 12));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();
        var selectableLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        selectableLocalDates.First().Should().Be(new LocalDate(2026, 2, 13), "Friday = first selectable (tomorrow)");
        selectableLocalDates.Should().NotContain(new LocalDate(2026, 2, 12), "today is not selectable");
    }

    [Fact]
    public void ReturnsDatesInChronologicalOrder()
    {
        // Arrange
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetSelectableDatesForEndOfSupply(calendar).ToList();

        // Assert - dates should be in chronological order
        result.Should().BeInAscendingOrder();
    }

    #region Helper Methods

    private static DataHubCalendar CreateCalendar(LocalDate date)
    {
        var noon = date.AtMidnight().PlusHours(12);
        var instant = noon.InZoneStrictly(CopenhagenZone).ToInstant();
        return new DataHubCalendar(new FakeClock(instant), CopenhagenZone);
    }

    private static LocalDate ToLocalDate(DateTimeOffset dto)
    {
        var instant = Instant.FromDateTimeOffset(dto);
        return instant.InZone(CopenhagenZone).Date;
    }

    private static bool IsKnownDanishHoliday(LocalDate date)
    {
        // New Year's Day
        if (date.Month == 1 && date.Day == 1)
        {
            return true;
        }

        // Constitution Day
        if (date.Month == 6 && date.Day == 5)
        {
            return true;
        }

        // Christmas holidays
        if (date.Month == 12 && date.Day is 24 or 25 or 26 or 31)
        {
            return true;
        }

        // Easter-related holidays
        var easterSunday = CalculateEasterSunday(date.Year);

        // Maundy Thursday (Easter - 3)
        if (date == easterSunday.PlusDays(-3))
        {
            return true;
        }

        // Good Friday (Easter - 2)
        if (date == easterSunday.PlusDays(-2))
        {
            return true;
        }

        // Easter Monday (Easter + 1)
        if (date == easterSunday.PlusDays(1))
        {
            return true;
        }

        // Ascension Day (Easter + 39)
        if (date == easterSunday.PlusDays(39))
        {
            return true;
        }

        // Day after Ascension (Easter + 40)
        if (date == easterSunday.PlusDays(40))
        {
            return true;
        }

        // Whit Monday (Easter + 50)
        return date == easterSunday.PlusDays(50);
    }

    private static LocalDate CalculateEasterSunday(int year)
    {
        var a = year % 19;
        var b = year % 4;
        var c = year % 7;

        int m, n;
        if (year <= 1899)
        {
            m = 23;
            n = 4;
        }
        else if (year <= 2099)
        {
            m = 24;
            n = 5;
        }
        else
        {
            m = 24;
            n = 6;
        }

        var d = ((19 * a) + m) % 30;
        var e = ((2 * b) + (4 * c) + (6 * d) + n) % 7;

        int month, day;
        if (22 + d + e <= 31)
        {
            month = 3;
            day = 22 + d + e;
        }
        else
        {
            month = 4;
            day = d + e - 9;
        }

        if (d == 29 && e == 6)
        {
            day = 19;
            month = 4;
        }
        else if (d == 28 && e == 6 && a > 10)
        {
            day = 18;
            month = 4;
        }

        return new LocalDate(year, month, day);
    }

    private class FakeClock(Instant instant) : IClock
    {
        public Instant GetCurrentInstant() => instant;
    }

    #endregion
}
