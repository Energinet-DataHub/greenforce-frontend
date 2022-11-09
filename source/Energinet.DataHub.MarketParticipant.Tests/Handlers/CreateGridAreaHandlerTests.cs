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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Application.Handlers.GridArea;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Handlers
{
    [UnitTest]
    public sealed class CreateGridAreaHandlerTests
    {
        [Fact]
        public async Task Handle_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new CreateGridAreaHandler(new Mock<IGridAreaFactoryService>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.Handle(null!, CancellationToken.None))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task Handle_NewGridArea_GridAreaReturned()
        {
            // Arrange
            var gridAreaFactoryService = new Mock<IGridAreaFactoryService>();
            var gridId = Guid.NewGuid();
            var gridArea = new GridArea(
                new GridAreaId(gridId),
                new GridAreaName("fake_value"),
                new GridAreaCode("123"),
                PriceAreaCode.Dk1);

            gridAreaFactoryService
                .Setup(x => x.CreateAsync(
                    It.Is<GridAreaCode>(y => y.Value == "123"),
                    It.Is<GridAreaName>(y => y.Value == "fake_value"),
                    It.IsAny<PriceAreaCode>()))
                .ReturnsAsync(gridArea);

            var target = new CreateGridAreaHandler(gridAreaFactoryService.Object);
            var command = new CreateGridAreaCommand(new CreateGridAreaDto(
                "fake_value",
                "123",
                "Dk1"));

            // Act
            var response = await target
                .Handle(command, CancellationToken.None)
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(gridArea.Id.Value, response.GridAreaId.Value);
        }
    }
}
