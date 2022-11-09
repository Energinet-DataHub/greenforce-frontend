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
using Energinet.DataHub.MarketParticipant.Domain;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Common;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public class UnitOfWorkTests
    {
        private readonly MarketParticipantDatabaseFixture _fixture;

        public UnitOfWorkTests(MarketParticipantDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Theory]
        [InlineData(true, true)]
        [InlineData(false, false)]
        public async Task TestAsync(bool commitUnitOfWork, bool entityCreated)
        {
            // arrange
            await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
            await using var scope = host.BeginScope();

            var repository = scope.GetInstance<IOrganizationRepository>();
            var uowProvider = scope.GetInstance<IUnitOfWorkProvider>();

            var entity = CreateEntity();
            OrganizationId id = null!;

            // act
            await ExecuteInUnitOfWork(uowProvider, commitUnitOfWork, async () =>
            {
                id = await repository.AddOrUpdateAsync(entity);
            });

            // assert
            await using var newScope = host.BeginScope();
            var newRepository = newScope.GetInstance<IOrganizationRepository>();
            var actualEntityCreated = await newRepository.GetAsync(id) != null;
            Assert.Equal(entityCreated, actualEntityCreated);
        }

        private static async Task ExecuteInUnitOfWork(IUnitOfWorkProvider provider, bool commit, Func<Task> work)
        {
            await using var uow = await provider.NewUnitOfWorkAsync();
            await work();
            if (commit)
            {
                await uow.CommitAsync();
            }
        }

        private static Organization CreateEntity()
        {
            var validAddress = new Address(
                "test Street",
                "1",
                "1111",
                "Test City",
                "Test Country");

            var validBusinessRegisterIdentifier = MockedBusinessRegisterIdentifier.New();
            return new Organization("Test", validBusinessRegisterIdentifier, validAddress);
        }
    }
}
