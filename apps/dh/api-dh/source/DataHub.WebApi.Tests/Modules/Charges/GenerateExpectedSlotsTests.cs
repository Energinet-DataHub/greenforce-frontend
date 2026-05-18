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

using System.Linq;

using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using FluentAssertions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class GenerateExpectedSlotsTests
{
    [Fact]
    public void GeneratesCorrectNumberOfHourlySlots()
    {
        var from = Instant.FromUtc(2024, 6, 15, 0, 0);
        var to = Instant.FromUtc(2024, 6, 15, 4, 0);

        var slots = ChargesClient.GenerateExpectedSlots(from, to, Resolution.Hourly).ToList();

        slots.Should().HaveCount(4);
        slots[0].Should().Be(Instant.FromUtc(2024, 6, 15, 0, 0));
        slots[3].Should().Be(Instant.FromUtc(2024, 6, 15, 3, 0));
    }

    [Fact]
    public void ExcludesEndBoundary()
    {
        var from = Instant.FromUtc(2024, 6, 15, 0, 0);
        var to = Instant.FromUtc(2024, 6, 15, 2, 0);

        var slots = ChargesClient.GenerateExpectedSlots(from, to, Resolution.Hourly).ToList();

        slots.Should().HaveCount(2);
        slots.Should().NotContain(to);
    }

    [Fact]
    public void EmptyWhenFromEqualsTo()
    {
        var instant = Instant.FromUtc(2024, 6, 15, 0, 0);

        var slots = ChargesClient.GenerateExpectedSlots(instant, instant, Resolution.Hourly);

        slots.Should().BeEmpty();
    }
}
