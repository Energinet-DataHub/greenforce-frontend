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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Application.Validation;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation
{
    [UnitTest]
    public sealed class CreateGridAreaCommandRuleSetTests
    {
        private const string ValidName = "Some Area";
        private const string ValidCode = "999";
        private const string ValidPriceArea = "DK1";

        [Fact]
        public async Task Validate_GridArea_ValidatesProperty()
        {
            // Arrange
            const string propertyName = nameof(CreateGridAreaCommand.GridArea);

            var target = new CreateGridAreaCommandRuleSet();
            var command = new CreateGridAreaCommand(null!);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData(ValidName, true)]
        [InlineData("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", true)]
        [InlineData("AaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaX", false)]
        public async Task Validate_Name_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            var propertyName = $"{nameof(CreateGridAreaCommand.GridArea)}.{nameof(CreateGridAreaDto.Name)}";

            var createGridAreaDto = new CreateGridAreaDto(
                value,
                ValidCode,
                ValidPriceArea);

            var target = new CreateGridAreaCommandRuleSet();
            var command = new CreateGridAreaCommand(createGridAreaDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData("000", true)]
        [InlineData("001", true)]
        [InlineData("010", true)]
        [InlineData("100", true)]
        [InlineData("999", true)]
        [InlineData("0001", false)]
        [InlineData("9999", false)]
        [InlineData("+01", false)]
        [InlineData("1,0", false)]
        [InlineData("01a", false)]
        public async Task Validate_Code_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            var propertyName = $"{nameof(CreateGridAreaCommand.GridArea)}.{nameof(CreateGridAreaDto.Code)}";

            var createGridAreaDto = new CreateGridAreaDto(
                ValidName,
                value,
                ValidPriceArea);

            var target = new CreateGridAreaCommandRuleSet();
            var command = new CreateGridAreaCommand(createGridAreaDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData("DK1", true)]
        [InlineData("DK2", true)]
        [InlineData("dk1", true)]
        [InlineData("dk2", true)]
        [InlineData("Dk1", true)]
        [InlineData("Dk2", true)]
        [InlineData("DK3", false)]
        [InlineData("Unknown", false)]
        public async Task Validate_PriceAreaCode_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            var propertyName = $"{nameof(CreateGridAreaCommand.GridArea)}.{nameof(CreateGridAreaDto.PriceAreaCode)}";

            var createGridAreaDto = new CreateGridAreaDto(
                ValidName,
                ValidCode,
                value);

            var target = new CreateGridAreaCommandRuleSet();
            var command = new CreateGridAreaCommand(createGridAreaDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }
    }
}
