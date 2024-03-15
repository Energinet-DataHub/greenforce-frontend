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
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Energinet.DataHub.WebApi.Tests.Fixtures
{
    public class WebApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            Environment.SetEnvironmentVariable("ApiClientSettings__ChargesBaseUrl", "http://localhost:8080/charges");
            Environment.SetEnvironmentVariable("ApiClientSettings__MessageArchiveBaseUrl", "http://localhost:8080/messagearchive");
            Environment.SetEnvironmentVariable("ApiClientSettings__MarketParticipantBaseUrl", "http://localhost:8080/marketparticipant");
            Environment.SetEnvironmentVariable("ApiClientSettings__WholesaleBaseUrl", "http://localhost:8080/wholesale");
            Environment.SetEnvironmentVariable("ApiClientSettings__ESettExchangeBaseUrl", "http://localhost:8080/esett");
            Environment.SetEnvironmentVariable("ApiClientSettings__EdiB2CWebApiBaseUrl", "http://localhost:8080/edib2capi");

            // These values are required Startup.cs configuration, but the actual token validation is mocked.
            Environment.SetEnvironmentVariable("EXTERNAL_OPEN_ID_URL", "http://localhost:8080/");
            Environment.SetEnvironmentVariable("BACKEND_BFF_APP_ID", "00000000-0000-0000-0000-000000000000");
            }
    }
}
