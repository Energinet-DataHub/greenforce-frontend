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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Contact;
using Energinet.DataHub.MarketParticipant.Application.Handlers;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class GetActorContactsHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new GetActorContactsHandler(
                new Mock<IOrganizationExistsHelperService>().Object,
                new Mock<IActorContactRepository>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_NonExistingActor_Throws()
        {
            var organizationRepository = new Mock<IOrganizationExistsHelperService>();
            var contactRepository = new Mock<IActorContactRepository>();
            var target = new GetActorContactsHandler(
                organizationRepository.Object,
                contactRepository.Object);

            var organizationId = new OrganizationId(Guid.NewGuid());
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var actor = new Actor(
                Guid.NewGuid(),
                null,
                new MockedGln(),
                ActorStatus.Active,
                Array.Empty<ActorMarketRole>(),
                new ActorName(string.Empty));

            var organization = new Organization(
                organizationId,
                "fake_value",
                new[] { actor },
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationRepository
                .Setup(x => x.EnsureOrganizationExistsAsync(organizationId.Value))
                .ReturnsAsync(organization);

            var expected = new ActorContact(
                new ContactId(Guid.NewGuid()),
                actor.Id,
                "fake_value",
                ContactCategory.EndOfSupply,
                new EmailAddress("fake@value"),
                new PhoneNumber("1234"));

            contactRepository
                .Setup(x => x.GetAsync(actor.Id))
                .ReturnsAsync(new[] { expected });

            var wrongId = Guid.NewGuid();
            var command = new GetActorContactsCommand(organizationId.Value, wrongId);

            // act + assert
            var ex = await Assert.ThrowsAsync<NotFoundValidationException>(() => target.Handle(command, CancellationToken.None));
            Assert.Contains(wrongId.ToString(), ex.Message, StringComparison.InvariantCultureIgnoreCase);
        }

        [Fact]
        public async Task Handle_HasContacts_ReturnsContacts()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationExistsHelperService>();
            var contactRepository = new Mock<IActorContactRepository>();
            var target = new GetActorContactsHandler(
                organizationRepository.Object,
                contactRepository.Object);

            var organizationId = new OrganizationId(Guid.NewGuid());
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var actor = new Actor(
                Guid.NewGuid(),
                null,
                new MockedGln(),
                ActorStatus.Active,
                Array.Empty<ActorMarketRole>(),
                new ActorName(string.Empty));

            var organization = new Organization(
                organizationId,
                "fake_value",
                new[] { actor },
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationRepository
                .Setup(x => x.EnsureOrganizationExistsAsync(organizationId.Value))
                .ReturnsAsync(organization);

            var expected = new ActorContact(
                new ContactId(Guid.NewGuid()),
                actor.Id,
                "fake_value",
                ContactCategory.EndOfSupply,
                new EmailAddress("fake@value"),
                new PhoneNumber("1234"));

            contactRepository
                .Setup(x => x.GetAsync(actor.Id))
                .ReturnsAsync(new[] { expected });

            var command = new GetActorContactsCommand(organizationId.Value, actor.Id);

            // Act
            var response = await target.Handle(command, CancellationToken.None).ConfigureAwait(false);

            // Assert
            Assert.NotEmpty(response.Contacts);

            var actualContact = response.Contacts.Single();
            Assert.Equal(expected.Id.Value, actualContact.ContactId);
            Assert.Equal(expected.Name, actualContact.Name);
            Assert.Equal(expected.Category.ToString(), actualContact.Category);
            Assert.Equal(expected.Email.Address, actualContact.Email);
            Assert.Equal(expected.Phone?.Number, actualContact.Phone);
        }
    }
}
