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
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Moq;
using Xunit;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    public sealed class UniqueOrganizationBusinessRegisterIdentifierServiceTests
    {
        [Fact]
        public async Task Ensure_BusinessRegisterIdentifierNotUnique_Throws()
        {
            // arrange
            var currentOrganizationToUpdate = new Organization(
                new OrganizationId(Guid.Parse("3710F53D-9EF8-4EF1-B941-C9C14B443FEC")),
                "org1Name",
                Enumerable.Empty<Actor>(),
                new BusinessRegisterIdentifier("same_value"),
                new Address(string.Empty, string.Empty, string.Empty, string.Empty, "DK"),
                string.Empty,
                OrganizationStatus.Active);

            var anotherOrganizationToUpdateWithSameIdentifier = new Organization(
                new OrganizationId(Guid.Parse("4444F53D-9EF8-4EF1-B941-C9C14B443FEC")),
                "org2Name",
                Enumerable.Empty<Actor>(),
                new BusinessRegisterIdentifier("same_value"),
                new Address(string.Empty, string.Empty, string.Empty, string.Empty, "DK"),
                string.Empty,
                OrganizationStatus.Active);

            var repository = new Mock<IOrganizationRepository>();
            repository.Setup(x => x.GetAsync()).ReturnsAsync(new[] { currentOrganizationToUpdate, anotherOrganizationToUpdateWithSameIdentifier });

            var target = new UniqueOrganizationBusinessRegisterIdentifierService(repository.Object);

            // act + assert
            await Assert.ThrowsAsync<ValidationException>(
                () => target.EnsureUniqueBusinessRegisterIdentifierAsync(currentOrganizationToUpdate));
        }

        [Fact]
        public async Task Ensure_BusinessRegisterIdentifierUnique_DoesNotThrow()
        {
            // arrange
            var existingOrganisation = new Organization(
                new OrganizationId(Guid.Parse("3710F53D-9EF8-4EF1-B941-C9C14B443FEC")),
                "org1Name",
                Enumerable.Empty<Actor>(),
                new BusinessRegisterIdentifier("fake_value"),
                new Address(string.Empty, string.Empty, string.Empty, string.Empty, "DK"),
                string.Empty,
                OrganizationStatus.Active);

            var repository = new Mock<IOrganizationRepository>();
            repository.Setup(x => x.GetAsync()).ReturnsAsync(new[] { existingOrganisation });

            var organization = new Organization(
                new OrganizationId(Guid.Parse("4444F53D-9EF8-4EF1-B941-C9C14B443FEC")),
                "org1Name",
                Enumerable.Empty<Actor>(),
                new BusinessRegisterIdentifier("unique"),
                new Address(string.Empty, string.Empty, string.Empty, string.Empty, "DK"),
                string.Empty,
                OrganizationStatus.Active);

            var target = new UniqueOrganizationBusinessRegisterIdentifierService(repository.Object);

            // act + assert
            await target.EnsureUniqueBusinessRegisterIdentifierAsync(organization);
        }
    }
}
