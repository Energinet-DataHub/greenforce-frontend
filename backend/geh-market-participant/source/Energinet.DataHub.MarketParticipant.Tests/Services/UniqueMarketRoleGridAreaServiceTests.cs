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
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    public sealed class UniqueMarketRoleGridAreaServiceTests
    {
        [Fact]
        public async Task Ensure_ActorSupplied_CallsRemoveForActor()
        {
            // arrange
            var repository = new Mock<IUniqueActorMarketRoleGridAreaRepository>();

            var target = new UniqueMarketRoleGridAreaService(repository.Object);

            var actor = new Actor(
                Guid.NewGuid(),
                null,
                new MockedGln(),
                ActorStatus.Active,
                new[]
                {
                    new ActorMarketRole(
                        Guid.NewGuid(),
                        EicFunction.GridAccessProvider,
                        Enumerable.Empty<ActorGridArea>())
                },
                new ActorName("fake_value"));

            // act
            await target.EnsureUniqueMarketRolesPerGridAreaAsync(actor).ConfigureAwait(false);

            // assert
            repository.Verify(x => x.RemoveAsync(actor.Id), Times.Exactly(1));
        }

        [Fact]
        public async Task Ensure_ActorSupplied_CallsTryAddForAllMarketRoleGridAreas()
        {
            // arrange
            var repository = new Mock<IUniqueActorMarketRoleGridAreaRepository>();
            repository.Setup(x => x.TryAddAsync(It.IsAny<UniqueActorMarketRoleGridArea>())).ReturnsAsync(true);

            var target = new UniqueMarketRoleGridAreaService(repository.Object);

            var actor = new Actor(
                Guid.NewGuid(),
                null,
                new MockedGln(),
                ActorStatus.Active,
                new[]
                {
                    new ActorMarketRole(
                        Guid.NewGuid(),
                        EicFunction.GridAccessProvider,
                        new[]
                        {
                            new ActorGridArea(
                                Guid.NewGuid(),
                                new[] { MeteringPointType.D02Analysis }),
                            new ActorGridArea(
                                Guid.NewGuid(),
                                new[] { MeteringPointType.D02Analysis }),
                            new ActorGridArea(
                                Guid.NewGuid(),
                                new[] { MeteringPointType.D02Analysis }),
                        })
                },
                new ActorName("fake_value"));

            // act
            await target.EnsureUniqueMarketRolesPerGridAreaAsync(actor).ConfigureAwait(false);

            // assert
            foreach (var mr in actor.MarketRoles)
            {
                foreach (var ga in mr.GridAreas)
                {
                    repository.Verify(x => x.TryAddAsync(new UniqueActorMarketRoleGridArea(actor.Id, mr.Function, ga.Id)), Times.Exactly(1));
                }
            }
        }

        [Fact]
        public async Task Ensure_NonDdmMarketRole_DoesntEnsureUniqueness()
        {
            foreach (var nonDdmMarketRole in Enum.GetValues<EicFunction>().Except(
                new[]
                {
                    EicFunction.GridAccessProvider,
                    EicFunction.MeterAdministrator,
                    EicFunction.MeterOperator,
                    EicFunction.MeteredDataCollector,
                    EicFunction.PartyConnectedToTheGrid
                }))
            {
                // arrange
                var repository = new Mock<IUniqueActorMarketRoleGridAreaRepository>();

                var target = new UniqueMarketRoleGridAreaService(repository.Object);

                var actor = new Actor(
                    Guid.NewGuid(),
                    null,
                    new MockedGln(),
                    ActorStatus.Active,
                    new[]
                    {
                    new ActorMarketRole(
                        Guid.NewGuid(),
                        nonDdmMarketRole,
                        Enumerable.Empty<ActorGridArea>())
                    },
                    new ActorName("fake_value"));

                // act
                await target.EnsureUniqueMarketRolesPerGridAreaAsync(actor).ConfigureAwait(false);

                // assert
                repository.Verify(x => x.TryAddAsync(It.IsAny<UniqueActorMarketRoleGridArea>()), Times.Never);
            }
        }
    }
}
