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

using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Validation.Rules;
using FluentValidation;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation.Rules
{
    [UnitTest]
    public sealed class EnergyIdentificationCodeValidationRuleTests
    {
        [Theory]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("  ")]
        public void Validate_InvalidEic_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("10X1001A01A248")]
        [InlineData("10X1001A101A248")]
        [InlineData("10X1001A10041A248")]
        public void Validate_InvalidLengthEic_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("XXX1001A1001A248")]
        public void Validate_InvalidTwoCharacterIssuingNumber_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("10-1001A1001A248")]
        public void Validate_InvalidObjectTypeCharacter_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("10X1001a1001A24c")]
        public void Validate_InvalidTwelveDigitsUpperCase_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("10X1001A1001A24-")]
        public void Validate_InvalidCheckCharacter_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("10X1001A1001A248")]
        [InlineData("10X1001C--00008J")]
        [InlineData("11XNEAS--------Q")]
        [InlineData("11XDANSKECOM---P")]
        [InlineData("11XDISAM-------V")]
        [InlineData("11XDONGPOWER---6")]
        [InlineData("11XDONG-PT-----2")]
        [InlineData("21X0000000011950")]
        [InlineData("23X--130824-KF-2")]
        [InlineData("23X--150401FFF-N")]
        public void Validate_ValidEic_ReturnsTrue(string value)
        {
            // Arrange
            var rule = new EnergyIdentificationCodeValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.True(result);
        }

        private sealed class EnergyIdentificationCodeValidationRuleTester
        {
            private readonly EnergyIdentificationCodeValidationRule<object> _rule = new();

            public bool Validate(string value)
            {
                return _rule.IsValid(new ValidationContext<object>(null!), new ActorNumberDto(value));
            }
        }
    }
}
