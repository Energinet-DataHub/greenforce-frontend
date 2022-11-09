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
using Azure.Identity;
using Energinet.DataHub.Core.FunctionApp.TestCommon.Configuration;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Microsoft.Graph;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Services
{
    [Collection("IntegrationTest")]
    [IntegrationTest]
    public class ActiveDirectoryB2CRolesProviderTests
    {
        private readonly ActiveDirectoryB2CRolesProvider _sut;
        public ActiveDirectoryB2CRolesProviderTests()
        {
            _sut = CreateActiveDirectoryB2CRolesProvider();
        }

        [Fact]
        public async Task GetActiveDirectoryRoles_AllActiveDirectoryRolesAreDownloaded_Success()
        {
            // Arrange
            var roles = await _sut.GetB2CRolesAsync().ConfigureAwait(false);

            // Act + Assert
            Assert.Equal(Guid.Parse("882f1309-f696-4055-9b1d-70bd3abd6aec"), roles.DdkId);
            Assert.Equal(Guid.Parse("3ba88b9a-9179-4f03-9281-3e43757b54c7"), roles.DdmId);
            Assert.Equal(Guid.Parse("9ec90757-aac3-40c4-bcb3-8bffcb642996"), roles.DdqId);
            Assert.Equal(Guid.Parse("100b5fd2-640a-4e5d-af72-20c8c16ad885"), roles.DdxId);
            Assert.Equal(Guid.Parse("8259c970-8e6d-4a52-8ea3-4676fda03803"), roles.DdzId);
            Assert.Equal(Guid.Parse("b6326033-1435-4b3d-9849-7d2e34ba6efb"), roles.DglId);
            Assert.Equal(Guid.Parse("9873b7cb-6b0e-46db-9142-90d0e82c035a"), roles.EzId);
            Assert.Equal(Guid.Parse("f312e8a2-5c5d-4bb1-b925-2d9656bcebc2"), roles.MdrId);
            Assert.Equal(Guid.Parse("de768b8e-2f1c-4ccf-a8db-e19a08d008ec"), roles.StsId);
            Assert.Equal(Guid.Parse("11b79733-b588-413d-9833-8adedce991aa"), roles.TsoId);
        }

        private static ActiveDirectoryB2CRolesProvider CreateActiveDirectoryB2CRolesProvider()
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

            // B2C Backend App Object Id
            var appObjectId = integrationTestConfig.B2CSettings.BackendAppObjectId;

            return new ActiveDirectoryB2CRolesProvider(graphClient, appObjectId);
        }
    }
}
