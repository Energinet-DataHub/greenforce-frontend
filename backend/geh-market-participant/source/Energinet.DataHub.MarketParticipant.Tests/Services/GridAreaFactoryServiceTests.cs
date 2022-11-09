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
using Energinet.DataHub.MarketParticipant.Tests.Handlers;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class GridAreaFactoryServiceTests
    {
        [Fact]
        public async Task CreateAsync_NullCode_ThrowsException()
        {
            // Arrange
            var gridAreaRepository = new Mock<IGridAreaRepository>();
            var gridAreaLinkRepository = new Mock<IGridAreaLinkRepository>();
            var target = new GridAreaFactoryService(
                gridAreaLinkRepository.Object,
                gridAreaRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IGridAreaIntegrationEventsQueueService>().Object);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.CreateAsync(
                null!,
                new GridAreaName("fake_value"),
                PriceAreaCode.Dk1))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateAsync_NullName_ThrowsException()
        {
            // Arrange
            var gridAreaRepository = new Mock<IGridAreaRepository>();
            var gridAreaLinkRepository = new Mock<IGridAreaLinkRepository>();
            var target = new GridAreaFactoryService(
                gridAreaLinkRepository.Object,
                gridAreaRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IGridAreaIntegrationEventsQueueService>().Object);

            // Act + Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => target.CreateAsync(
                    new GridAreaCode("123"),
                    null!,
                    PriceAreaCode.Dk1))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateAsync_NewGridArea_AddsAndReturnsGridAreaWithLink()
        {
            // Arrange
            var gridAreaRepository = new Mock<IGridAreaRepository>();
            var gridAreaLinkRepository = new Mock<IGridAreaLinkRepository>();
            var target = new GridAreaFactoryService(
                gridAreaLinkRepository.Object,
                gridAreaRepository.Object,
                UnitOfWorkProviderMock.Create(),
                new Mock<IGridAreaIntegrationEventsQueueService>().Object);
            var gridAreaId = new GridAreaId(Guid.NewGuid());
            var gridArea = new GridArea(
                gridAreaId,
                new GridAreaName("fake_value"),
                new GridAreaCode("123"),
                PriceAreaCode.Dk1);

            var gridAreaLinkId = new GridAreaLinkId(Guid.NewGuid());
            var gridAreaLink = new GridAreaLink(gridAreaLinkId, gridAreaId);

            gridAreaRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<GridArea>()))
                .ReturnsAsync(gridArea.Id);

            gridAreaRepository
                .Setup(x => x.GetAsync(gridArea.Id))
                .ReturnsAsync(gridArea);

            gridAreaLinkRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<GridAreaLink>()))
                .ReturnsAsync(gridAreaLink.Id);

            gridAreaLinkRepository
                .Setup(x => x.GetAsync(gridAreaLink.Id))
                .ReturnsAsync(gridAreaLink);

            // Act
            var response = await target
                .CreateAsync(
                    new GridAreaCode("123"),
                    new GridAreaName("fake_value"),
                    PriceAreaCode.Dk1)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(response);
            Assert.Equal("123", response.Code.Value);
            Assert.Equal("fake_value", response.Name.Value);
            Assert.Equal(PriceAreaCode.Dk1, response.PriceAreaCode);
            gridAreaLinkRepository.Verify(x => x.AddOrUpdateAsync(It.Is<GridAreaLink>(y => y.GridAreaId == gridAreaId)), Times.Once);
            gridAreaLinkRepository.Verify(x => x.GetAsync(It.IsAny<GridAreaLinkId>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_NewGridArea_DispatchesEvent()
        {
            // Arrange
            var gridAreaRepository = new Mock<IGridAreaRepository>();
            var gridAreaLinkRepository = new Mock<IGridAreaLinkRepository>();
            var gridAreaIntegrationEventsQueueService = new Mock<IGridAreaIntegrationEventsQueueService>();
            var target = new GridAreaFactoryService(
                gridAreaLinkRepository.Object,
                gridAreaRepository.Object,
                UnitOfWorkProviderMock.Create(),
                gridAreaIntegrationEventsQueueService.Object);
            var gridAreaId = new GridAreaId(Guid.NewGuid());
            var gridArea = new GridArea(
                gridAreaId,
                new GridAreaName("fake_value"),
                new GridAreaCode("123"),
                PriceAreaCode.Dk1);

            var gridAreaLinkId = new GridAreaLinkId(Guid.NewGuid());
            var gridAreaLink = new GridAreaLink(gridAreaLinkId, gridAreaId);

            gridAreaRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<GridArea>()))
                .ReturnsAsync(gridArea.Id);

            gridAreaRepository
                .Setup(x => x.GetAsync(gridArea.Id))
                .ReturnsAsync(gridArea);

            gridAreaLinkRepository
                .Setup(x => x.AddOrUpdateAsync(It.IsAny<GridAreaLink>()))
                .ReturnsAsync(gridAreaLink.Id);

            gridAreaLinkRepository
                .Setup(x => x.GetAsync(gridAreaLink.Id))
                .ReturnsAsync(gridAreaLink);

            // Act
            await target
                .CreateAsync(
                    new GridAreaCode("123"),
                    new GridAreaName("fake_value"),
                    PriceAreaCode.Dk1)
                .ConfigureAwait(false);

            // Assert
            gridAreaIntegrationEventsQueueService.Verify(
                x => x.EnqueueGridAreaCreatedEventAsync(
                    It.Is<GridArea>(y => y.Id == gridAreaId),
                    It.Is<GridAreaLink>(y => y.Id == gridAreaLinkId && y.GridAreaId == gridAreaId)),
                Times.Once);
        }
    }
}
