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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class OrganizationExistsHelperServiceTests
    {
        [Fact]
        public async Task EnsureOrganizationExistsAsync_HasOrganization_ReturnsOrganization()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new OrganizationExistsHelperService(organizationRepository.Object);
            var validAddress = new Address(
            "test Street",
            "1",
            "1111",
            "Test City",
            "Test Country");

            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("12345678");
            var organizationId = Guid.NewGuid();
            var organization = new Organization("fake_value", validBusinessRegisterIdentifier, validAddress);

            organizationRepository
                .Setup(x => x.GetAsync(It.Is<OrganizationId>(y => y.Value == organizationId)))
                .ReturnsAsync(organization);

            // Act
            var actual = await target
                .EnsureOrganizationExistsAsync(organizationId)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
        }

        [Fact]
        public async Task EnsureOrganizationExistsAsync_NoOrganization_ThrowsNotFoundException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new OrganizationExistsHelperService(organizationRepository.Object);

            var organizationId = Guid.NewGuid();

            organizationRepository
                .Setup(x => x.GetAsync(It.Is<OrganizationId>(y => y.Value == organizationId)))
                .ReturnsAsync((Organization?)null);

            // Act + Assert
            await Assert
                .ThrowsAsync<NotFoundValidationException>(() => target.EnsureOrganizationExistsAsync(organizationId))
                .ConfigureAwait(false);
        }
    }
}
