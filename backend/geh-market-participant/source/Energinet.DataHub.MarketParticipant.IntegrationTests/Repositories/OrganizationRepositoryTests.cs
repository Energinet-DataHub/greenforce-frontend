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
using System.Collections.Generic;
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
    public sealed class OrganizationRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;
        private readonly Address _validAddress = new(
            "test Street",
            "1",
            "1111",
            "Test City",
            "Test Country");

        public OrganizationRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task AddOrUpdateAsync_OneOrganization_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);
            var testOrg = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress, "Test Comment");

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(testOrg);
            var newOrg = await orgRepository2.GetAsync(orgId);

            // Assert
            Assert.NotNull(newOrg);
            Assert.NotEqual(Guid.Empty, newOrg?.Id.Value);
            Assert.Equal(testOrg.Name, newOrg?.Name);
            Assert.Equal(testOrg.Comment, newOrg?.Comment);
            Assert.Equal(testOrg.Status, newOrg?.Status);
        }

        [Fact]
        public async Task AddOrUpdateAsync_OneOrganizationWithAddress_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();

            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);

            var testOrg = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(testOrg);
            var newOrg = await orgRepository2.GetAsync(orgId);

            // Assert
            Assert.NotNull(newOrg);
            Assert.NotEqual(Guid.Empty, newOrg?.Id.Value);
            Assert.Equal(testOrg.Name, newOrg?.Name);
            Assert.Equal(testOrg.Address.City, newOrg?.Address.City);
        }

        [Fact]
        public async Task AddOrUpdateAsync_OneOrganizationWithBusinessRegisterIdentifier_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();

            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);
            var testOrg = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(testOrg);
            var newOrg = await orgRepository2.GetAsync(orgId);

            // Assert
            Assert.NotNull(newOrg);
            Assert.NotEqual(Guid.Empty, newOrg?.Id.Value);
            Assert.Equal(testOrg.Name, newOrg?.Name);
            Assert.Equal(testOrg.BusinessRegisterIdentifier.Identifier, newOrg?.BusinessRegisterIdentifier.Identifier);
        }

        [Fact]
        public async Task AddOrUpdateAsync_OrganizationNotExists_ReturnsNull()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);

            // Act
            var testOrg = await orgRepository
                .GetAsync(new OrganizationId(Guid.NewGuid()))
                ;

            // Assert
            Assert.Null(testOrg);
        }

        [Fact]
        public async Task AddOrUpdateAsync_OneOrganizationChanged_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var testOrg = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(testOrg);
            var newOrg = await orgRepository.GetAsync(orgId);

            newOrg = new Organization(
                newOrg!.Id,
                "NewName",
                newOrg.Actors,
                newOrg.BusinessRegisterIdentifier,
                newOrg.Address,
                "Test Comment 2",
                OrganizationStatus.New);

            await orgRepository.AddOrUpdateAsync(newOrg);
            newOrg = await orgRepository.GetAsync(orgId);

            // Assert
            Assert.NotNull(newOrg);
            Assert.NotEqual(Guid.Empty, newOrg?.Id.Value);
            Assert.Equal("NewName", newOrg?.Name);
            Assert.Equal("Test Comment 2", newOrg?.Comment);
            Assert.Equal(OrganizationStatus.New, newOrg?.Status);
        }

        [Fact]
        public async Task AddOrUpdateAsync_ActorAdded_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);

            var initialActor = new Actor(new MockedGln());

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);
            organization.Actors.Add(initialActor);

            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Act
            var newActor = new Actor(new MockedGln());
            organization!.Actors.Add(newActor);

            await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Assert
            Assert.NotNull(organization);
            Assert.Equal(2, organization!.Actors.Count);
            Assert.Contains(organization.Actors, x => x.ExternalActorId == initialActor.ExternalActorId);
            Assert.Contains(organization.Actors, x => x.ExternalActorId == newActor.ExternalActorId);
        }

        [Fact]
        public async Task AddOrUpdateAsync_AddGridAreaToActor_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var gridAreaRepository = new GridAreaRepository(context);

            var gridArea = new GridArea(new GridAreaName("fake_value"), new GridAreaCode("123"), PriceAreaCode.Dk1);

            var expected = await gridAreaRepository
                .AddOrUpdateAsync(gridArea)
                ;

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            var initalActor = new Actor(new MockedGln());
            initalActor.MarketRoles.Add(new ActorMarketRole(EicFunction.DataProvider, new[] { new ActorGridArea(expected.Value, Enumerable.Empty<MeteringPointType>()) }));
            organization.Actors.Add(initalActor);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(organization);

            organization = await orgRepository.GetAsync(orgId);
            var actualGridArea = organization!
                .Actors
                .Single()
                .MarketRoles
                .Single()
                .GridAreas.Single();

            // Assert
            Assert.Equal(expected.Value, actualGridArea.Id);
        }

        [Fact]
        public async Task AddOrUpdateAsync_MarketRoleAdded_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            var balancePowerSupplierActor = new Actor(new MockedGln());
            balancePowerSupplierActor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalancingServiceProvider, new List<ActorGridArea>()));
            organization.Actors.Add(balancePowerSupplierActor);

            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Act
            var meteringPointAdministratorActor = new Actor(new MockedGln());
            meteringPointAdministratorActor.MarketRoles.Add(new ActorMarketRole(EicFunction.MeteringPointAdministrator, new List<ActorGridArea>()));
            organization!.Actors.Add(meteringPointAdministratorActor);

            await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Assert
            Assert.NotNull(organization);
            Assert.Equal(2, organization!.Actors.Count);
            Assert.Contains(
                organization.Actors,
                x => x.MarketRoles.All(y => y.Function == EicFunction.BalancingServiceProvider));
            Assert.Contains(
                organization.Actors,
                x => x.MarketRoles.All(y => y.Function == EicFunction.MeteringPointAdministrator));
        }

        [Fact]
        public async Task AddOrUpdateAsync_MeteringPointAdded_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var gridAreaRepository = new GridAreaRepository(context);

            var gridAreaToInsert = new GridArea(new GridAreaName("fake_value"), new GridAreaCode("123"), PriceAreaCode.Dk1);

            var gridAreaToInsert_Id = await gridAreaRepository
                .AddOrUpdateAsync(gridAreaToInsert)
                ;

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            var someActor = new Actor(new MockedGln());
            someActor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, new List<ActorGridArea>
            {
                new(gridAreaToInsert_Id.Value, new List<MeteringPointType>
                {
                    MeteringPointType.D02Analysis
                })
            }));
            organization.Actors.Add(someActor);

            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Act
            foreach (var organizationActor in organization!.Actors)
            {
                foreach (var organizationActorMarketRole in organizationActor.MarketRoles)
                {
                    foreach (var actorGridArea in organizationActorMarketRole.GridAreas)
                    {
                        actorGridArea.MeteringPointTypes.Add(MeteringPointType.D05NetProduction);
                    }
                }
            }

            await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            var actorMeteringPointTypes =
                organization!.Actors.Single().MarketRoles.Single().GridAreas.Single().MeteringPointTypes;

            // Assert
            Assert.NotNull(organization);
            Assert.Equal(2, actorMeteringPointTypes.Count);
            Assert.Contains(
                actorMeteringPointTypes,
                x => x == MeteringPointType.D02Analysis);
            Assert.Contains(
                actorMeteringPointTypes,
                x => x == MeteringPointType.D05NetProduction);
        }

        [Fact]
        public async Task GetAsync_DifferentContexts_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();

            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);
            var gln = new MockedGln();

            // Act
            organization.Actors.Add(new Actor(gln));
            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository2.GetAsync(orgId);

            // Assert
            Assert.NotNull(organization);
            Assert.Single(organization!.Actors);
            Assert.Contains(organization.Actors, x => x.ActorNumber == gln);
        }

        [Fact]
        public async Task AddOrUpdateAsync_ActorWith1MeteringTypesAdded_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var contextRead = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var orgRepositoryRead = new OrganizationRepository(contextRead);
            var gridAreaRepository = new GridAreaRepository(context);

            var gridAreaToInsert = new GridArea(new GridAreaName("fake_value"), new GridAreaCode("123"), PriceAreaCode.Dk1);

            var gridAreaToInsert_Id = await gridAreaRepository
                .AddOrUpdateAsync(gridAreaToInsert)
                ;

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            var meteringPointTypes = new List<MeteringPointType>() { MeteringPointType.D05NetProduction };
            var gridArea = new ActorGridArea(gridAreaToInsert_Id.Value, meteringPointTypes);

            var actorWithMeteringTypes = new Actor(new MockedGln());
            actorWithMeteringTypes.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, new List<ActorGridArea>() { gridArea }));
            organization.Actors.Add(actorWithMeteringTypes);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepositoryRead.GetAsync(orgId);

            var actorMeteringPointTypes =
                organization!.Actors.Single().MarketRoles.Single().GridAreas.Single().MeteringPointTypes;

            // Assert
            Assert.NotNull(organization);
            Assert.Contains(
                actorMeteringPointTypes,
                x => x.Equals(MeteringPointType.D05NetProduction));
        }

        [Fact]
        public async Task AddOrUpdateAsync_OrganizationRoleWith2MeteringTypesAdded_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var contextRead = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);
            var orgRepositoryRead = new OrganizationRepository(contextRead);
            var gridAreaRepository = new GridAreaRepository(context);

            var gridAreaToInsert = new GridArea(new GridAreaName("fake_value"), new GridAreaCode("123"), PriceAreaCode.Dk1);

            var gridAreaToInsert_Id = await gridAreaRepository
                .AddOrUpdateAsync(gridAreaToInsert)
                ;

            var meteringPointTypesToAdd = new[] { MeteringPointType.D03NotUsed, MeteringPointType.D12TotalConsumption };

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            var actorWithMeteringTypes = new Actor(new MockedGln());
            actorWithMeteringTypes.MarketRoles.Add(new ActorMarketRole(EicFunction.Producer, new List<ActorGridArea> { new(gridAreaToInsert_Id.Value, meteringPointTypesToAdd) }));
            organization.Actors.Add(actorWithMeteringTypes);

            // Act
            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepositoryRead.GetAsync(orgId);

            // Assert
            Assert.NotNull(organization);
            Assert.Contains(
                meteringPointTypesToAdd,
                x => x.Equals(MeteringPointType.D03NotUsed));
            Assert.Contains(
                meteringPointTypesToAdd,
                x => x.Equals(MeteringPointType.D12TotalConsumption));
        }

        [Fact]
        public async Task GetAsync_All_ReturnsAllOrganizations()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();

            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);

            var globalLocationNumber = new MockedGln();
            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            organization.Actors.Add(new Actor(globalLocationNumber));
            await orgRepository.AddOrUpdateAsync(organization);

            // Act
            var organizations = await orgRepository2
                .GetAsync()
                ;

            // Assert
            Assert.NotEmpty(organizations);
        }

        [Fact]
        public async Task GetAsync_GlobalLocationNumber_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();

            var orgRepository = new OrganizationRepository(context);
            var orgRepository2 = new OrganizationRepository(context2);

            var globalLocationNumber = new MockedGln();
            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);

            organization.Actors.Add(new Actor(globalLocationNumber));
            await orgRepository.AddOrUpdateAsync(organization);

            // Act
            var organizations = await orgRepository2
                .GetAsync(globalLocationNumber)
                ;

            // Assert
            Assert.NotNull(organizations);
            var expected = organizations.Single();
            Assert.Equal(globalLocationNumber, expected.Actors.Single().ActorNumber);
        }

        [Fact]
        public async Task AddOrUpdateAsync_ActorName_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var orgRepository = new OrganizationRepository(context);

            var initialActor = new Actor(new MockedGln()) { Name = new ActorName("ActorName") };

            var organization = new Organization("Test", MockedBusinessRegisterIdentifier.New(), _validAddress);
            organization.Actors.Add(initialActor);

            var orgId = await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Act
            var newActor = new Actor(new MockedGln()) { Name = new ActorName("fake_value") };
            organization!.Actors.Add(newActor);

            await orgRepository.AddOrUpdateAsync(organization);
            organization = await orgRepository.GetAsync(orgId);

            // Assert
            Assert.NotNull(organization);
            Assert.Equal(2, organization!.Actors.Count);
            Assert.Contains(organization.Actors, x => x.Name == initialActor.Name);
            Assert.Contains(organization.Actors, x => x.Name == newActor.Name);
        }
    }
}
