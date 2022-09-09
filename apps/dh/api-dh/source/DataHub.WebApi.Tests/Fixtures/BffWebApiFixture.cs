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
using Energinet.DataHub.Core.FunctionApp.TestCommon.Configuration.B2C;
using Energinet.DataHub.WebApi.Tests.TestHelpers;
using Microsoft.Extensions.Configuration;

namespace Energinet.DataHub.WebApi.Tests.Fixtures
{
    public class BffWebApiFixture : WebApiFixture
    {
        public BffWebApiFixture()
        {
            AuthorizationConfiguration =
                AuthorizationConfigurationData.CreateAuthorizationConfiguration();
        }

        public B2CAuthorizationConfiguration AuthorizationConfiguration { get; }

        /// <inheritdoc/>
        protected override Task OnInitializeWebApiDependenciesAsync(IConfiguration configuration)
        {
            Environment.SetEnvironmentVariable("ApiClientSettings__ChargesBaseUrl", "https://app-webapi-charges-u-001.azurewebsites.net");
            Environment.SetEnvironmentVariable("ApiClientSettings__MessageArchiveBaseUrl", "https://app-webapi-msgarch-u-001.azurewebsites.net");
            Environment.SetEnvironmentVariable("ApiClientSettings__MarketParticipantBaseUrl", "https://app-webapi-markpart-u-001.azurewebsites.net");
            Environment.SetEnvironmentVariable("ApiClientSettings__WholesaleBaseUrl", "https://app-webapi-wholsal-u-001.azurewebsites.net");
            Environment.SetEnvironmentVariable("FRONTEND_OPEN_ID_URL", AuthorizationConfiguration.FrontendOpenIdConfigurationUrl);
            Environment.SetEnvironmentVariable("FRONTEND_SERVICE_APP_ID", AuthorizationConfiguration.FrontendApp.AppId);

            return Task.CompletedTask;
        }
    }
}
