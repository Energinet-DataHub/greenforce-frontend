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

public class GetDisabledDatesForEndOfSupplyTests
{
    private static readonly DateTimeZone CopenhagenZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

    [Fact]
    public void DisablesFirst3WorkingDaysAsGapPeriod()
    {
        // Arrange - Wednesday Jan 15
        // Working days: Jan 16 (Thu), Jan 17 (Fri), Jan 20 (Mon) = 3 working day gap
        // First selectable: Jan 21 (Tue)
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToHashSet();

        // Assert - the first 3 working days should be disabled
        result.Should().NotBeEmpty();
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 16), "1st working day in gap (Thursday)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 17), "2nd working day in gap (Friday)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 20), "3rd working day in gap (Monday)");

        // First selectable date should NOT be disabled
        disabledLocalDates.Should().NotContain(new LocalDate(2025, 1, 21), "4th working day = first selectable (Tuesday)");
    }

    [Fact]
    public void DoesNotIncludeWorkingDaysAfterGap()
    {
        // Arrange - Wednesday Jan 15, first selectable = Jan 21 (Tue)
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToHashSet();

        // Assert - verify working days from first selectable date onward are NOT disabled
        var start = new LocalDate(2025, 1, 21); // first selectable (4th working day)
        var end = new LocalDate(2025, 3, 16);   // day 60

        var current = start;
        while (current <= end)
        {
            var dayOfWeek = current.DayOfWeek;
            var isWeekend = dayOfWeek == IsoDayOfWeek.Saturday || dayOfWeek == IsoDayOfWeek.Sunday;
            var isHoliday = IsKnownDanishHoliday(current);

            if (!isWeekend && !isHoliday)
            {
                disabledLocalDates.Should().NotContain(
                    current,
                    $"working day {current} ({dayOfWeek}) should not be disabled");
            }

            current = current.PlusDays(1);
        }
    }

    [Fact]
    public void DSTSpringForward_DoesNotSkipDates()
    {
        // Arrange - set clock so the 1-60 day window spans the DST spring forward (March 30, 2025)
        // Clock at Feb 15 (Saturday), working days: Mon 17, Tue 18, Wed 19 = gap
        // First selectable: Feb 20 (Thursday)
        var calendar = CreateCalendar(new LocalDate(2025, 2, 15));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - verify dates around DST transition are present
        // March 29 is Saturday (should be disabled), March 30 is Sunday (should be disabled)
        disabledLocalDates.Should().Contain(new LocalDate(2025, 3, 29), "Saturday before DST transition");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 3, 30), "Sunday (DST spring forward day)");

        // Verify no dates are skipped - all non-working days after the gap should be disabled
        var allDatesInRange = GetAllDatesInRange(new LocalDate(2025, 2, 20), new LocalDate(2025, 4, 16));
        var workingDatesNotDisabled = allDatesInRange
            .Where(d => !disabledLocalDates.Contains(d))
            .ToList();

        foreach (var date in workingDatesNotDisabled)
        {
            var dayOfWeek = date.DayOfWeek;
            var isWeekend = dayOfWeek == IsoDayOfWeek.Saturday || dayOfWeek == IsoDayOfWeek.Sunday;
            var isHoliday = IsKnownDanishHoliday(date);

            (isWeekend || isHoliday).Should().BeFalse(
                $"date {date} is not disabled but is a non-working day ({dayOfWeek})");
        }
    }

    [Fact]
    public void DSTFallBack_DoesNotDuplicateDates()
    {
        // Arrange - set clock so the 1-60 day window spans the DST fall back (October 26, 2025)
        // Clock at Sep 1 (Monday), working days: Tue 2, Wed 3, Thu 4 = gap
        // First selectable: Sep 5 (Friday)
        var calendar = CreateCalendar(new LocalDate(2025, 9, 1));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - no duplicate dates
        disabledLocalDates.Should().OnlyHaveUniqueItems("DST fall back should not cause duplicate dates");

        // Oct 25 is Saturday (should be disabled), Oct 26 is Sunday/DST day (should be disabled)
        disabledLocalDates.Should().Contain(new LocalDate(2025, 10, 25), "Saturday before DST transition");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 10, 26), "Sunday (DST fall back day)");

        // Verify completeness - after the gap, all non-working days should be disabled
        var allDatesInRange = GetAllDatesInRange(new LocalDate(2025, 9, 5), new LocalDate(2025, 10, 31));
        var workingDatesNotDisabled = allDatesInRange
            .Where(d => !disabledLocalDates.Contains(d))
            .ToList();

        foreach (var date in workingDatesNotDisabled)
        {
            var dayOfWeek = date.DayOfWeek;
            var isWeekend = dayOfWeek == IsoDayOfWeek.Saturday || dayOfWeek == IsoDayOfWeek.Sunday;
            var isHoliday = IsKnownDanishHoliday(date);

            (isWeekend || isHoliday).Should().BeFalse(
                $"date {date} is not disabled but is a non-working day ({dayOfWeek})");
        }
    }

    [Fact]
    public void CurrentDayIsNonWorkingDay_ReturnsExpectedDates()
    {
        // Arrange - set current day to a Saturday (Jan 18)
        // Working days: Mon 20 (wd1), Tue 21 (wd2), Wed 22 (wd3)
        // First selectable: Thu 23 (wd4)
        var calendar = CreateCalendar(new LocalDate(2025, 1, 18)); // Saturday

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();

        // Assert - should still return results (the method works regardless of current day type)
        result.Should().NotBeEmpty();

        // The date range (days 1-60) should be from Jan 19 (Sunday) to Mar 19 (Wednesday)
        var disabledLocalDates = result.Select(ToLocalDate).ToList();
        var minDate = disabledLocalDates.Min();
        var maxDate = disabledLocalDates.Max();

        // First disabled date should be tomorrow (day 1)
        minDate.Should().Be(new LocalDate(2025, 1, 19));
        maxDate.Should().BeLessThanOrEqualTo(new LocalDate(2025, 3, 19));

        // Gap working days should be disabled
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 20), "1st working day in gap (Monday)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 21), "2nd working day in gap (Tuesday)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 22), "3rd working day in gap (Wednesday)");

        // First selectable should NOT be disabled
        disabledLocalDates.Should().NotContain(new LocalDate(2025, 1, 23), "first selectable (Thursday)");
    }

    [Fact]
    public void EasterHolidays_AreDisabled()
    {
        // Arrange - set clock so Easter 2025 (April 20) holidays fall within the window
        // Clock at March 1, so days 3-60 = March 4 - April 30
        var calendar = CreateCalendar(new LocalDate(2025, 3, 1));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - Easter-related Danish holidays should be disabled
        // Easter 2025: April 20 (Sunday)
        // Maundy Thursday: April 17
        // Good Friday: April 18
        // Easter Monday: April 21
        disabledLocalDates.Should().Contain(new LocalDate(2025, 4, 17), "Maundy Thursday");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 4, 18), "Good Friday");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 4, 20), "Easter Sunday (also a Sunday)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 4, 21), "Easter Monday");
    }

    [Fact]
    public void ChristmasAndNewYear_AreDisabled()
    {
        // Arrange - set clock so Dec 24-26, Dec 31, and Jan 1 fall within the window
        // Clock at Dec 10, so days 3-60 = Dec 13 - Feb 8
        var calendar = CreateCalendar(new LocalDate(2025, 12, 10));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - Christmas and New Year holidays should be disabled
        disabledLocalDates.Should().Contain(new LocalDate(2025, 12, 24), "Christmas Eve");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 12, 25), "Christmas Day");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 12, 26), "Second Christmas Day");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 12, 31), "New Year's Eve");
        disabledLocalDates.Should().Contain(new LocalDate(2026, 1, 1), "New Year's Day");
    }

    [Fact]
    public void AscensionAndWhitMonday_AreDisabled()
    {
        // Arrange - set clock so Ascension Day and Whit Monday fall within the window
        // Easter 2025: April 20 → Ascension Day: May 29, day after: May 30, Whit Monday: June 9
        // Clock at May 1, so days 3-60 = May 4 - Jun 30
        var calendar = CreateCalendar(new LocalDate(2025, 5, 1));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        disabledLocalDates.Should().Contain(new LocalDate(2025, 5, 29), "Ascension Day (Kristi Himmelfartsdag)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 5, 30), "Day after Ascension Day");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 6, 9), "Whit Monday (2. Pinsedag)");
    }

    [Fact]
    public void ConstitutionDay_IsDisabled()
    {
        // Arrange - set clock so June 5 (Constitution Day) falls within the window
        // Clock at May 1, so days 3-60 = May 4 - Jun 30
        var calendar = CreateCalendar(new LocalDate(2025, 5, 1));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert
        disabledLocalDates.Should().Contain(new LocalDate(2025, 6, 5), "Constitution Day (Grundlovsdag)");
    }

    [Fact]
    public void BoundaryDates_AreIncludedInRange()
    {
        // Arrange - Jan 15 (Wednesday) + 1 = Jan 16 (Thursday), + 60 = Mar 16 (Sunday)
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToList();

        // Assert - day 1 start (Thursday, in gap) and day 60 boundary (Sunday) should both be disabled
        disabledLocalDates.Should().Contain(new LocalDate(2025, 1, 16), "day 1 boundary (Thursday, in gap)");
        disabledLocalDates.Should().Contain(new LocalDate(2025, 3, 16), "day 60 boundary (Sunday)");
    }

    [Fact]
    public void ThursdayThe12th_FirstSelectableIsWednesdayThe18th()
    {
        // Arrange - Thursday Feb 12, 2026
        // Working days in gap: Fri 13 (wd1), Mon 16 (wd2), Tue 17 (wd3)
        // First selectable: Wed 18 (wd4)
        var calendar = CreateCalendar(new LocalDate(2026, 2, 12));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();
        var disabledLocalDates = result.Select(ToLocalDate).ToHashSet();

        // Assert - gap days are disabled
        disabledLocalDates.Should().Contain(new LocalDate(2026, 2, 13), "Friday (1st working day in gap)");
        disabledLocalDates.Should().Contain(new LocalDate(2026, 2, 14), "Saturday (weekend)");
        disabledLocalDates.Should().Contain(new LocalDate(2026, 2, 15), "Sunday (weekend)");
        disabledLocalDates.Should().Contain(new LocalDate(2026, 2, 16), "Monday (2nd working day in gap)");
        disabledLocalDates.Should().Contain(new LocalDate(2026, 2, 17), "Tuesday (3rd working day in gap)");

        // First selectable date (Wednesday the 18th) should NOT be disabled
        disabledLocalDates.Should().NotContain(new LocalDate(2026, 2, 18), "Wednesday = first selectable date");
    }

    [Fact]
    public void ReturnsDatesInChronologicalOrder()
    {
        // Arrange
        var calendar = CreateCalendar(new LocalDate(2025, 1, 15));

        // Act
        var result = MeteringPointNode.GetDisabledDatesForEndOfSupply(calendar).ToList();

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

    private static List<LocalDate> GetAllDatesInRange(LocalDate start, LocalDate end)
    {
        var dates = new List<LocalDate>();
        var current = start;
        while (current <= end)
        {
            dates.Add(current);
            current = current.PlusDays(1);
        }

        return dates;
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
