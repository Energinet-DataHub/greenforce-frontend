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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class OverlappingActorContactCategoriesRuleServiceTests
    {
        [Fact]
        public void ValidateCategoriesAcrossContacts_NullContactsArgument_ThrowsException()
        {
            // Arrange
            var target = new OverlappingActorContactCategoriesRuleService();

            // Act + Assert
            Assert.Throws<ArgumentNullException>(() => target.ValidateCategoriesAcrossContacts(null!));
        }

        [Fact]
        public void ValidateCategoriesAcrossContacts_CategoriesAreNotUnique_ThrowsException()
        {
            // Arrange
            var target = new OverlappingActorContactCategoriesRuleService();

            // Act + Assert
            Assert.Throws<ValidationException>(() => target.ValidateCategoriesAcrossContacts(
                new[]
                {
                    CreateTestContact(ContactCategory.Charges),
                    CreateTestContact(ContactCategory.ChargeLinks),
                    CreateTestContact(ContactCategory.Charges)
                }));
        }

        [Fact]
        public void ValidateRolesAcrossActors_ValidRoles_DoesNothing()
        {
            // Arrange
            var target = new OverlappingActorContactCategoriesRuleService();

            // Act + Assert
            target.ValidateCategoriesAcrossContacts(
                new[]
                {
                    CreateTestContact(ContactCategory.Charges),
                    CreateTestContact(ContactCategory.ChargeLinks),
                    CreateTestContact(ContactCategory.ElectricalHeating)
                });
        }

        private static ActorContact CreateTestContact(ContactCategory category)
        {
            return new ActorContact(
                Guid.NewGuid(),
                "fake_value",
                category,
                new EmailAddress("fake@value"),
                null);
        }
    }
}
