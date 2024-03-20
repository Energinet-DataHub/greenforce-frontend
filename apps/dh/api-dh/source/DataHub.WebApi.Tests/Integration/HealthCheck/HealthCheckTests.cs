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

using System.Net;
using System.Threading.Tasks;
using Energinet.DataHub.Core.App.Common.Diagnostics.HealthChecks;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.HealthCheck
{
    public class HealthCheckTests(WebApiFactory factory, HealthCheckFixture fixture)
        : WebApiTestBase(factory), IClassFixture<HealthCheckFixture>
    {
        [Fact]
        public async Task When_RequestLivenessStatus_Then_ResponseIsOkAndHealthy()
        {
            var actualResponse = await Client.GetAsync(HealthChecksConstants.LiveHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().StartWith("{\"status\":\"Healthy\"");
        }

        [Fact]
        public async Task When_RequestReadinessStatus_Then_ResponseIsOkAndHealthy()
        {
            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().StartWith("{\"status\":\"Healthy\"");
        }

        [Fact]
        public async Task If_ADependentServiceIsUnavailable_When_RequestReadinessStatus_Then_ResponseIsServiceUnavailableAndUnhealthy()
        {
            fixture.SetServiceAsUnavailable();

            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().StartWith("{\"status\":\"Unhealthy\"");
        }

        protected override void Dispose(bool disposing)
        {
            fixture.Reset();
        }
    }
}
