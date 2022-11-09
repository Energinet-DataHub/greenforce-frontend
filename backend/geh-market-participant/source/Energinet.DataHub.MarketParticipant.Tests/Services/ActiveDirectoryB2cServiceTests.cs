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
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Infrastructure;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services
{
    [UnitTest]
    public sealed class ActiveDirectoryB2cServiceTests
    {
        [Fact]
        public async Task CreateConsumerAppRegistrationAsync_ConsumerAppNameArgumentNull_ThrowsException()
        {
            // Arrange
            var target = MockActiveDirectoryB2CService();

            var permissions = new List<EicFunction>() { EicFunction.EnergySupplier };

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.CreateAppRegistrationAsync(null!, permissions))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task CreateConsumerAppRegistrationAsync_PermissionsArgumentNull_ThrowsException()
        {
            // Arrange
            var target = MockActiveDirectoryB2CService();

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.CreateAppRegistrationAsync(new MockedGln(), null!))
                .ConfigureAwait(false);
        }

        private static ActiveDirectoryB2cService MockActiveDirectoryB2CService()
        {
            var mockAuthProvider = new Mock<IAuthenticationProvider>();
            var mockHttpProvider = Mock.Of<IHttpProvider>();
            var mockGraphClient = new Mock<GraphServiceClient>(mockAuthProvider.Object, mockHttpProvider);
            var activeDirectoryB2CRoles = new ActiveDirectoryB2CRolesProvider(mockGraphClient.Object, "Backend App Object Id");
            var mockBusinessRoleCodeDomainService = new Mock<IBusinessRoleCodeDomainService>();

            var target = new ActiveDirectoryB2cService(
                mockGraphClient.Object,
                new AzureAdConfig(
                    "fake_value",
                    "fake_value"),
                mockBusinessRoleCodeDomainService.Object,
                activeDirectoryB2CRoles,
                new Mock<ILogger<ActiveDirectoryB2cService>>().Object);

            return target;
        }
    }
}
