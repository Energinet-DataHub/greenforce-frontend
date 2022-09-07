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

using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.Charges.Contracts.ChargeLink;
using Energinet.DataHub.Charges.Clients.ChargeLinks;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Abstractions;
using Xunit.Categories;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    [IntegrationTest]
    public class ChargeLinksControllerTests :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
    {
        private Fixture DtoFixture { get; }

        private Mock<IChargeLinksClient> ApiClientMock { get; }

        private readonly HttpClient _client;

        public ChargeLinksControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, testOutputHelper)
        {
            DtoFixture = new Fixture();
            ApiClientMock = new Mock<IChargeLinksClient>();

            _client = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddTransient(_ => ApiClientMock.Object);
                });
            })
            .CreateClient();

            factory.ReconfigureJwtTokenValidatorMock(isValid: true);
        }

        public Task InitializeAsync()
        {
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer xxx");
            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            _client.Dispose();
            return Task.CompletedTask;
        }

        [Fact]
        public async Task GetAsync_WhenMeteringPointIdHasChargeLinks_ReturnsOk()
        {
            // Arrange
            var meteringPointId = "metering-point-has-links";
            var requestUrl = $"/v1/ChargeLinks?meteringPointId={meteringPointId}";
            var list = new List<ChargeLinkV1Dto>
            {
                DtoFixture.Create<ChargeLinkV1Dto>(),
            };

            ApiClientMock
                .Setup(m => m.GetAsync(meteringPointId))
                .ReturnsAsync(list);

            // Act
            var actual = await _client.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetAsync_WhenMeteringPointIdHasNoChargeLink_ReturnsNotFound()
        {
            // Arrange
            var meteringPointId = "metering-point-has-no-links";
            var requestUrl = $"/v1/ChargeLinks?meteringPointId={meteringPointId}";
            var list = new List<ChargeLinkV1Dto>();

            ApiClientMock
                .Setup(m => m.GetAsync(meteringPointId))
                .ReturnsAsync(list);

            // Act
            var actual = await _client.GetAsync(requestUrl);

            // Arrange
            actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
