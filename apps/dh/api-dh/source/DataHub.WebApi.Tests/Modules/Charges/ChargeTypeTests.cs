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
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using FluentAssertions;
using Xunit;
using RequestChangeOfPriceListChargeType = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Models.ChargeTypeV2;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class ChargeTypeTests
{
    [Theory]
    [InlineData(nameof(ChargeType.Subscription), RequestChangeOfPriceListChargeType.D01)]
    [InlineData(nameof(ChargeType.Fee), RequestChangeOfPriceListChargeType.D02)]
    [InlineData(nameof(ChargeType.Tariff), RequestChangeOfPriceListChargeType.D03)]
    public void ToRequestChangeOfPriceListChargeType_MapsCorrectly(string chargeTypeName, RequestChangeOfPriceListChargeType expected)
    {
        var chargeType = chargeTypeName switch
        {
            nameof(ChargeType.Subscription) => ChargeType.Subscription,
            nameof(ChargeType.Fee) => ChargeType.Fee,
            nameof(ChargeType.Tariff) => ChargeType.Tariff,
            _ => throw new ArgumentOutOfRangeException(nameof(chargeTypeName), chargeTypeName, null),
        };

        chargeType.ToRequestChangeOfPriceListChargeType().Should().Be(expected);
    }
}
