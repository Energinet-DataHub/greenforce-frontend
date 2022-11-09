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

using Energinet.DataHub.MarketParticipant.Domain.Model;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation.Rules
{
    [UnitTest]
    public sealed class GlnActorNumberTests
    {
        [Fact]
        public void Type_ReturnsGln()
        {
            // arrange, act
            var actual = ActorNumber.Create("6790000555559");

            // assert
            Assert.Equal(ActorNumberType.Gln, actual.Type);
        }

        [Theory]
        [InlineData("")]
        [InlineData("  ")]
        public void Validate_InvalidGln_ReturnsFalse(string value)
        {
            // arrange, act
            var result = GlnActorNumber.IsValid(value);

            // assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("790000555550")]
        [InlineData("05790000555550")]
        public void Validate_InvalidLengthGln_ReturnsFalse(string value)
        {
            // arrange, act
            var result = GlnActorNumber.IsValid(value);

            // assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("579000A555550")]
        public void Validate_InvalidNaNGln_ReturnsFalse(string value)
        {
            // arrange, act
            var result = GlnActorNumber.IsValid(value);

            // assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("5790000555551")]
        public void Validate_InvalidChecksumGln_ReturnsFalse(string value)
        {
            // arrange, act
            var result = GlnActorNumber.IsValid(value);

            // assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("5790000555550")]
        [InlineData("6790000555559")]
        public void Validate_ValidGln_ReturnsTrue(string value)
        {
            // arrange, act
            var result = GlnActorNumber.IsValid(value);

            // assert
            Assert.True(result);
        }
    }
}
