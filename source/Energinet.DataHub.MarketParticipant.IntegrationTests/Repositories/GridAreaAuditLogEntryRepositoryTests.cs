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
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class GridAreaAuditLogEntryRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public GridAreaAuditLogEntryRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task Insert_CreatesNewLogEntry()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaRepo = new GridAreaRepository(context);
            var gridAreaId = await gridAreaRepo.AddOrUpdateAsync(new GridArea(new GridAreaName("name"), new GridAreaCode("1234"), PriceAreaCode.Dk1));

            var userId = Guid.NewGuid();

            var target = new GridAreaAuditLogEntryRepository(context);
            var entry = new GridAreaAuditLogEntry(DateTimeOffset.UtcNow, userId, GridAreaAuditLogEntryField.Name, "old_val", "new_val", gridAreaId.Value);

            // act
            await target.InsertAsync(entry);

            var actual = await (from l in context.GridAreaAuditLogEntries.AsQueryable()
                                where l.UserId == userId
                                select l).SingleAsync();

            // assert
            Assert.Equal(entry.Timestamp, actual.Timestamp);
            Assert.Equal(entry.UserId, actual.UserId);
            Assert.Equal(entry.Field, actual.Field);
            Assert.Equal(entry.OldValue, actual.OldValue);
            Assert.Equal(entry.NewValue, actual.NewValue);
            Assert.Equal(entry.GridAreaId, actual.GridAreaId);
        }

        [Fact]
        public async Task Get_GridAreaIdProvided_ReturnsLogEntriesForGridArea()
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();
            await using var context = _fixture.DatabaseManager.CreateDbContext();

            var gridAreaRepo = new GridAreaRepository(context);
            var gridAreaId = await gridAreaRepo.AddOrUpdateAsync(new GridArea(new GridAreaName("name"), new GridAreaCode("1234"), PriceAreaCode.Dk1));

            var userId = Guid.NewGuid();

            var target = new GridAreaAuditLogEntryRepository(context);
            var entry = new GridAreaAuditLogEntry(DateTimeOffset.UtcNow, userId, GridAreaAuditLogEntryField.Name, "old_val", "new_val", gridAreaId.Value);

            await target.InsertAsync(entry);

            // act
            var actual = (await target.GetAsync(gridAreaId)).ToList();

            // assert
            Assert.Single(actual);
            Assert.Equal(gridAreaId.Value, actual.Single().GridAreaId);
        }
    }
}
