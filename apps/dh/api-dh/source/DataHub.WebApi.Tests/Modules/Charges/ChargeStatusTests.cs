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
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using FluentAssertions;
using NodaTime;
using Xunit;
using ExternalChargeType = Energinet.DataHub.Charges.Abstractions.Shared.ChargeTypeDto;
using Resolution = Energinet.DataHub.WebApi.Modules.Common.Models.Resolution;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class ChargeStatusTests
{
    private static readonly DateTimeOffset _now = DateTimeOffset.Now;

    public static TheoryData<ChargeStatus, DateTimeOffset, DateTimeOffset> TestCases
        => new()
        {
            { ChargeStatus.Cancelled, _now.AddDays(-5), _now.AddDays(-5) },
            { ChargeStatus.Cancelled, _now.AddDays(5), _now.AddDays(5) },
            { ChargeStatus.Closed, _now.AddDays(-5), _now.AddDays(-4) },
            { ChargeStatus.Current, _now.AddDays(-5), _now.AddDays(2) },
            { ChargeStatus.Current, _now.AddDays(-5), DateTimeOffset.MaxValue },
            { ChargeStatus.Awaiting, _now.AddDays(5), _now.AddDays(10) },
            { ChargeStatus.Awaiting, _now.AddDays(5), DateTimeOffset.MaxValue },
        };

    [Theory]
    [MemberData(nameof(TestCases))]
    public void TestChargeStatus(ChargeStatus expectedStatus, DateTimeOffset validFrom, DateTimeOffset validTo)
    {
        var startDate = Instant.FromDateTimeOffset(validFrom);
        Instant? endDate = validTo == DateTimeOffset.MaxValue ? null : Instant.FromDateTimeOffset(validTo);
        var charge = new Charge(
            new("SUB-123", "Energy Provider A", ExternalChargeType.Subscription),
            Resolution.Daily,
            false,
            [new("Period 1", "Standard Period", VatClassificationDto.NoVat, false, startDate, endDate)]);

        charge.Status.Should().Be(expectedStatus);
    }
}
