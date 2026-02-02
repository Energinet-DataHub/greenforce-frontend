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
    private readonly IdentifierEncoder _sut = new();

    [Theory]
    [InlineData("a", "XGBsWeVprB")]
    [InlineData("test", "uVPWetpbdHMl")]
    [InlineData("12345", "zHNND2a5fk")]
    [InlineData("abc123", "dnvpU34RY0PqGlA")]
    [InlineData("test-string", "bkL9snIcDJhAcj0gyGSYUrW0lg7OfZGL")]
    [InlineData("UPPERCASE", "bkQ9s4IcEJh4cFc0gcGS8Urj0lm")]
    [InlineData("MixedCase123", "Ks5SA6tnpvOs5bIES46i7aCKEAqVCthMH")]
    [InlineData("571313115100001072", "uNWOprH3fIs5qwaHZlCFDdcOwnZfsgmAfmqf")]
    public void Decode_KnownEncodedValue_ReturnsExpectedString(string expected, string encoded)
    {
        // Act
        var result = _sut.Decode(encoded);

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
    public void Encode_Decode_RoundTrip_ReturnsOriginalValue(string input)
    {
        // Act
        var encoded = _sut.Encode(input);
        var decoded = _sut.Decode(encoded);

        // Assert
        Assert.Equal(input, decoded);
    }

    [Fact]
    public void Encode_NonEmptyString_ReturnsAtLeastMinLength()
    {
        // Arrange
        const string input = "a";

        // Act
        var result = _sut.Encode(input);

        // Assert
        Assert.True(result.Length >= 10);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Encode_EmptyString_Throws(string input)
    {
        // Act/Assert
        Assert.Throws<ArgumentException>(() => _sut.Encode(input));
    }
}
