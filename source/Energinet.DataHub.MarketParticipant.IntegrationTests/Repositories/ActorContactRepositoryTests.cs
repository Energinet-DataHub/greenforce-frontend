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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Common;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class ActorContactRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;
        private readonly Address _validAddress = new(
            "test Street",
            "1",
            "1111",
            "Test City",
            "Test Country");

        public ActorContactRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAsync_ContactNotExists_ReturnsNull()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var contactRepository = new ActorContactRepository(context);

            // Act
            var testContact = await contactRepository
                .GetAsync(new ContactId(Guid.NewGuid()))
                ;

            // Assert
            Assert.Null(testContact);
        }

        [Fact]
        public async Task GetAsync_ForAnOrganization_ReturnsNull()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var organizationRepository = new OrganizationRepository(context);

            var organization = new Organization("Test Organization", MockedBusinessRegisterIdentifier.New(), _validAddress);
            var actor = new Actor(new MockedGln());
            organization.Actors.Add(actor);

            var organizationId = await organizationRepository
                .AddOrUpdateAsync(organization)
                ;

            organization = await organizationRepository.GetAsync(organizationId);
            actor = organization!.Actors.First();

            var contactRepository = new ActorContactRepository(context);
            var categories = new[]
            {
                ContactCategory.EndOfSupply,
                ContactCategory.ChargeLinks,
                ContactCategory.Notification,
                ContactCategory.MeasurementData,
                ContactCategory.Recon
            };

            for (var i = 0; i < 5; i++)
            {
                await contactRepository
                    .AddAsync(new ActorContact(
                        actor.Id,
                        "fake_value",
                        categories[i],
                        new EmailAddress("fake@fake.dk"),
                        new PhoneNumber("1234567")))
                    ;
            }

            // Act
            var testContacts = await contactRepository
                .GetAsync(actor.Id)
                ;

            // Assert
            Assert.Equal(5, testContacts.Count());
        }

        [Fact]
        public async Task AddAsync_OneContact_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var organizationRepository = new OrganizationRepository(context);
            var organization = new Organization("Test Organization", MockedBusinessRegisterIdentifier.New(), _validAddress);
            var actor = new Actor(new MockedGln());
            organization.Actors.Add(actor);

            var organizationId = await organizationRepository
                .AddOrUpdateAsync(organization)
                ;

            organization = await organizationRepository.GetAsync(organizationId);
            actor = organization!.Actors.First();

            var contactRepository = new ActorContactRepository(context);

            var testContact = new ActorContact(
                actor.Id,
                "fake_value",
                ContactCategory.Charges,
                new EmailAddress("fake@fake.dk"),
                new PhoneNumber("1234567"));

            // Act
            var contactId = await contactRepository.AddAsync(testContact);
            var newContact = await contactRepository.GetAsync(contactId);

            // Assert
            Assert.NotNull(newContact);
            Assert.NotEqual(Guid.Empty, newContact?.Id.Value);
            Assert.NotEqual(Guid.Empty, newContact?.ActorId);
            Assert.Equal(testContact.Category, newContact?.Category);
            Assert.Equal(testContact.Email.Address, newContact?.Email.Address);
            Assert.Equal(testContact.Name, newContact?.Name);
            Assert.Equal(testContact.Phone?.Number, newContact?.Phone?.Number);
        }

        [Fact]
        public async Task RemoveAsync_OneContact_RemovesContact()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var organizationRepository = new OrganizationRepository(context);
            var organization = new Organization("Test Organization", MockedBusinessRegisterIdentifier.New(), _validAddress);
            var actor = new Actor(new MockedGln());
            organization.Actors.Add(actor);

            var organizationId = await organizationRepository
                .AddOrUpdateAsync(organization)
                ;

            organization = await organizationRepository.GetAsync(organizationId);
            actor = organization!.Actors.First();

            var contactRepository = new ActorContactRepository(context);

            var testContact = new ActorContact(
                actor.Id,
                "fake_value",
                ContactCategory.Charges,
                new EmailAddress("fake@fake.dk"),
                new PhoneNumber("1234567"));

            var contactId = await contactRepository.AddAsync(testContact);
            var newContact = await contactRepository.GetAsync(contactId);

            // Act
            await contactRepository.RemoveAsync(newContact!);
            var deletedContact = await contactRepository.GetAsync(contactId);

            // Assert
            Assert.Null(deletedContact);
        }

        [Fact]
        public async Task RemoveAsync_NonExistentContact_DoesNothing()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var contactRepository = new ActorContactRepository(context);

            var testContact = new ActorContact(
                new ContactId(Guid.NewGuid()),
                Guid.NewGuid(),
                "fake_value",
                ContactCategory.Charges,
                new EmailAddress("fake@fake.dk"),
                new PhoneNumber("1234567"));

            // Act + Assert
            await contactRepository.RemoveAsync(testContact);
        }

        [Fact]
        public async Task GetAsync_DifferentContexts_CanReadBack()
        {
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var organizationRepository = new OrganizationRepository(context);
            var organization = new Organization("Test Organization", MockedBusinessRegisterIdentifier.New(), _validAddress);
            var actor = new Actor(new MockedGln());
            organization.Actors.Add(actor);

            var organizationId = await organizationRepository
                .AddOrUpdateAsync(organization)
                ;

            organization = await organizationRepository.GetAsync(organizationId);
            actor = organization!.Actors.First();

            await using var contextReadback = _fixture.DatabaseManager.CreateDbContext();

            var contactRepository = new ActorContactRepository(context);
            var contactRepositoryReadback = new ActorContactRepository(contextReadback);

            var testContact = new ActorContact(
                actor.Id,
                "fake_value",
                ContactCategory.Charges,
                new EmailAddress("fake@fake.dk"),
                new PhoneNumber("1234567"));

            // Act
            var contactId = await contactRepository.AddAsync(testContact);
            var newContact = await contactRepositoryReadback.GetAsync(contactId);

            // Assert
            Assert.NotNull(newContact);
            Assert.NotEqual(Guid.Empty, newContact?.Id.Value);
            Assert.Equal(testContact.Category, newContact?.Category);
            Assert.Equal(testContact.Email.Address, newContact?.Email.Address);
            Assert.Equal(testContact.Name, newContact?.Name);
            Assert.Equal(testContact.Phone?.Number, newContact?.Phone?.Number);
        }
    }
}
