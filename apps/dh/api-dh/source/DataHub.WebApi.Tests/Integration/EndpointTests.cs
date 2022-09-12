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
using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using FluentAssertions.Execution;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration
{
    /// <summary>
    /// Proves the Open API endpoint and Swagger UI can be reached.
    /// </summary>
    public class EndpointTests
    {
        public class GetOpenApiDocumentation :
                    WebApiTestBase<BffWebApiFixture>,
                    IClassFixture<BffWebApiFixture>,
                    IClassFixture<WebApiFactory>
        {
            private HttpClient Client { get; }

            public GetOpenApiDocumentation(
                    BffWebApiFixture bffWebApiFixture,
                    WebApiFactory factory,
                    ITestOutputHelper testOutputHelper)
                    : base(bffWebApiFixture, testOutputHelper)
            {
                Client = factory.CreateClient();
            }

            [Fact]
            public async Task When_StandardRequest_Then_ResponseIsOKAndContainsJsonAndOpenAPIv3()
            {
                // Arrange
                var url = "swagger/v1/swagger.json";

                // Act
                var actualResponse = await Client.GetAsync(url);

                // Assert
                using var assertionScope = new AssertionScope();
                actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);
                actualResponse.Content.Headers.ContentType!.MediaType.Should().Be("application/json");

                var content = await actualResponse.Content.ReadAsStringAsync();
                content.Should().Contain("\"openapi\": \"3.");
            }

            [Fact]
            public async Task When_StandardRequest_Then_ResponseIsOKAndContainsHtml()
            {
                // Arrange
                var url = "swagger";

                // Act
                var actualResponse = await Client.GetAsync(url);

                // Assert
                using var assertionScope = new AssertionScope();
                actualResponse.StatusCode.Should().Be(HttpStatusCode.OK);
                actualResponse.Content.Headers.ContentType!.MediaType.Should().Be("text/html");
            }
        }
    }
}
