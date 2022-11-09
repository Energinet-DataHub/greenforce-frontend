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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.BusinessRoles;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class BusinessRoleCodeDomainServiceTests
    {
        [Fact]
        public void GetBusinessRoleCodes_NullArgument_ThrowsException()
        {
            // Arrange
            var target = new BusinessRoleCodeDomainService(new IBusinessRole[]
            {
                new ElectricalSupplierRole(),
                new GridOperatorRole(),
                new BalanceResponsiblePartyRole()
            });

            // Act + Assert
            Assert.Throws<ArgumentNullException>(() => target.GetBusinessRoleCodes(null!));
        }

        [Fact]
        public void GetBusinessRoleCodes_ValidMarkedRoles_ReturnsBusinessRole()
        {
            // Arrange
            var target = new BusinessRoleCodeDomainService(new IBusinessRole[]
            {
                new ElectricalSupplierRole(),
                new GridOperatorRole(),
                new BalanceResponsiblePartyRole()
            });

            var markedRoles = new[]
            {
                EicFunction.BalanceResponsibleParty,
                EicFunction.EnergySupplier,
            };

            // Act
            var roleCodes = target.GetBusinessRoleCodes(markedRoles).ToList();

            // Assert
            Assert.Contains(roleCodes, x => x == BusinessRoleCode.Ddq);
            Assert.Contains(roleCodes, x => x == BusinessRoleCode.Ddk);
        }

        [Fact]
        public void GetBusinessRoleCodes_MultipleMarkedRoles_DoesNotReturnDuplicates()
        {
            // Arrange
            var target = new BusinessRoleCodeDomainService(new IBusinessRole[]
            {
                new ElectricalSupplierRole(),
                new GridOperatorRole(),
                new BalanceResponsiblePartyRole()
            });

            var markedRoles = new[]
            {
                EicFunction.EnergyTrader,
                EicFunction.EnergySupplier
            };

            // Act
            var roleCodes = target.GetBusinessRoleCodes(markedRoles).ToList();

            // Assert
            Assert.Single(roleCodes, x => x == BusinessRoleCode.Ddq);
        }
    }
}
