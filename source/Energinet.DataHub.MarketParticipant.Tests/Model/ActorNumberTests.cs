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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation.Rules
{
    [UnitTest]
    public sealed class ActorNumberTests
    {
        [Fact]
        public void Create_ValidEicNumber_ReturnsEicActorNumber()
        {
            // arrange
            const string ValidEic = "10X1001A1001A248";

            // act
            var actual = ActorNumber.Create(ValidEic);

            // assert
            Assert.IsType<EicActorNumber>(actual);
        }

        [Fact]
        public void Create_ValidGlnNumber_ReturnsGlnActorNumber()
        {
            // arrange
            const string ValidGln = "5790000555550";

            // act
            var actual = ActorNumber.Create(ValidGln);

            // assert
            Assert.IsType<GlnActorNumber>(actual);
        }

        [Fact]
        public void Create_InvalidNumber_ReturnsUnknownActorNumber()
        {
            // arrange
            const string InvalidNumber = "invalid";

            // act
            var actual = ActorNumber.Create(InvalidNumber);

            // assert
            Assert.IsType<UnknownActorNumber>(actual);
        }
    }
}
