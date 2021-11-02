// Copyright 2021 Energinet DataHub A/S
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
using System.Net.Http;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Energinet.DataHub.MeteringPoints.Client.Abstractions.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class MeteringPointControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        public MeteringPointControllerTests(WebApplicationFactory<Startup> factory)
        {
            Fixture = new Fixture();

            ApiClientMock = new Mock<IMeteringPointClient>();
            HttpClient = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddTransient(provider => ApiClientMock.Object);
                });
            })
            .CreateClient();
        }

        private Fixture Fixture { get; }

        private Mock<IMeteringPointClient> ApiClientMock { get; }

        private HttpClient HttpClient { get; }

        [Fact]
        public async Task When_Requested_Then_StatusCodeIsOK()
        {
            // Arrange
            const string gsrn = "574591757409421563";
            var requestUrl = $"/v1/MeteringPoint/GetByGsrn?gsrnNumber={gsrn}";
            var meteringPointDto = Fixture.Create<MeteringPointDto>();

            ApiClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .ReturnsAsync(meteringPointDto);

            // Act
            var actual = await HttpClient.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task When_Requested_Then_StatusCodeIsNotFound()
        {
            // Arrange
            const string gsrn = "non-existing-gsrn-number";
            var requestUrl = $"/v1/meteringpoint/getbygsrn?gsrnNumber={gsrn}";

            ApiClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .Returns(Task.FromResult<MeteringPointDto?>(null));

            // Act
            var actual = await HttpClient.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
