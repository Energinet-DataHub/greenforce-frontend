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
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;
using Energinet.DataHub.MarketParticipant.Application.Handlers.Organization;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class GetSingleOrganizationHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new GetSingleOrganizationHandler(new Mock<IOrganizationExistsHelperService>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_HasOrganization_ReturnsOrganization()
        {
            // Arrange
            var organizationExistsHelperService = new Mock<IOrganizationExistsHelperService>();
            var target = new GetSingleOrganizationHandler(organizationExistsHelperService.Object);

            var orgId = new Guid("1572cb86-3c1d-4899-8d7a-983d8de0796b");

            var marketRole = new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>());

            var actor = new Actor(
                Guid.NewGuid(),
                new ExternalActorId(Guid.NewGuid()),
                new MockedGln(),
                ActorStatus.Active,
                new[] { marketRole },
                new ActorName(string.Empty));

            var validBusinessRegisterIdentifier = new BusinessRegisterIdentifier("123");
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

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

            var command = new GetSingleOrganizationCommand(orgId);

            // Act
            var response = await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(response.Organization);

            var actualOrganization = response.Organization;
            Assert.Equal(organization.Id.ToString(), actualOrganization.OrganizationId);

            var actualActor = actualOrganization.Actors.Single();
            Assert.Equal(actor.Id.ToString(), actualActor.ActorId);
            Assert.Equal(actor.ExternalActorId?.ToString(), actualActor.ExternalActorId);
            Assert.Equal(actor.ActorNumber.Value, actualActor.ActorNumber.Value);
            Assert.Equal(actor.Status.ToString(), actualActor.Status);

            var actualMarketRole = actualActor.MarketRoles.Single();
            Assert.Equal(marketRole.Function.ToString(), actualMarketRole.EicFunction);
        }
    }
}
