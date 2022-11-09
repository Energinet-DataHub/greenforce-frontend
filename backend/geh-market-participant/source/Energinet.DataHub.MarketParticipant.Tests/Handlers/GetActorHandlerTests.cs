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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Handlers.Actor;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class GetActorHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new GetActorHandler(new Mock<IOrganizationExistsHelperService>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_NoActor_ThrowsNotFoundException()
        {
            // Arrange
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var target = new GetActorHandler(organizationExistsHelperService.Object);

            var organizationId = Guid.NewGuid();
            const string orgName = "SomeName";
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var organization = new Organization(
                new OrganizationId(organizationId),
                orgName,
                Enumerable.Empty<Actor>(),
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(organizationId))
                .ReturnsAsync(organization);

            var command = new GetSingleActorCommand(Guid.NewGuid(), organizationId);

            // Act + Assert
            await Assert
                .ThrowsAsync<NotFoundValidationException>(() => target.Handle(command, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_HasActor_ReturnsActor()
        {
            // Arrange
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var target = new GetActorHandler(organizationExistsHelperService.Object);

            var orgId = Guid.NewGuid();
            const string orgName = "SomeName";
            var actorId = Guid.NewGuid();
            string actorGln = new MockedGln();
            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var actor = new Actor(
                actorId,
                new ExternalActorId(actorId),
                ActorNumber.Create(actorGln),
                ActorStatus.Active,
                Enumerable.Empty<ActorMarketRole>(),
                new ActorName(string.Empty));

            var organization = new Organization(
                new OrganizationId(orgId),
                orgName,
                new[] { actor },
                validBusinessRegisterIdentifier,
                validAddress,
                "Test Comment",
                OrganizationStatus.Active);

            organizationExistsHelperService
                .Setup(x => x.EnsureOrganizationExistsAsync(orgId))
                .ReturnsAsync(organization);

            var command = new GetSingleActorCommand(actorId, orgId);

            // Act
            var response = await target.Handle(command, CancellationToken.None).ConfigureAwait(false);

            // Assert
            Assert.NotNull(response.Actor);
            Assert.Equal(actorId.ToString(), response.Actor.ActorId);
        }
    }
}
