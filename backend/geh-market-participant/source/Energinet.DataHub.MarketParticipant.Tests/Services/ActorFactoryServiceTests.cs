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
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Energinet.DataHub.MarketParticipant.Tests.Handlers;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class ActorFactoryServiceTests
    {
        private readonly Address _validAddress = new(
            "test Street",
            "1",
            "1111",
            "Test City",
            "Test Country");

        private readonly BusinessRegisterIdentifier _validCvrBusinessRegisterIdentifier = new("12345678");

        [Fact]
        public async Task CreateAsync_NullOrganization_ThrowsException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.CreateAsync(
                null!,
                new MockedGln(),
                new ActorName("fake_value"),
                Array.Empty<ActorMarketRole>())).ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateAsync_NullGln_ThrowsException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.CreateAsync(
                new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress),
                null!,
                new ActorName("fake_value"),
                Array.Empty<ActorMarketRole>())).ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateAsync_NullMarketRoles_ThrowsException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.CreateAsync(
                new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress),
                new MockedGln(),
                new ActorName("fake_value"),
                null!)).ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateAsync_NewActor_AddsAndReturnsActor()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);
            var marketRoles = new List<ActorMarketRole> { new(EicFunction.EnergySupplier, Enumerable.Empty<ActorGridArea>()) };

            organizationRepository
                .Setup(x => x.GetAsync(organization.Id))
                .ReturnsAsync(organization);

            // Act
            var response = await target
                .CreateAsync(
                    organization,
                    new MockedGln(),
                    new ActorName("fake_value"),
                    marketRoles)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(response);
            Assert.NotEmpty(organization.Actors);
        }

        [Fact]
        public async Task CreateAsync_NewActor_DispatchesEvent()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var actorIntegrationEventsQueueService = new Mock<IActorIntegrationEventsQueueService>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                actorIntegrationEventsQueueService.Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var organization = new Organization(
                new OrganizationId(Guid.NewGuid()),
                "fake_value",
                Array.Empty<Actor>(),
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment 2",
                OrganizationStatus.Active);

            var marketRoles = new List<ActorMarketRole> { new(EicFunction.EnergySupplier, Enumerable.Empty<ActorGridArea>()) };

            organizationRepository
                .Setup(x => x.GetAsync(organization.Id))
                .ReturnsAsync(organization);

            organizationRepository.Setup(x => x.AddOrUpdateAsync(organization)).ReturnsAsync(organization.Id);

            // Act
            await target
                .CreateAsync(
                    organization,
                    new MockedGln(),
                    new ActorName("fake_value"),
                    marketRoles)
                .ConfigureAwait(false);

            // Assert
            actorIntegrationEventsQueueService.Verify(
                x => x.EnqueueActorUpdatedEventAsync(
                    It.Is<OrganizationId>(y => y == organization.Id),
                    It.IsAny<Actor>()),
                Times.Once);
        }

        [Fact]
        public async Task CreateAsync_NewActor_EnsuresGlnUniqueness()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var globalLocationNumberUniquenessService = new Mock<IUniqueGlobalLocationNumberRuleService>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                globalLocationNumberUniquenessService.Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);
            var globalLocationNumber = new MockedGln();
            var marketRoles = new List<ActorMarketRole> { new(EicFunction.EnergySupplier, Enumerable.Empty<ActorGridArea>()) };

            organizationRepository
                .Setup(x => x.GetAsync(organization.Id))
                .ReturnsAsync(organization);

            // Act
            await target
                .CreateAsync(
                    organization,
                    globalLocationNumber,
                    new ActorName("fake_value"),
                    marketRoles)
                .ConfigureAwait(false);

            // Assert
            globalLocationNumberUniquenessService.Verify(
                x => x.ValidateGlobalLocationNumberAvailableAsync(organization, globalLocationNumber),
                Times.Once);
        }

        [Fact]
        public async Task CreateAsync_NewActor_EnsuresValidRoles()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var overlappingBusinessRolesService = new Mock<IOverlappingBusinessRolesRuleService>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                overlappingBusinessRolesService.Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                new Mock<IAllowedGridAreasRuleService>().Object);

            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);
            var globalLocationNumber = new MockedGln();
            var meteringPointTypes = new[] { MeteringPointType.D02Analysis };
            var gridAreas = new List<ActorGridArea> { new(meteringPointTypes) };
            var marketRoles = new List<ActorMarketRole> { new(EicFunction.BalanceResponsibleParty, gridAreas) };

            organizationRepository
                .Setup(x => x.GetAsync(organization.Id))
                .ReturnsAsync(organization);

            // Act
            await target
                .CreateAsync(
                    organization,
                    globalLocationNumber,
                    new ActorName("fake_value"),
                    marketRoles)
                .ConfigureAwait(false);

            // Assert
            overlappingBusinessRolesService.Verify(
                x => x.ValidateRolesAcrossActors(organization.Actors),
                Times.Once);
        }

        [Fact]
        public async Task CreateAsync_NewActor_EnsuresValidGridAreas()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var allowedGridAreasRuleService = new Mock<IAllowedGridAreasRuleService>();
            var target = new ActorFactoryService(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IActorIntegrationEventsQueueService>().Object,
                new Mock<IOverlappingBusinessRolesRuleService>().Object,
                new Mock<IUniqueGlobalLocationNumberRuleService>().Object,
                allowedGridAreasRuleService.Object);

            var organization = new Organization("fake_value", _validCvrBusinessRegisterIdentifier, _validAddress);
            var globalLocationNumber = new MockedGln();
            var meteringPointTypes = new[] { MeteringPointType.D02Analysis };
            var gridAreas = new List<ActorGridArea> { new(Guid.NewGuid(), meteringPointTypes) };
            var marketRoles = new List<ActorMarketRole> { new(EicFunction.BalanceResponsibleParty, gridAreas) };

            organizationRepository
                .Setup(x => x.GetAsync(organization.Id))
                .ReturnsAsync(organization);

            // Act
            await target
                .CreateAsync(
                    organization,
                    globalLocationNumber,
                    new ActorName("fake_value"),
                    marketRoles)
                .ConfigureAwait(false);

            // Assert
            allowedGridAreasRuleService.Verify(
                x => x.ValidateGridAreas(marketRoles),
                Times.Once);
        }
    }
}
