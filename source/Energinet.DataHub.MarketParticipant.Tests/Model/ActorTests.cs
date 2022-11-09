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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Model
{
    [UnitTest]
    public sealed class ActorTests
    {
        [Fact]
        public void Ctor_NewRole_HasStatusNew()
        {
            // Arrange + Act
            var actor = new Actor(new MockedGln());

            // Assert
            Assert.Equal(ActorStatus.New, actor.Status);
        }

        [Theory]
        [InlineData(ActorStatus.New, true)]
        [InlineData(ActorStatus.Active, true)]
        public void Activate_ChangesState_IfAllowed(ActorStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestActor(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Activate();
                Assert.Equal(ActorStatus.Active, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Activate());
            }
        }

        [Theory]
        [InlineData(ActorStatus.Active, true)]
        [InlineData(ActorStatus.Inactive, true)]
        [InlineData(ActorStatus.Passive, true)]
        public void Deactivate_ChangesState_IfAllowed(ActorStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestActor(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Deactivate();
                Assert.Equal(ActorStatus.Inactive, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Deactivate());
            }
        }

        [Theory]
        [InlineData(ActorStatus.Active, true)]
        [InlineData(ActorStatus.Passive, true)]
        public void SetAsPassive_ChangesState_IfAllowed(ActorStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestActor(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.SetAsPassive();
                Assert.Equal(ActorStatus.Passive, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.SetAsPassive());
            }
        }

        private static Actor CreateTestActor(ActorStatus status)
        {
            return new Actor(
                Guid.Empty,
                new ExternalActorId(Guid.Empty),
                new MockedGln(),
                status,
                Enumerable.Empty<ActorMarketRole>(),
                new ActorName("test_actor_name"));
        }
    }
}
