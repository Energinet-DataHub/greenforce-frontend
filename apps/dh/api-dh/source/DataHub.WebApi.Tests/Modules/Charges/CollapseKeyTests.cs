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

public class CollapseKeyTests
{
    [Fact]
    public void Monthly_CollapsesToYearStart() => ChargesClient
        .CollapseKey(Zdt(2024, 7, 15), Resolution.Monthly)
        .Should().Be(new LocalDate(2024, 1, 1));

    [Fact]
    public void Daily_CollapsesToMonthStart() => ChargesClient
        .CollapseKey(Zdt(2024, 7, 15), Resolution.Daily)
        .Should().Be(new LocalDate(2024, 7, 1));

    [Fact]
    public void Hourly_CollapsesToDate() => ChargesClient
        .CollapseKey(Zdt(2024, 7, 15), Resolution.Hourly)
        .Should().Be(new LocalDate(2024, 7, 15));

    [Fact]
    public void Monthly_DifferentMonthsSameYear_SameKey()
    {
        var key1 = ChargesClient.CollapseKey(Zdt(2024, 3, 1), Resolution.Monthly);
        var key2 = ChargesClient.CollapseKey(Zdt(2024, 11, 1), Resolution.Monthly);
        key1.Should().Be(key2);
    }

    [Fact]
    public void Daily_DifferentDaysSameMonth_SameKey()
    {
        var key1 = ChargesClient.CollapseKey(Zdt(2024, 7, 3), Resolution.Daily);
        var key2 = ChargesClient.CollapseKey(Zdt(2024, 7, 28), Resolution.Daily);
        key1.Should().Be(key2);
    }

    private static readonly DateTimeZone Tz = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

    private static ZonedDateTime Zdt(int year, int month, int day)
        => new LocalDate(year, month, day).AtStartOfDayInZone(Tz);
}
