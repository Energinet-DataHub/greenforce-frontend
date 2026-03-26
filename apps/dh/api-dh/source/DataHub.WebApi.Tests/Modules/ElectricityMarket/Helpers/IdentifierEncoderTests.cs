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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Helpers;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Helpers;

public class IdentifierEncoderTests
{
    [Theory]
    [InlineData("a", "XGBsWeVprB")]
    [InlineData("test", "uVPWetpbdHMl")]
    [InlineData("12345", "zHNND2a5fk")]
    [InlineData("abc123", "dnvpU34RY0PqGlA")]
    [InlineData("test-string", "bkL9snIcDJhAcj0gyGSYUrW0lg7OfZGL")]
    [InlineData("UPPERCASE", "bkQ9s4IcEJh4cFc0gcGS8Urj0lm")]
    [InlineData("MixedCase123", "Ks5SA6tnpvOs5bIES46i7aCKEAqVCthMH")]
    [InlineData("571313115100001072", "uNWOprH3fIs5qwaHZlCFDdcOwnZfsgmAfmqf")]
    public void DecodeMeteringPointId_KnownEncodedValue_ReturnsExpectedString(string expected, string encoded)
    {
        // Act
        var result = IdentifierEncoder.DecodeMeteringPointId(encoded);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("a")]
    [InlineData("test")]
    [InlineData("12345")]
    [InlineData("abc123")]
    [InlineData("test-string")]
    [InlineData("UPPERCASE")]
    [InlineData("MixedCase123")]
    [InlineData("571313115100001072")]
    public void EncodeMeteringPointId_DecodeMeteringPointId_RoundTrip_ReturnsOriginalValue(string input)
    {
        // Act
        var encoded = IdentifierEncoder.EncodeMeteringPointId(input);
        var decoded = IdentifierEncoder.DecodeMeteringPointId(encoded);

        // Assert
        Assert.Equal(input, decoded);
    }

    [Fact]
    public void EncodeMeteringPointId_NonEmptyString_ReturnsAtLeastMinLength()
    {
        // Arrange
        var input = "a";

        // Act
        var result = IdentifierEncoder.EncodeMeteringPointId(input);

        // Assert
        Assert.True(result.Length >= 10);
    }

    [Fact]
    public void EncodeMeteringPointId_WithDateTimeOffsets_DecodeMeteringPointId_RoundTrip_ReturnsExpectedString()
    {
        // Arrange
        var input = "571313115100001072";
        var fromDate = new DateTimeOffset(2005, 3, 2, 22, 4, 0, TimeSpan.Zero);
        var toDate = new DateTimeOffset(2005, 3, 3, 22, 4, 0, TimeSpan.Zero);

        // Act
        var encoded = IdentifierEncoder.EncodeMeteringPointId(input, fromDate, toDate);
        var decoded = IdentifierEncoder.DecodeMeteringPointId(encoded);

        // Assert
        var fromString = fromDate.UtcDateTime.ToString("O");
        var toString = toDate.UtcDateTime.ToString("O");
        Assert.Equal(input + fromString + toString, decoded);
    }

    [Fact]
    public void EncodeMeteringPointId_WithExtraData_DecodeMeteringPointId_RoundTrip_ReturnsExpectedString()
    {
        // Arrange
        var input = "571313115100001072";
        var extraData = "Cus1";

        // Act
        var encoded = IdentifierEncoder.EncodeMeteringPointId(input, extraData);
        var decoded = IdentifierEncoder.DecodeMeteringPointId(encoded);

        // Assert
        Assert.Equal(input + extraData, decoded);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void EncodeMeteringPointId_EmptyString_Throws(string input)
    {
        // Act/Assert
        Assert.Throws<ArgumentException>(() => IdentifierEncoder.EncodeMeteringPointId(input));
    }
}
