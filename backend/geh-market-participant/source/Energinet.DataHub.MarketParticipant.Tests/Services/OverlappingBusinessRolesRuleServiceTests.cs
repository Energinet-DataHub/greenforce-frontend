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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class OverlappingBusinessRolesRuleServiceTests
    {
        [Fact]
        public void ValidateRolesAcrossActors_NullActorsArgument_ThrowsException()
        {
            // Arrange
            var target = new OverlappingBusinessRolesRuleService(new Mock<IBusinessRoleCodeDomainService>().Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => target.ValidateRolesAcrossActors(null!));
        }

        [Fact]
        public void ValidateRolesAcrossActors_RolesAreNotUnique_ThrowsException()
        {
            // Arrange
            var businessRoleCodeDomainService = new Mock<IBusinessRoleCodeDomainService>();
            var target = new OverlappingBusinessRolesRuleService(businessRoleCodeDomainService.Object);

            businessRoleCodeDomainService.Setup(x => x.GetBusinessRoleCodes(It.IsAny<IEnumerable<EicFunction>>()))
                .Returns(new[] { BusinessRoleCode.Ddk });

            var actor = new Actor(new MockedGln());
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            // Act + Assert
            Assert.Throws<ValidationException>(() => target.ValidateRolesAcrossActors(
                new[]
                {
                    actor
                }));
        }

        [Fact]
        public void ValidateRolesAcrossActors_BusinessRolesOverlap_ThrowsException()
        {
            // Arrange
            var businessRoleCodeDomainService = new Mock<IBusinessRoleCodeDomainService>();
            var target = new OverlappingBusinessRolesRuleService(businessRoleCodeDomainService.Object);

            businessRoleCodeDomainService
                .Setup(x => x.GetBusinessRoleCodes(
                    It.Is<IEnumerable<EicFunction>>(y => y.Single() == EicFunction.BalanceResponsibleParty)))
                .Returns(new[] { BusinessRoleCode.Ddk });

            var gln = new MockedGln();

            var actor = new Actor(ActorNumber.Create(gln));
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            var newActorWithSameGln = new Actor(ActorNumber.Create(gln));
            newActorWithSameGln.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            // Act + Assert
            Assert.Throws<ValidationException>(() => target.ValidateRolesAcrossActors(
                new[]
                {
                    actor,
                    newActorWithSameGln
                }));
        }

        [Fact]
        public void ValidateRolesAcrossActors_MarketRolesOverlap_ThrowsException()
        {
            // Arrange
            var businessRoleCodeDomainService = new Mock<IBusinessRoleCodeDomainService>();
            var target = new OverlappingBusinessRolesRuleService(businessRoleCodeDomainService.Object);

            businessRoleCodeDomainService
                .Setup(x => x.GetBusinessRoleCodes(
                    It.Is<IEnumerable<EicFunction>>(y => y.Single() == EicFunction.BalanceResponsibleParty)))
                .Returns(Enumerable.Empty<BusinessRoleCode>());

            var gln = new MockedGln();

            var actor = new Actor(ActorNumber.Create(gln));
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            var newActorWithSameGln = new Actor(ActorNumber.Create(gln));
            newActorWithSameGln.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            // Act + Assert
            Assert.Throws<ValidationException>(() => target.ValidateRolesAcrossActors(
                new[]
                {
                    actor,
                    newActorWithSameGln
                }));
        }

        [Fact]
        public void ValidateRolesAcrossActors_ValidRoles_DoesNothing()
        {
            // Arrange
            var businessRoleCodeDomainService = new Mock<IBusinessRoleCodeDomainService>();
            var target = new OverlappingBusinessRolesRuleService(businessRoleCodeDomainService.Object);

            businessRoleCodeDomainService
                .Setup(x => x.GetBusinessRoleCodes(
                    It.Is<IEnumerable<EicFunction>>(y => y.Single() == EicFunction.BalanceResponsibleParty)))
                .Returns(new[] { BusinessRoleCode.Ddk });

            businessRoleCodeDomainService
                .Setup(x => x.GetBusinessRoleCodes(
                    It.Is<IEnumerable<EicFunction>>(y => y.Single() == EicFunction.EnergySupplier)))
                .Returns(new[] { BusinessRoleCode.Ddq });

            var gln = new MockedGln();

            var actor = new Actor(ActorNumber.Create(gln));
            actor.MarketRoles.Add(new ActorMarketRole(EicFunction.BalanceResponsibleParty, Enumerable.Empty<ActorGridArea>()));

            var newActorWithSameGln = new Actor(ActorNumber.Create(gln));
            newActorWithSameGln.MarketRoles.Add(new ActorMarketRole(EicFunction.EnergySupplier, Enumerable.Empty<ActorGridArea>()));

            // Act + Assert
            target.ValidateRolesAcrossActors(
                new[]
                {
                    actor,
                    newActorWithSameGln
                });
        }
    }
}
