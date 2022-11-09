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
    public sealed class GridAreaLinkRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public GridAreaLinkRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task AddOrUpdateAsync_GridNotExists_ReturnsNull()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var linkRepository = new GridAreaLinkRepository(context);

            // Act
            var testOrg = await linkRepository
                .GetAsync(new GridAreaLinkId(Guid.NewGuid()));

            // Assert
            Assert.Null(testOrg);
        }

        [Fact]
        public async Task AddOrUpdateAsync_GridAreaLink_CanReadBack()
        {
            // Arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var linkRepository = new GridAreaLinkRepository(context);
            var gridRepository = new GridAreaRepository(context);
            var testGrid = new GridArea(
                new GridAreaName("Test Grid Area"),
                new GridAreaCode("801"),
                PriceAreaCode.Dk1);

            // Act
            var gridId = await gridRepository.AddOrUpdateAsync(testGrid);
            var testLink = new GridAreaLink(gridId);
            var gridLinkId = await linkRepository.AddOrUpdateAsync(testLink);
            var gridLink = await linkRepository.GetAsync(gridLinkId);

            // Assert
            Assert.NotNull(gridLink);
            Assert.NotEqual(Guid.Empty, gridLink?.Id.Value);
            Assert.Equal(gridId.Value, gridLink?.GridAreaId.Value);
        }
    }
}
