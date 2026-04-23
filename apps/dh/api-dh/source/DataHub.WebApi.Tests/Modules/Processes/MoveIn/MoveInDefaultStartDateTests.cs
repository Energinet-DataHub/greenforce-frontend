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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Processes.MoveIn;

/// <summary>
/// Tests that verify the default start date calculation used in
/// <c>ChangeCustomerCharacteristicsAsync</c> when no <c>processId</c> is supplied.
///
/// The semantic is "midnight of the current Danish day, expressed in UTC"
/// (RSM027 contract). This mirrors the EDI V1 factory tests in opengeh-edi,
/// covering winter (UTC+1), summer (UTC+2), and both DST transition days.
/// </summary>
public class MoveInDefaultStartDateTests
{
    [Fact]
    public void GetDefaultResolvedStartDate_WinterInstant_ReturnsMidnightDanishAsUtcPlus1()
    {
        // Arrange - Danish time is UTC+1 in winter.
        // 2025-01-15T12:00:00Z → Danish date 2025-01-15 → midnight Danish = 2025-01-14T23:00:00Z
        var instant = Instant.FromUtc(2025, 1, 15, 12, 0, 0);

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 1, 14, 23, 0, 0, TimeSpan.Zero));
    }

    [Fact]
    public void GetDefaultResolvedStartDate_SummerInstant_ReturnsMidnightDanishAsUtcPlus2()
    {
        // Arrange - Danish time is UTC+2 in summer.
        // 2025-07-15T12:00:00Z → Danish date 2025-07-15 → midnight Danish = 2025-07-14T22:00:00Z
        var instant = Instant.FromUtc(2025, 7, 15, 12, 0, 0);

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 7, 14, 22, 0, 0, TimeSpan.Zero));
    }

    [Fact]
    public void GetDefaultResolvedStartDate_DstSpringForwardBeforeTransition_ReturnsMidnightDanishAsUtcPlus1()
    {
        // Arrange - Denmark springs forward on 2025-03-30 at 02:00 → 03:00 (UTC+1 → UTC+2).
        // Just before the transition: 2025-03-30T00:30:00Z = 01:30 Danish (still UTC+1).
        // Danish date is still 2025-03-30 → midnight Danish = 2025-03-29T23:00:00Z (UTC+1 offset).
        var instant = Instant.FromUtc(2025, 3, 30, 0, 30, 0);

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 3, 29, 23, 0, 0, TimeSpan.Zero));
    }

    [Fact]
    public void GetDefaultResolvedStartDate_DstSpringForwardAfterTransition_ReturnsMidnightDanishAsUtcPlus1()
    {
        // Arrange - After the spring-forward transition: 2025-03-30T10:00:00Z = 12:00 Danish (UTC+2).
        // Danish date is 2025-03-30 → midnight Danish = 2025-03-29T23:00:00Z (start-of-day is still UTC+1).
        var instant = Instant.FromUtc(2025, 3, 30, 10, 0, 0);

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 3, 29, 23, 0, 0, TimeSpan.Zero));
    }

    [Fact]
    public void GetDefaultResolvedStartDate_DstFallBack_ReturnsMidnightDanishAsUtcPlus2()
    {
        // Arrange - Denmark falls back on 2025-10-26 at 03:00 → 02:00 (UTC+2 → UTC+1).
        // Just before the transition: 2025-10-26T00:30:00Z = 02:30 Danish (UTC+2).
        // Danish date is 2025-10-26 → midnight Danish = 2025-10-25T22:00:00Z (UTC+2 offset).
        var instant = Instant.FromUtc(2025, 10, 26, 0, 30, 0);

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 10, 25, 22, 0, 0, TimeSpan.Zero));
    }

    [Fact]
    public void GetDefaultResolvedStartDate_EarlyMorningDanishBeforeMidnightUtc_UsesCorrectDanishDate()
    {
        // Arrange - The Danish early-morning window is where the naive UTC-date approach gives the wrong calendar date.
        // Example from the RSM027 review: Danish 01:30 on 2025-07-15 = 2025-07-14T23:30:00Z.
        // Naive approach: DateTimeOffset.UtcNow.Date = 2025-07-14 → sends 2025-07-14T00:00:00Z (wrong, one day off).
        // Correct: Danish date is 2025-07-15 → midnight Danish = 2025-07-14T22:00:00Z.
        var instant = Instant.FromUtc(2025, 7, 14, 23, 30, 0); // 01:30 Danish on 2025-07-15

        // Act
        var result = ResolveStartDate(instant);

        // Assert
        result.Should().Be(new DateTimeOffset(2025, 7, 14, 22, 0, 0, TimeSpan.Zero));
    }

    #region Helper Methods

    // Reproduces GetDefaultResolvedStartDate() in MoveInOperations for a fixed instant.
    private static DateTimeOffset ResolveStartDate(Instant instant) =>
        instant
            .InZone(LocalDateExtensions.DanishTimeZone)
            .Date
            .ToUtcDateTimeOffset();

    #endregion
}
