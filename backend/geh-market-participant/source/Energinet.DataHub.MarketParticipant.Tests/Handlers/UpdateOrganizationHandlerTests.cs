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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;
using Energinet.DataHub.MarketParticipant.Application.Handlers.Organization;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using MediatR;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class UpdateOrganizationHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new UpdateOrganizationHandler(
                new Mock<IOrganizationRepository>().Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IOrganizationIntegrationEventsQueueService>().Object,
                new Mock<IOrganizationExistsHelperService>().Object,
                new Mock<IUniqueOrganizationBusinessRegisterIdentifierService>().Object,
                new Mock<IOrganizationIntegrationEventsHelperService>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_UpdateOrganization_ReturnsOk()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var organizationIntegrationEventsQueueService = new Mock<IOrganizationIntegrationEventsQueueService>();
            var organizationIntegrationEventsHelperService = new Mock<IOrganizationIntegrationEventsHelperService>();

            var target = new UpdateOrganizationHandler(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                organizationIntegrationEventsQueueService.Object,
                organizationExistsHelperService.Object,
                new Mock<IUniqueOrganizationBusinessRegisterIdentifierService>().Object,
                organizationIntegrationEventsHelperService.Object);

            var orgId = new Guid("1572cb86-3c1d-4899-8d7a-983d8de0796b");

            var marketRole = new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>());

            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var validAddressDto = new AddressDto(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var actor = new Actor(
                Guid.NewGuid(),
                new ExternalActorId(Guid.NewGuid()),
                new MockedGln(),
                ActorStatus.Active,
                new[] { marketRole },
                new ActorName(string.Empty));

            var organization = new Organization(
                new OrganizationId(orgId),
                "fake_value",
                new[] { actor },
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(organization);

            organizationRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<Organization>()))
                .ReturnsAsync(new OrganizationId(orgId));

            var changeDto = new ChangeOrganizationDto("New name", validBusinessRegisterIdentifier.Identifier, validAddressDto, "Test Comment 2", "Active");

            var command = new UpdateOrganizationCommand(orgId, changeDto);

            // Act
            var response = await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(Unit.Value, response);
        }

        [Fact]
        public async Task Handle_UpdateOrganizationDeleted_ThrowsException()
        {
            // Arrange
            var organizationRepository = new Mock<IOrganizationRepository>();
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var organizationIntegrationEventsQueueService = new Mock<IOrganizationIntegrationEventsQueueService>();
            var organizationIntegrationEventsHelperService = new Mock<IOrganizationIntegrationEventsHelperService>();

            var target = new UpdateOrganizationHandler(
                organizationRepository.Object,
                UnitOfWorkProviderMock.Create(),
                organizationIntegrationEventsQueueService.Object,
                organizationExistsHelperService.Object,
                new Mock<IUniqueOrganizationBusinessRegisterIdentifierService>().Object,
                organizationIntegrationEventsHelperService.Object);

            var orgId = new Guid("1572cb86-3c1d-4899-8d7a-983d8de0796b");

            var marketRole = new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>());

            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var validAddressDto = new AddressDto(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var actor = new Actor(
                Guid.NewGuid(),
                new ExternalActorId(Guid.NewGuid()),
                new MockedGln(),
                ActorStatus.Active,
                new[] { marketRole },
                new ActorName(string.Empty));

            var dbOrganization = new Organization(
                new OrganizationId(orgId),
                "fake_value",
                new[] { actor },
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Deleted);

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(dbOrganization);

            organizationRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<Organization>()))
                .ReturnsAsync(new OrganizationId(orgId));

            var changeOrganizationDto = new ChangeOrganizationDto("New name", validBusinessRegisterIdentifier.Identifier, validAddressDto, "Test Comment 2", "Active");

            var command = new UpdateOrganizationCommand(orgId, changeOrganizationDto);

            // Act + Assert
            await Assert
                .ThrowsAsync<ValidationException>(() => target.Handle(command, CancellationToken.None))
                .ConfigureAwait(false);
        }
    }
}
