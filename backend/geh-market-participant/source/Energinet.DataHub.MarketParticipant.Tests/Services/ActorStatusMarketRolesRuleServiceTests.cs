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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services;

[UnitTest]
public sealed class ActorStatusMarketRolesRuleServiceTests
{
    [Fact]
    public async Task Validate_OrganizationIsNotFound_Throws()
    {
        var repository = new Mock<IOrganizationRepository>();

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        var updatedActor = CreateActor(ActorStatus.Active, EicFunction.Agent, MeteringPointType.D01VeProduction);

        // act + assert
        var exc = await Assert.ThrowsAsync<NotFoundValidationException>(() =>
            target.ValidateAsync(new OrganizationId(Guid.NewGuid().ToString()), updatedActor));

        Assert.Equal("Organization not found", exc.Message);
    }

    [Fact]
    public async Task Validate_ActorIsNotFound_Throws()
    {
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        var updatedActor = CreateActor(ActorStatus.Active, EicFunction.Agent, MeteringPointType.D01VeProduction);

        // act + assert
        var exc = await Assert.ThrowsAsync<NotFoundValidationException>(() =>
            target.ValidateAsync(organization.Id, updatedActor));

        Assert.Equal("Actor not found", exc.Message);
    }

    [Theory]
    [InlineData(ActorStatus.New)]
    [InlineData(ActorStatus.Active)]
    [InlineData(ActorStatus.Inactive)]
    [InlineData(ActorStatus.Passive)]
    public async Task Validate_UpdatedActorHasIdenticalMarketRoles_DoesNotThrow(ActorStatus status)
    {
        // arrange
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var existingActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        organization.Actors.Add(existingActor);

        var updatedActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        // act + assert
        await target.ValidateAsync(organization.Id, updatedActor);
    }

    [Theory]
    [InlineData(ActorStatus.New)]
    [InlineData(ActorStatus.Active)]
    [InlineData(ActorStatus.Inactive)]
    [InlineData(ActorStatus.Passive)]
    public async Task Validate_UpdatedActorHasNewMarketRoleAdded_DoesNotThrow(ActorStatus status)
    {
        // arrange
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var existingActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        organization.Actors.Add(existingActor);

        var updatedActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        updatedActor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, new[] { new ActorGridArea(new[] { MeteringPointType.D03NotUsed }) }));

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        // act + assert
        await target.ValidateAsync(organization.Id, updatedActor);
    }

    [Theory]
    [InlineData(ActorStatus.New, false)]
    [InlineData(ActorStatus.Active, true)]
    [InlineData(ActorStatus.Inactive, true)]
    [InlineData(ActorStatus.Passive, true)]
    public async Task Validate_GridAreaForMarketRoleIsRemoved_ThrowsIfStatusIsNotNew(ActorStatus status, bool throws)
    {
        // arrange
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var existingActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        organization.Actors.Add(existingActor);

        var updatedActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        updatedActor.MarketRoles.Single().GridAreas.Clear();

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        // act + assert
        if (throws)
            await Assert.ThrowsAsync<ValidationException>(() => target.ValidateAsync(organization.Id, updatedActor));
    }

    [Theory]
    [InlineData(ActorStatus.New, false)]
    [InlineData(ActorStatus.Active, true)]
    [InlineData(ActorStatus.Inactive, true)]
    [InlineData(ActorStatus.Passive, true)]
    public async Task Validate_UpdatedActorHasUpdatedMeteringPointForMarketRoleGridArea_Throws(ActorStatus status, bool throws)
    {
        // arrange
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var existingActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        organization.Actors.Add(existingActor);

        var updatedActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        updatedActor.MarketRoles.Single().GridAreas.Single().MeteringPointTypes.Add(MeteringPointType.D02Analysis);

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        // act + assert
        if (throws)
            await Assert.ThrowsAsync<ValidationException>(() => target.ValidateAsync(organization.Id, updatedActor));
    }

    [Theory]
    [InlineData(ActorStatus.New, false)]
    [InlineData(ActorStatus.Active, true)]
    [InlineData(ActorStatus.Inactive, true)]
    [InlineData(ActorStatus.Passive, true)]
    public async Task Validate_UpdatedActorWithNoMarketRoles_Throws(ActorStatus status, bool throws)
    {
        // arrange
        var organization = new Organization("org", new BusinessRegisterIdentifier("12345678"), new Address(null, null, null, null, "DK"));

        var existingActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        organization.Actors.Add(existingActor);

        var updatedActor = CreateActor(status, EicFunction.Agent, MeteringPointType.D01VeProduction);
        updatedActor.MarketRoles.Clear();

        var repository = new Mock<IOrganizationRepository>();
        repository.Setup(x => x.GetAsync(organization.Id)).ReturnsAsync(organization);

        var target = new ActorStatusMarketRolesRuleService(repository.Object);

        // act + assert
        if (throws)
            await Assert.ThrowsAsync<ValidationException>(() => target.ValidateAsync(organization.Id, updatedActor));
    }

    private static Actor CreateActor(ActorStatus status, EicFunction eicFunction, MeteringPointType meteringPointType)
    {
        return new Actor(
            Guid.Parse("9B6CF046-94AC-4210-8D8E-138032F17AAB"),
            null,
            new MockedGln(),
            status,
            new[]
            {
                new ActorMarketRole(
                    Guid.NewGuid(),
                    eicFunction,
                    new[]
                    {
                        new ActorGridArea(new[]
                        {
                            meteringPointType
                        })
                    })
            },
            new ActorName("actor name"));
    }
}
