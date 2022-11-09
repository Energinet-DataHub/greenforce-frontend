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
    public sealed class GlobalLocationNumberValidationRuleTests
    {
        [Theory]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("  ")]
        public void Validate_InvalidGln_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new GlobalLocationNumberValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("790000555550")]
        [InlineData("05790000555550")]
        public void Validate_InvalidLengthGln_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new GlobalLocationNumberValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("579000A555550")]
        public void Validate_InvalidNaNGln_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new GlobalLocationNumberValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("5790000555551")]
        public void Validate_InvalidChecksumGln_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new GlobalLocationNumberValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("5790000555550")]
        [InlineData("6790000555559")]
        public void Validate_ValidGln_ReturnsTrue(string value)
        {
            // Arrange
            var rule = new GlobalLocationNumberValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.True(result);
        }

        private sealed class GlobalLocationNumberValidationRuleTester
        {
            private readonly GlobalLocationNumberValidationRule<object> _rule = new();

            public bool Validate(string value)
            {
                return _rule.IsValid(new ValidationContext<object>(null!), new ActorNumberDto(value));
            }
        }
    }
}
