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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class UniqueGlobalLocationNumberRuleServiceTests
    {
        private readonly Address _validAddress = new(
            "test Street",
            "1",
            "1111",
            "Test City",
            "Test Country");

        private readonly BusinessRegisterIdentifier _validCvrBusinessRegisterIdentifier = new("12345678");

        [Fact]
        public async Task ValidateGlobalLocationNumberAvailableAsync_GlnAvailable_DoesNothing()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new UniqueGlobalLocationNumberRuleService(organizationRepository.Object);

            var gln = new MockedGln();
            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);

            organizationRepository
                .Setup(x => x.GetAsync(gln))
                .ReturnsAsync(Enumerable.Empty<Organization>());

            // Act + Assert
            await target
                .ValidateGlobalLocationNumberAvailableAsync(organization, gln)
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task ValidateGlobalLocationNumberAvailableAsync_GlnInOrganization_DoesNothing()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new UniqueGlobalLocationNumberRuleService(organizationRepository.Object);

            var gln = new MockedGln();
            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);
            organization.Actors.Add(new Actor(gln));

            organizationRepository
                .Setup(x => x.GetAsync(gln))
                .ReturnsAsync(new[] { organization });

            // Act + Assert
            await target
                .ValidateGlobalLocationNumberAvailableAsync(organization, gln)
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task ValidateGlobalLocationNumberAvailableAsync_GlnNotAvailable_ThrowsException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new UniqueGlobalLocationNumberRuleService(organizationRepository.Object);

            var gln = new MockedGln();
            var organization = new Organization(
                new OrganizationId(Guid.NewGuid()),
                "fake_value",
                new[]
                {
                    new Actor(
                        Guid.NewGuid(),
                        new ExternalActorId(Guid.NewGuid()),
                        gln,
                        ActorStatus.Active,
                        Enumerable.Empty<ActorMarketRole>(),
                        new ActorName("fake_value"))
                },
                _validCvrBusinessRegisterIdentifier,
                _validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationRepository
                .Setup(x => x.GetAsync(gln))
                .ReturnsAsync(new[] { organization });

            // Act + Assert
            await Assert
                .ThrowsAsync<ValidationException>(() => target.ValidateGlobalLocationNumberAvailableAsync(new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress), gln))
                .ConfigureAwait(false);
        }
    }
}
