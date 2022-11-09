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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Common;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class GridAreaOverviewRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public GridAreaOverviewRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAsync_ReturnsGridAreas()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();
            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).ToList();

            // assert
            Assert.NotEmpty(actual);
        }

        [Fact]
        public async Task GetAsync_GridAccessProviderAssigned_ReturnsWithActorNameAndNumber()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaId = await CreateGridArea(EicFunction.GridAccessProvider);

            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).Single(x => x.Id == gridAreaId);

            // assert
            Assert.NotNull(actual.ActorName);
            Assert.NotNull(actual.ActorNumber);
        }

        [Fact]
        public async Task GetAsync_OtherMarketRoleAssigned_DoesNotReturnWithActorNameAndNumber()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaId = await CreateGridArea(EicFunction.BalanceResponsibleParty);

            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).Single(x => x.Id == gridAreaId);

            // assert
            Assert.Null(actual.ActorName);
            Assert.Null(actual.ActorNumber);
        }

        [Fact]
        public async Task GetAsync_NoMarketRoleAssigned_DoesNotReturnWithActorNameAndNumber()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaId = await CreateGridArea();

            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).Single(x => x.Id == gridAreaId);

            // assert
            Assert.Null(actual.ActorName);
            Assert.Null(actual.ActorNumber);
        }

        [Fact]
        public async Task GetAsync_MultipleMarketRolesAssignedToGridAreaAndGridAccessProviderIsOneOfThem_ReturnsOnlyGridAccessProvider()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaId = await CreateGridArea(EicFunction.GridAccessProvider, EicFunction.Agent);

            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).Single(x => x.Id == gridAreaId);

            // assert
            Assert.NotNull(actual.ActorName);
            Assert.NotNull(actual.ActorNumber);
        }

        [Fact]
        public async Task GetAsync_MultipleMarketRolesAssignedToGridAreaAndGridAccessProviderIsNotAmongThem_ReturnsWithoutActorInfo()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaId = await CreateGridArea(EicFunction.BalanceResponsibleParty, EicFunction.Agent);

            var target = new GridAreaOverviewRepository(context);

            // act
            var actual = (await target
                .GetAsync()).Single(x => x.Id == gridAreaId);

            // assert
            Assert.Null(actual.ActorName);
            Assert.Null(actual.ActorNumber);
        }

        private async Task<GridAreaId> CreateGridArea(params EicFunction[] marketRoles)
        {
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var organizationId = Guid.NewGuid();
            var actorId = Guid.NewGuid();
            var marketRoleId = Guid.NewGuid();
            var marketRoleGridAreaId = Guid.NewGuid();

            var gridAreaRepo = new GridAreaRepository(context);
            var gridAreaId = await gridAreaRepo.AddOrUpdateAsync(new GridArea(new GridAreaName("name"), new GridAreaCode("1234"), PriceAreaCode.Dk1));

            if (marketRoles.Length > 0)
            {
                var orgRepo = new OrganizationRepository(context);
                var org = new Organization("name", MockedBusinessRegisterIdentifier.New(), new Address(null, null, null, null, "DK"));
                var actor = new Actor(new MockedGln());

                foreach (var marketRole in marketRoles)
                {
                    actor.MarketRoles.Add(new ActorMarketRole(marketRoleId, marketRole, new[] { new ActorGridArea(gridAreaId.Value, new[] { MeteringPointType.D01VeProduction }) }));
                }

                org.Actors.Add(actor);

                await orgRepo.AddOrUpdateAsync(org);
            }

            return gridAreaId;
        }
    }
}
