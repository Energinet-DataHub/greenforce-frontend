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
using System.Net;
using System.Threading.Tasks;
using Azure.Identity;
using Energinet.DataHub.Core.FunctionApp.TestCommon.Configuration;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.ActiveDirectory;
using Energinet.DataHub.MarketParticipant.Domain.Model.BusinessRoles;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Infrastructure;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Services
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public sealed class ActiveDirectoryB2CServiceTests
    {
        private readonly IActiveDirectoryService _sut = CreateActiveDirectoryService();

        [Fact]
        public async Task CreateConsumerAppRegistrationAsync_AppIsRegistered_Success()
        {
            ExternalActorId? cleanupId = null;

            try
            {
                // Arrange
                var roles = new List<EicFunction>
                {
                    EicFunction.SystemOperator // transmission system operator
                };

                // Act
                var response = await _sut
                    .CreateAppRegistrationAsync(new MockedGln(), roles)
                    .ConfigureAwait(false);

                cleanupId = response.ExternalActorId;

                // Assert
                var app = await _sut.GetExistingAppRegistrationAsync(
                        new AppRegistrationObjectId(Guid.Parse(response.AppObjectId)),
                        new AppRegistrationServicePrincipalObjectId(response.ServicePrincipalObjectId))
                    .ConfigureAwait(false);

                Assert.Equal(response.ExternalActorId.Value.ToString(), app.AppId);
            }
            finally
            {
                await CleanupAsync(cleanupId).ConfigureAwait(false);
            }
        }

        [Fact]
        public async Task GetExistingAppRegistrationAsync_AddTwoRolesToAppRegistration_Success()
        {
            ExternalActorId? cleanupId = null;

            try
            {
                // Arrange
                var roles = new List<EicFunction>
                {
                    EicFunction.SystemOperator, // transmission system operator
                    EicFunction.MeteredDataResponsible
                };

                var createAppRegistrationResponse = await _sut
                    .CreateAppRegistrationAsync(new MockedGln(), roles)
                    .ConfigureAwait(false);

                cleanupId = createAppRegistrationResponse.ExternalActorId;

                // Act
                var app = await _sut.GetExistingAppRegistrationAsync(
                        new AppRegistrationObjectId(Guid.Parse(createAppRegistrationResponse.AppObjectId)),
                        new AppRegistrationServicePrincipalObjectId(createAppRegistrationResponse.ServicePrincipalObjectId))
                    .ConfigureAwait(false);

                // Assert
                Assert.Equal("f312e8a2-5c5d-4bb1-b925-2d9656bcebc2", app.AppRoles.First().RoleId);
                Assert.Equal("9873b7cb-6b0e-46db-9142-90d0e82c035a", app.AppRoles.ElementAt(1).RoleId);
            }
            finally
            {
                await CleanupAsync(cleanupId).ConfigureAwait(false);
            }
        }

        [Fact]
        public async Task DeleteConsumerAppRegistrationAsync_DeleteCreatedAppRegistration_ServiceException404IsThrownWhenTryingToGetTheDeletedApp()
        {
            ExternalActorId? cleanupId = null;

            try
            {
                // Arrange
                var roles = new List<EicFunction>
                {
                    EicFunction.SystemOperator, // transmission system operator
                };

                var createAppRegistrationResponse = await _sut.CreateAppRegistrationAsync(
                        new MockedGln(),
                        roles)
                    .ConfigureAwait(false);

                cleanupId = createAppRegistrationResponse.ExternalActorId;

                // Act
                await _sut
                    .DeleteAppRegistrationAsync(createAppRegistrationResponse.ExternalActorId)
                    .ConfigureAwait(false);

                cleanupId = null;

                // Assert
                var ex = await Assert.ThrowsAsync<ServiceException>(async () => await _sut
                        .GetExistingAppRegistrationAsync(
                            new AppRegistrationObjectId(Guid.Parse(createAppRegistrationResponse.AppObjectId)),
                            new AppRegistrationServicePrincipalObjectId(createAppRegistrationResponse.ServicePrincipalObjectId))
                        .ConfigureAwait(false))
                    .ConfigureAwait(false);

                Assert.Equal(HttpStatusCode.NotFound, ex.StatusCode);
            }
            finally
            {
                await CleanupAsync(cleanupId).ConfigureAwait(false);
            }
        }

        private static IActiveDirectoryService CreateActiveDirectoryService()
        {
            var integrationTestConfig = new IntegrationTestConfiguration();

            // Graph Service Client
            var clientSecretCredential = new ClientSecretCredential(
                integrationTestConfig.B2CSettings.Tenant,
                integrationTestConfig.B2CSettings.ServicePrincipalId,
                integrationTestConfig.B2CSettings.ServicePrincipalSecret);

            var graphClient = new GraphServiceClient(
                clientSecretCredential,
                new[] { "https://graph.microsoft.com/.default" });

            // Azure AD Config
            var config = new AzureAdConfig(
                integrationTestConfig.B2CSettings.BackendServicePrincipalObjectId,
                integrationTestConfig.B2CSettings.BackendAppId);

            // Business Role Code Domain Service
            var businessRoleCodeDomainService = new BusinessRoleCodeDomainService(new IBusinessRole[]
            {
                new MeteredDataResponsibleRole(), new SystemOperatorRole()
            });

            // Active Directory Roles
            var activeDirectoryB2CRoles =
                new ActiveDirectoryB2CRolesProvider(graphClient, integrationTestConfig.B2CSettings.BackendAppObjectId);

            // Logger
            var logger = Mock.Of<ILogger<ActiveDirectoryB2cService>>();

            return new ActiveDirectoryB2cService(
                graphClient,
                config,
                businessRoleCodeDomainService,
                activeDirectoryB2CRoles,
                logger);
        }

        private async Task CleanupAsync(ExternalActorId? externalActorId)
        {
            if (externalActorId == null)
                return;

            await _sut
                .DeleteAppRegistrationAsync(externalActorId)
                .ConfigureAwait(false);
        }
    }
}
