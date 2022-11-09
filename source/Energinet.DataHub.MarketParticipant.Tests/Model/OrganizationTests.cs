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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Model
{
    [UnitTest]
    public sealed class OrganizationTests
    {
        [Fact]
        public void Ctor_NewRole_HasStatusNew()
        {
            // Arrange + Act
            var organization = new Organization(
                "fake_value",
                new BusinessRegisterIdentifier("fake_value"),
                new Address(
                "fake_value",
                "fake_value",
                "fake_value",
                "fake_value",
                "fake_value"));

            // Assert
            Assert.Equal(OrganizationStatus.New, organization.Status);
        }

        [Theory]
        [InlineData(OrganizationStatus.New, true)]
        [InlineData(OrganizationStatus.Active, false)]
        [InlineData(OrganizationStatus.Blocked, false)]
        [InlineData(OrganizationStatus.Deleted, false)]
        public void FromStateToNew_ChangesState_IfAllowed(OrganizationStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestOrganization(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Status = OrganizationStatus.New;
                Assert.Equal(OrganizationStatus.New, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Status = OrganizationStatus.New);
            }
        }

        [Theory]
        [InlineData(OrganizationStatus.New, true)]
        [InlineData(OrganizationStatus.Active, true)]
        [InlineData(OrganizationStatus.Blocked, true)]
        [InlineData(OrganizationStatus.Deleted, false)]
        public void Activate_ChangesState_IfAllowed(OrganizationStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestOrganization(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Activate();
                Assert.Equal(OrganizationStatus.Active, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Activate());
            }
        }

        [Theory]
        [InlineData(OrganizationStatus.New, true)]
        [InlineData(OrganizationStatus.Active, true)]
        [InlineData(OrganizationStatus.Blocked, true)]
        [InlineData(OrganizationStatus.Deleted, false)]
        public void Blocked_ChangesState_IfAllowed(OrganizationStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestOrganization(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Blocked();
                Assert.Equal(OrganizationStatus.Blocked, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Blocked());
            }
        }

        [Theory]
        [InlineData(OrganizationStatus.New, true)]
        [InlineData(OrganizationStatus.Active, true)]
        [InlineData(OrganizationStatus.Blocked, true)]
        [InlineData(OrganizationStatus.Deleted, true)]
        public void Delete_ChangesState_IfAllowed(OrganizationStatus initialStatus, bool isAllowed)
        {
            // Arrange
            var target = CreateTestOrganization(initialStatus);

            // Act + Assert
            if (isAllowed)
            {
                target.Delete();
                Assert.Equal(OrganizationStatus.Deleted, target.Status);
            }
            else
            {
                Assert.Throws<ValidationException>(() => target.Delete());
            }
        }

        private static Organization CreateTestOrganization(OrganizationStatus status)
        {
            return new Organization(
                 new OrganizationId(Guid.Empty),
                 "fake_name",
                 Enumerable.Empty<Actor>(),
                 new BusinessRegisterIdentifier("fake_value"),
                 new Address(
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value"),
                 "fake_value",
                 status);
        }
    }
}
