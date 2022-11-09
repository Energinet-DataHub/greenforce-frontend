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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Helpers;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Helpers;

[UnitTest]
public class ChangesToActorHelperTests
{
    private readonly OrganizationId _organizationId = CreateOrganizationId();
    private readonly Actor _actor = CreateValidActorWithChildren();
    private readonly UpdateActorCommand _incomingActor = CreateValidIncomingActorWithChildren();
    private readonly Mock<IBusinessRoleCodeDomainService> _businessRoleCodeDomainServiceMock = new();
    private readonly Mock<IGridAreaLinkRepository> _gridAreaLinkRepositoryMock = new();

    [Fact]
    public async Task FindChangesMadeToActor_OrganizationIdNull_ThrowsException()
    {
        // Arrange
        var target = new ChangesToActorHelper(_businessRoleCodeDomainServiceMock.Object, _gridAreaLinkRepositoryMock.Object);

        // Act + Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => target.FindChangesMadeToActorAsync(null!, _actor, _incomingActor));
    }

    [Fact]
    public async Task FindChangesMadeToActor_ExistingActorNull_ThrowsException()
    {
        // Arrange
        var target = new ChangesToActorHelper(_businessRoleCodeDomainServiceMock.Object, _gridAreaLinkRepositoryMock.Object);

        // Act + Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => target.FindChangesMadeToActorAsync(_organizationId, null!, _incomingActor));
    }

    [Fact]
    public async Task FindChangesMadeToActor_IncomingNull_ThrowsException()
    {
        // Arrange
        var target = new ChangesToActorHelper(_businessRoleCodeDomainServiceMock.Object, _gridAreaLinkRepositoryMock.Object);

        // Act + Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => target.FindChangesMadeToActorAsync(_organizationId, _actor, null!));
    }

    [Fact]
    public async Task FindChangesMadeToActor_NewDataIncoming_ChangesAreFoundAndIntegrationEventsAreaReturned()
    {
        // Arrange
        _gridAreaLinkRepositoryMock
            .Setup(e => e.GetAsync(It.IsAny<GridAreaId>()))
            .ReturnsAsync(new GridAreaLink(new GridAreaLinkId(Guid.NewGuid()), It.IsAny<GridAreaId>()));

        var target = new ChangesToActorHelper(_businessRoleCodeDomainServiceMock.Object, _gridAreaLinkRepositoryMock.Object);

        // Act
        var result = await target.FindChangesMadeToActorAsync(_organizationId, _actor, _incomingActor).ConfigureAwait(false);
        var integrationEvents = result.ToList();

        // Assert
        var numberOfStatusChangedEvents = integrationEvents.Count(x => x is ActorStatusChangedIntegrationEvent);
        var numberOfNameChangedEvents = integrationEvents.Count(x => x is ActorNameChangedIntegrationEvent);
        var numberOfAddMeteringPointEvents = integrationEvents.Count(x => x is MeteringPointTypeAddedToActorIntegrationEvent);
        var numberOfRemoveMeteringPointEvents = integrationEvents.Count(x => x is MeteringPointTypeRemovedFromActorIntegrationEvent);
        var numberOfAddGridAreaEvents = integrationEvents.Count(x => x is GridAreaAddedToActorIntegrationEvent);
        var numberOfRemoveGridAreaEvents = integrationEvents.Count(x => x is GridAreaRemovedFromActorIntegrationEvent);
        var numberOfAddMarketRoleEvents = integrationEvents.Count(x => x is MarketRoleAddedToActorIntegrationEvent);
        var numberOfRemoveMarketRoleEvents = integrationEvents.Count(x => x is MarketRoleRemovedFromActorIntegrationEvent);

        Assert.Equal(1, numberOfStatusChangedEvents);
        Assert.Equal(1, numberOfNameChangedEvents);
        Assert.Equal(2, numberOfAddMeteringPointEvents);
        Assert.Equal(6, numberOfRemoveMeteringPointEvents);
        Assert.Equal(1, numberOfAddGridAreaEvents);
        Assert.Equal(2, numberOfRemoveGridAreaEvents);
        Assert.Equal(1, numberOfAddMarketRoleEvents);
        Assert.Equal(1, numberOfRemoveMarketRoleEvents);
        Assert.Equal(15, integrationEvents.Count);
    }

    private static OrganizationId CreateOrganizationId()
    {
        return new OrganizationId(Guid.NewGuid());
    }

    private static Actor CreateValidActorWithChildren()
    {
        return new Actor(
            Guid.Parse("83d845e5-567d-41bb-bfc5-e062e56fb23c"),
            new ExternalActorId(Guid.NewGuid()),
            ActorNumber.Create("8814729239298"),
            ActorStatus.Active,
            new List<ActorMarketRole>
            {
                new ActorMarketRole(
                    Guid.Parse("579010ed-b960-486f-857f-a7c020ffed4d"),
                    EicFunction.EnergySupplier,
                    new List<ActorGridArea>
                    {
                        new ActorGridArea(
                            Guid.Parse("02222dec-9ac7-4732-80e3-3e943501e93d"),
                            new List<MeteringPointType>
                            {
                                MeteringPointType.E17Consumption
                            })
                    }),
                new ActorMarketRole(
                    Guid.Parse("8bd18c6e-c971-4be8-93cf-e3d4345a2d14"),
                    EicFunction.Producer,
                    new List<ActorGridArea>
                    {
                        new ActorGridArea(
                            Guid.Parse("2aca6c52-3282-40e5-a071-c740c9d432b6"),
                            new List<MeteringPointType>
                            {
                                MeteringPointType.D02Analysis,
                                MeteringPointType.E17Consumption,
                                MeteringPointType.E18Production
                            }),
                        new ActorGridArea(
                            Guid.Parse("35d007b1-12d0-470f-8186-231b9e51f9e0"),
                            new List<MeteringPointType>
                            {
                                MeteringPointType.E20Exchange,
                                MeteringPointType.D01VeProduction
                            })
                    })
            },
            new ActorName("CurrentActorName"));
    }

    private static UpdateActorCommand CreateValidIncomingActorWithChildren()
    {
        return new UpdateActorCommand(
            Guid.NewGuid(),
            Guid.Parse("83d845e5-567d-41bb-bfc5-e062e56fb23c"),
            new ChangeActorDto(
                "Passive",
                new ActorNameDto("NewActorName"),
                new List<ActorMarketRoleDto>
                {
                    new ActorMarketRoleDto(
                        EicFunction.EnergySupplier.ToString(),
                        new List<ActorGridAreaDto>
                        {
                            new ActorGridAreaDto(
                                Guid.Parse("02222dec-9ac7-4732-80e3-3e943501e93d"),
                                new List<string>
                                {
                                    "Unknown"
                                })
                        },
                        string.Empty),
                    new ActorMarketRoleDto(
                        EicFunction.BillingAgent.ToString(),
                        new List<ActorGridAreaDto>
                        {
                            new ActorGridAreaDto(
                                Guid.NewGuid(),
                                new List<string>
                                {
                                    "D05NetProduction"
                                })
                        },
                        string.Empty)
                }));
    }
}
