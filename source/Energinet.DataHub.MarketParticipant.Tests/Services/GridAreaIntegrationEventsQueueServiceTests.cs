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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class GridAreaIntegrationEventsQueueServiceTests
    {
        [Fact]
        public async Task EnqueueGridAreaUpdatedEventAsync_CreatesEvent()
        {
            // Arrange
            var domainEventRepository = new Mock<IDomainEventRepository>();
            var target = new GridAreaIntegrationEventsQueueService(domainEventRepository.Object);
            var gridAreaId = new GridAreaId(Guid.NewGuid());
            var gridArea = new GridArea(
                gridAreaId,
                new GridAreaName("fake_value"),
                new GridAreaCode("123"),
                PriceAreaCode.Dk1);
            var gridAreaLink = new GridAreaLink(gridAreaId);

            // Act
            await target.EnqueueGridAreaCreatedEventAsync(gridArea, gridAreaLink).ConfigureAwait(false);

            // Assert
            domainEventRepository.Verify(
                x => x.InsertAsync(It.Is<DomainEvent>(y => y.DomainObjectId == gridArea.Id.Value)),
                Times.Once);
        }

        [Fact]
        public async Task EnqueueGridAreaUpdatedEventAsync_GridAreaNull_ThrowsException()
        {
            // Arrange
            var domainEventRepository = new Mock<IDomainEventRepository>();
            var target = new GridAreaIntegrationEventsQueueService(domainEventRepository.Object);
            var gridAreaId = new GridAreaId(Guid.NewGuid());
            var gridAreaLink = new GridAreaLink(gridAreaId);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.EnqueueGridAreaCreatedEventAsync(null!, gridAreaLink))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task EnqueueGridAreaUpdatedEventAsync_GridAreaLinkNull_ThrowsException()
        {
            // Arrange
            var domainEventRepository = new Mock<IDomainEventRepository>();
            var target = new GridAreaIntegrationEventsQueueService(domainEventRepository.Object);
            var gridAreaId = new GridAreaId(Guid.NewGuid());
            var gridArea = new GridArea(
                gridAreaId,
                new GridAreaName("fake_value"),
                new GridAreaCode("123"),
                PriceAreaCode.Dk1);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.EnqueueGridAreaCreatedEventAsync(gridArea, null!))
                .ConfigureAwait(false);
        }
    }
}
