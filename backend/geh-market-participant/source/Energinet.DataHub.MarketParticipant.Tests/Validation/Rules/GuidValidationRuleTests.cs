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

using Energinet.DataHub.MarketParticipant.Application.Validation.Rules;
using FluentValidation;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation.Rules
{
    [UnitTest]
    public sealed class GuidValidationRuleTests
    {
        [Theory]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("  ")]
        [InlineData("8F9B8218-BAE6-412B-B91B-0C78A55FF1XX")]
        public void Validate_InvalidGuid_ReturnsFalse(string value)
        {
            // Arrange
            var rule = new GuidValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("1C270767-FADE-477E-A3D9-E892C8745F4C")]
        [InlineData("116A51DF-F137-45A8-83B0-DF332962D321")]
        public void Validate_ValidGuid_ReturnsTrue(string value)
        {
            // Arrange
            var rule = new GuidValidationRuleTester();

            // Act
            var result = rule.Validate(value);

            // Assert
            Assert.True(result);
        }

        private sealed class GuidValidationRuleTester
        {
            private readonly GuidValidationRule<object> _rule = new();

            public bool Validate(string value)
            {
                return _rule.IsValid(new ValidationContext<object>(null!), value);
            }
        }
    }
}
