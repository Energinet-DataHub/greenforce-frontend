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
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration
{
    public class HealthCheckTests(WebApiFactory factory)
        : WebApiTestBase(factory)
    {
        private WireMockServer ServerMock { get; } = WireMockServer.Start("8080");

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
            ServerMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/charges/monitor/live",
                    "/messagearchive/monitor/live",
                    "/marketparticipant/monitor/live",
                    "/wholesale/monitor/live",
                    "/esett/monitor/live",
                    "/edib2capi/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.OK));

            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().StartWith("{\"status\":\"Healthy\"");
        }

        [Fact]
        public async Task If_ADependentServiceIsUnavailable_When_RequestReadinessStatus_Then_ResponseIsServiceUnavailableAndUnhealthy()
        {
            ServerMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/charges/monitor/live",
                    "/messagearchive/monitor/live",
                    "/marketparticipant/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.OK));
            ServerMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/wholesale/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.ServiceUnavailable));

            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().StartWith("{\"status\":\"Unhealthy\"");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                ServerMock.Stop();
                ServerMock.Dispose();
            }
        }
    }
}
