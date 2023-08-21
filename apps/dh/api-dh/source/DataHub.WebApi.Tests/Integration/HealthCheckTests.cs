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
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.Core.App.Common.Diagnostics.HealthChecks;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration
{
    public class HealthCheckTests :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
    {
        private HttpClient Client { get; }

        private Uri _dependentServiceUri;
        private WireMockServer _serverMock;

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public HealthCheckTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, testOutputHelper)
        {
            Client = factory.CreateClient();
        }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        public Task InitializeAsync()
        {
            var httpLocalhostServer = "http://localhost:8080/";
            _dependentServiceUri = new Uri(httpLocalhostServer);
            _serverMock = WireMockServer.Start(_dependentServiceUri.Port);

            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            _serverMock.Stop();
            _serverMock.Dispose();
            Client.Dispose();
            return Task.CompletedTask;
        }

        [Fact]
        public async Task When_RequestLivenessStatus_Then_ResponseIsOkAndHealthy()
        {
            var actualResponse = await Client.GetAsync(HealthChecksConstants.LiveHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().Be(Enum.GetName(typeof(HealthStatus), HealthStatus.Healthy));
        }

        [Fact]
        public async Task When_RequestReadinessStatus_Then_ResponseIsOkAndHealthy()
        {
            _serverMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/charges/monitor/live",
                    "/messagearchive/monitor/live",
                    "/marketparticipant/monitor/live",
                    "/wholesale/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.OK));

            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().Be(Enum.GetName(typeof(HealthStatus), HealthStatus.Healthy));
        }

        [Fact]
        public async Task If_ADependentServiceIsUnavailable_When_RequestReadinessStatus_Then_ResponseIsServiceUnavailableAndUnhealthy()
        {
            _serverMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/charges/monitor/live",
                    "/messagearchive/monitor/live",
                    "/marketparticipant/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.OK));
            _serverMock
                .Given(Request.Create().WithPath(new[]
                {
                    "/wholesale/monitor/live",
                }).UsingGet())
                .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.ServiceUnavailable));

            var actualResponse = await Client.GetAsync(HealthChecksConstants.ReadyHealthCheckEndpointRoute);

            // Assert
            actualResponse.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);

            var actualContent = await actualResponse.Content.ReadAsStringAsync();
            actualContent.Should().Be(Enum.GetName(typeof(HealthStatus), HealthStatus.Unhealthy));
        }
    }
}
