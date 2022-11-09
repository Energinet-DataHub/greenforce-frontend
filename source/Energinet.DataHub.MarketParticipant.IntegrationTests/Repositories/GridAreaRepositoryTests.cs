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
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class GridAreaRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public GridAreaRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAsync_GridNotExists_ReturnsNull()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var gridAreaRepository = new GridAreaRepository(context);

            // Act
            var testOrg = await gridAreaRepository
                .GetAsync(new GridAreaId(Guid.NewGuid()));

            // Assert
            Assert.Null(testOrg);
        }

        [Fact]
        public async Task AddOrUpdateAsync_OneGridArea_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var gridRepository = new GridAreaRepository(context);
            var testGrid = new GridArea(
                new GridAreaName("Test Grid Area"),
                new GridAreaCode("801"),
                PriceAreaCode.Dk1);

            // Act
            var gridId = await gridRepository.AddOrUpdateAsync(testGrid);
            var newGrid = await gridRepository.GetAsync(gridId);

            // Assert
            Assert.NotNull(newGrid);
            Assert.NotEqual(Guid.Empty, newGrid?.Id.Value);
            Assert.Equal(testGrid.Name.Value, newGrid?.Name.Value);
            Assert.Equal(testGrid.Code, newGrid?.Code);
            Assert.Equal(testGrid.PriceAreaCode, newGrid?.PriceAreaCode);
        }

        [Fact]
        public async Task AddOrUpdateAsync_GridAreaChanged_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var gridRepository = new GridAreaRepository(context);
            var testGrid = new GridArea(
                new GridAreaName("Test Grid Area"),
                new GridAreaCode("801"),
                PriceAreaCode.Dk1);

            // Act
            var gridId = await gridRepository.AddOrUpdateAsync(testGrid);
            var newGrid = new GridArea(
                gridId,
                new GridAreaName("NewName"),
                new GridAreaCode("234"),
                PriceAreaCode.Dk2);

            await gridRepository.AddOrUpdateAsync(newGrid);
            newGrid = await gridRepository.GetAsync(gridId);

            // Assert
            Assert.NotNull(newGrid);
            Assert.NotEqual(Guid.Empty, newGrid?.Id.Value);
            Assert.Equal(gridId.Value, newGrid?.Id.Value);
            Assert.Equal("234", newGrid?.Code.Value);
            Assert.Equal("NewName", newGrid?.Name.Value);
            Assert.Equal(PriceAreaCode.Dk2, newGrid?.PriceAreaCode);
        }

        [Fact]
        public async Task AddOrUpdateAsync_GridAreaChanged_NewContextCanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            await using var context2 = _fixture.DatabaseManager.CreateDbContext();
            var gridRepository = new GridAreaRepository(context);
            var gridRepository2 = new GridAreaRepository(context2);
            var testGrid = new GridArea(
                new GridAreaName("Test Grid Area"),
                new GridAreaCode("801"),
                PriceAreaCode.Dk1);

            // Act
            var gridId = await gridRepository.AddOrUpdateAsync(testGrid);
            var newGrid = new GridArea(
                gridId,
                new GridAreaName("NewName"),
                new GridAreaCode("234"),
                PriceAreaCode.Dk2);
            await gridRepository.AddOrUpdateAsync(newGrid);
            newGrid = await gridRepository2.GetAsync(gridId);

            // Assert
            Assert.NotNull(newGrid);
            Assert.NotEqual(Guid.Empty, newGrid?.Id.Value);
            Assert.Equal(gridId.Value, newGrid?.Id.Value);
            Assert.Equal("234", newGrid?.Code.Value);
            Assert.Equal("NewName", newGrid?.Name.Value);
            Assert.Equal(PriceAreaCode.Dk2, newGrid?.PriceAreaCode);
        }

        [Fact]
        public async Task GetGridAreasAsync_ReturnsGridAreas()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var repository = new GridAreaRepository(context);
            var gridArea = new GridArea(
                new GridAreaName("Test Grid Area"),
                new GridAreaCode("801"),
                PriceAreaCode.Dk1);

            await repository.AddOrUpdateAsync(gridArea);

            // Act
            var actual = await repository.GetAsync();

            // Assert
            Assert.NotEmpty(actual);
        }
    }
}
