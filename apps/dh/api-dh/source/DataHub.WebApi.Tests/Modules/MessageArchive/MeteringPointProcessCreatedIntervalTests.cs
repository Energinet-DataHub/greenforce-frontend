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

using Energinet.DataHub.WebApi.Modules.MessageArchive;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.MessageArchive;

/// <summary>
/// Tests the hidden default period applied by
/// <see cref="MeteringPointProcessNode.ResolveCreatedInterval"/> when the frontend sends no period.
///
/// The default is "start = 2016-01-01 UTC, end = now + 1 calendar year". The helper is pure
/// (the instant is passed in, not read from SystemClock) so the date-defaulting is asserted for a
/// fixed instant. This mirrors <c>MoveInDefaultStartDateTests</c>, where a date-defaulting
/// off-by-one once slipped through without a unit test.
/// </summary>
public class MeteringPointProcessCreatedIntervalTests
{
    private static readonly Instant _now = Instant.FromUtc(2026, 6, 1, 12, 0);

    [Fact]
    public void ResolveCreatedInterval_WhenCreatedIsNull_AppliesHiddenDefaultWindow()
    {
        // Arrange / Act
        var result = MeteringPointProcessNode.ResolveCreatedInterval(created: null, now: _now);

        // Assert - start is the fixed lower bound, end is now + 1 calendar year.
        result.Start.Should().Be(Instant.FromUtc(2016, 1, 1, 0, 0));
        result.End.Should().Be(Instant.FromUtc(2027, 6, 1, 12, 0));
    }

    [Fact]
    public void ResolveCreatedInterval_WhenCreatedIsProvided_ReturnsItUnchanged()
    {
        // Arrange
        var created = new Interval(
            Instant.FromUtc(2024, 3, 10, 8, 30),
            Instant.FromUtc(2024, 4, 20, 16, 45));

        // Act
        var result = MeteringPointProcessNode.ResolveCreatedInterval(created, _now);

        // Assert - an explicit period is passed through untouched (no default applied).
        result.Should().Be(created);
    }

    [Fact]
    public void ResolveCreatedInterval_WhenNowIsLeapDay_ClampsEndToFeb28NextYear()
    {
        // Arrange - documents the PlusYears clamp: 2024 is a leap year, 2025 is not.
        // now = 2024-02-29 → now + 1 calendar year clamps to 2025-02-28.
        var leapDayNow = Instant.FromUtc(2024, 2, 29, 9, 15);

        // Act
        var result = MeteringPointProcessNode.ResolveCreatedInterval(created: null, now: leapDayNow);

        // Assert
        result.Start.Should().Be(Instant.FromUtc(2016, 1, 1, 0, 0));
        result.End.Should().Be(Instant.FromUtc(2025, 2, 28, 9, 15));
    }
}
