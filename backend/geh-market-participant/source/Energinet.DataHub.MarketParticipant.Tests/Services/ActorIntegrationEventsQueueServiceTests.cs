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
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class ActorIntegrationEventsQueueServiceTests
    {
        [Fact]
        public async Task EnqueueActorUpdatedEventAsync_OrganizationIdNull_ThrowsException()
        {
            // Arrange
            var target = new ActorIntegrationEventsQueueService(
                new Mock<IDomainEventRepository>().Object,
                new Mock<IBusinessRoleCodeDomainService>().Object);

            var actor = new Actor(new MockedGln());

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.EnqueueActorUpdatedEventAsync(null!, actor))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task EnqueueActorUpdatedEventAsync_ActorNull_ThrowsException()
        {
            // Arrange
            var target = new ActorIntegrationEventsQueueService(
                new Mock<IDomainEventRepository>().Object,
                new Mock<IBusinessRoleCodeDomainService>().Object);

            var organizationId = new OrganizationId(Guid.NewGuid());

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.EnqueueActorUpdatedEventAsync(organizationId, null!))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task EnqueueActorUpdatedEventAsync_WithActor_CreatesEvent()
        {
            // Arrange
            var domainEventRepository = new Mock<IDomainEventRepository>();
            var target = new ActorIntegrationEventsQueueService(
                domainEventRepository.Object,
                new Mock<IBusinessRoleCodeDomainService>().Object);

            var organizationId = new OrganizationId(Guid.NewGuid());
            var actor = new Actor(new MockedGln());

            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.Agent, Enumerable.Empty<ActorGridArea>()));
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.Consumer, Enumerable.Empty<ActorGridArea>()));

            // Act
            await target.EnqueueActorUpdatedEventAsync(organizationId, actor).ConfigureAwait(false);

            // Assert
            domainEventRepository.Verify(
                x => x.InsertAsync(It.Is<DomainEvent>(y => y.DomainObjectId == actor.Id)),
                Times.Once);
        }

        [Fact]
        public async Task EnqueueActorUpdatedEventAsync_integrationEventsNull_ThrowsException()
        {
            // Arrange
            var target = new ActorIntegrationEventsQueueService(
                new Mock<IDomainEventRepository>().Object,
                new Mock<IBusinessRoleCodeDomainService>().Object);

            var organizationId = new OrganizationId(Guid.NewGuid());

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.EnqueueActorUpdatedEventAsync(
                    organizationId,
                    Guid.NewGuid(),
                    null!))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task EnqueueActorUpdatedEventAsync_WithIntegrationEvents_CreatesEvents()
        {
            // Arrange
            var domainEventRepository = new Mock<IDomainEventRepository>();
            var target = new ActorIntegrationEventsQueueService(
                domainEventRepository.Object,
                new Mock<IBusinessRoleCodeDomainService>().Object);

            var actor = new Actor(new MockedGln());
            var organizationId = new OrganizationId(Guid.NewGuid());

            var integrationEvents = new List<IIntegrationEvent>();
            integrationEvents.Add(new ActorStatusChangedIntegrationEvent());
            integrationEvents.Add(new ActorNameChangedIntegrationEvent());
            integrationEvents.Add(new MarketRoleAddedToActorIntegrationEvent());
            integrationEvents.Add(new MarketRoleRemovedFromActorIntegrationEvent());
            integrationEvents.Add(new GridAreaAddedToActorIntegrationEvent());
            integrationEvents.Add(new GridAreaRemovedFromActorIntegrationEvent());
            integrationEvents.Add(new MeteringPointTypeAddedToActorIntegrationEvent());
            integrationEvents.Add(new MeteringPointTypeRemovedFromActorIntegrationEvent());

            // Act
            await target.EnqueueActorUpdatedEventAsync(
                    organizationId,
                    actor.Id,
                    integrationEvents)
                .ConfigureAwait(false);

            // Assert
            domainEventRepository.Verify(
                x => x.InsertAsync(It.Is<DomainEvent>(y => y.DomainObjectId == actor.Id)),
                Times.Exactly(8));
        }
    }
}
