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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Common;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class DomainEventRepositoryTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public DomainEventRepositoryTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task InsertAsync_RequiredDataSpecified_InsertsEvent()
        {
            // arrange
            var target = new DomainEventRepositoryDecorator(_fixture);

            // act
            var id = await target
                .InsertAsync(new DomainEvent(Guid.NewGuid(), nameof(Organization), CreateIntegrationEvent()))
                ;

            // assert
            var actual = await FindAsync(target, id);
            Assert.NotNull(actual);
        }

        [Fact]
        public async Task UpdateAsync_EventMarkedAsSent_IsNoLongerReturned()
        {
            // arrange
            var target = new DomainEventRepositoryDecorator(_fixture);
            var newDomainEvent = new DomainEvent(Guid.NewGuid(), nameof(Organization), CreateIntegrationEvent());
            var id = await target.InsertAsync(newDomainEvent);

            // act
            var domainEvent = await FindAsync(target, id);
            domainEvent!.MarkAsSent();
            await target.UpdateAsync(domainEvent);
            var actual = await FindAsync(target, id);

            // assert
            Assert.Null(actual);
        }

        [Fact]
        public async Task GetAsync_UnsentExists_ReturnsUnsent()
        {
            // arrange
            var target = new DomainEventRepositoryDecorator(_fixture);
            var domainEvent = new DomainEvent(Guid.NewGuid(), nameof(Organization), CreateIntegrationEvent());
            var id = await target.InsertAsync(domainEvent);

            // act
            var actual = await FindAsync(target, id);

            // assert
            Assert.NotNull(actual);
        }

        private static async Task<DomainEvent?> FindAsync(DomainEventRepositoryDecorator reopository, DomainEventId id)
        {
            DomainEvent? actual = null;

            foreach (var e in await reopository.GetOldestUnsentDomainEventsAsync(100))
            {
                if (e.Id == id)
                    actual = e;
            }

            return actual;
        }

        private static ActorUpdatedIntegrationEvent CreateIntegrationEvent()
        {
            var actorUpdatedIntegrationEvent = new ActorUpdatedIntegrationEvent
            {
                OrganizationId = new OrganizationId(Guid.NewGuid()),
                ActorId = Guid.NewGuid(),
                ActorNumber = new MockedGln()
            };

            actorUpdatedIntegrationEvent.ActorMarketRoles.Add(
                new ActorMarketRoleEventData(
                    EicFunction.BalanceResponsibleParty,
                    new List<ActorGridAreaEventData>
                    {
                        new ActorGridAreaEventData(Guid.NewGuid(), new List<string> { "mp1", "mp2" })
                    }));

            return actorUpdatedIntegrationEvent;
        }

        private sealed class DomainEventRepositoryDecorator : IDomainEventRepository
        {
            private readonly MarketParticipantDatabaseFixture _fixture;

            public DomainEventRepositoryDecorator(MarketParticipantDatabaseFixture fixture)
            {
                _fixture = fixture;
            }

            public async Task<IEnumerable<DomainEvent>> GetOldestUnsentDomainEventsAsync(int numberOfEvents)
            {
                await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
                await using var scope = host.BeginScope();
                await using var context = _fixture.DatabaseManager.CreateDbContext();

                var repository = new DomainEventRepository(context);

                return await repository.GetOldestUnsentDomainEventsAsync(numberOfEvents);
            }

            public async Task<DomainEventId> InsertAsync(DomainEvent domainEvent)
            {
                await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
                await using var scope = host.BeginScope();
                await using var context = _fixture.DatabaseManager.CreateDbContext();

                var repository = new DomainEventRepository(context);

                return await repository.InsertAsync(domainEvent);
            }

            public async Task UpdateAsync(DomainEvent domainEvent)
            {
                await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
                await using var scope = host.BeginScope();
                await using var context = _fixture.DatabaseManager.CreateDbContext();

                var repository = new DomainEventRepository(context);
                await repository.UpdateAsync(domainEvent);
            }
        }
    }
}
