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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Handlers.Actor;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class CreateActorHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new CreateActorHandler(
                new Mock<IOrganizationExistsHelperService>().Object,
                new Mock<IActorFactoryService>().Object,
                new Mock<ICombinationOfBusinessRolesRuleService>().Object,
                new Mock<IUniqueMarketRoleGridAreaService>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_NewActor_ActorIdReturned()
        {
            // Arrange
            const string orgName = "SomeName";
            string actorGln = new MockedGln();
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var actorFactory = new Mock<IActorFactoryService>();
            var combinationOfBusinessRolesRuleService = new Mock<ICombinationOfBusinessRolesRuleService>();
            var target = new CreateActorHandler(
                organizationExistsHelperService.Object,
                actorFactory.Object,
                combinationOfBusinessRolesRuleService.Object,
                new Mock<IUniqueMarketRoleGridAreaService>().Object);
            var orgId = Guid.NewGuid();
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var organization = new Organization(
                new OrganizationId(orgId),
                orgName,
                Enumerable.Empty<Actor>(),
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            var actor = new Actor(ActorNumber.Create(actorGln));

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(organization);

            actorFactory
                .Setup(x => x.CreateAsync(
                    organization,
                    It.Is<ActorNumber>(y => y.Value == actorGln),
                    It.Is<ActorName>(y => y.Value == string.Empty),
                    It.IsAny<IReadOnlyCollection<ActorMarketRole>>()))
                .ReturnsAsync(actor);

            var command = new CreateActorCommand(
                orgId,
                new CreateActorDto(new ActorNameDto(string.Empty), new ActorNumberDto(actorGln), Array.Empty<ActorMarketRoleDto>()));

            // Act
            var response = await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(actor.Id, response.ActorId);
        }

        [Fact]
        public async Task Handle_NewActorWithMarketRoles_ActorIdReturned()
        {
            // Arrange
            const string orgName = "SomeName";
            string actorGln = new MockedGln();
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var actorFactory = new Mock<IActorFactoryService>();
            var combinationOfBusinessRolesRuleService = new Mock<ICombinationOfBusinessRolesRuleService>();
            var target = new CreateActorHandler(
                organizationExistsHelperService.Object,
                actorFactory.Object,
                combinationOfBusinessRolesRuleService.Object,
                new Mock<IUniqueMarketRoleGridAreaService>().Object);
            var orgId = Guid.NewGuid();
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var organization = new Organization(
                new OrganizationId(orgId),
                orgName,
                Enumerable.Empty<Actor>(),
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            var actor = new Actor(ActorNumber.Create(actorGln));
            var marketRole = new ActorMarketRoleDto(EicFunction.BillingAgent.ToString(), Enumerable.Empty<ActorGridAreaDto>(), string.Empty);

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(organization);

            actorFactory
                .Setup(x => x.CreateAsync(
                    organization,
                    It.Is<ActorNumber>(y => y.Value == actorGln),
                    It.Is<ActorName>(y => y.Value == string.Empty),
                    It.IsAny<IReadOnlyCollection<ActorMarketRole>>()))
                .ReturnsAsync(actor);

            var command = new CreateActorCommand(
                orgId,
                new CreateActorDto(new ActorNameDto(string.Empty), new ActorNumberDto(actorGln), new[] { marketRole }));

            // Act
            var response = await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(actor.Id, response.ActorId);
        }

        [Fact]
        public async Task Handle_NewActorWithMarketRoles_CallsUniqueMarketRoleGridAreaService()
        {
            // Arrange
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var actorFactory = new Mock<IActorFactoryService>();
            var uniqueService = new Mock<IUniqueMarketRoleGridAreaService>();

            var target = new CreateActorHandler(
                organizationExistsHelperService.Object,
                actorFactory.Object,
                new Mock<ICombinationOfBusinessRolesRuleService>().Object,
                uniqueService.Object);

            var orgId = Guid.NewGuid();

            var organization = new Organization(
                new OrganizationId(orgId),
                "SomeName",
                Enumerable.Empty<Actor>(),
                new BusinessRegisterIdentifier("123"),
                new Address(null, null, null, null, "DK"),
                null,
                OrganizationStatus.Active);

            var actor = new Actor(ActorNumber.Create("9958000453672"));

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(organization);

            actorFactory
                .Setup(x => x.CreateAsync(
                    organization,
                    It.IsAny<ActorNumber>(),
                    It.IsAny<ActorName>(),
                    It.IsAny<IReadOnlyCollection<ActorMarketRole>>()))
                .ReturnsAsync(actor);

            var command = new CreateActorCommand(
                orgId,
                new CreateActorDto(new ActorNameDto(string.Empty), new ActorNumberDto("9958000453672"), Enumerable.Empty<ActorMarketRoleDto>()));

            // Act
            await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            uniqueService.Verify(x => x.EnsureUniqueMarketRolesPerGridAreaAsync(actor), Times.Once);
        }
    }
}
