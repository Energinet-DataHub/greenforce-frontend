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
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    // PoC showing how to integration test controllers
    public class WeatherForecastControllerTests
    {
        public class Get : WebHostTestBase
        {
            public Get(WebApplicationFactory<WebApi.Startup> factory)
                : base(factory)
            {
            }

            [Fact]
            public async Task When_Requested_Then_StatusCodeIsOK()
            {
                // Arrange
                var requestUrl = "/v1/weatherForecast";

                // Act
                var actual = await HttpClient.GetAsync(requestUrl);

                // Assert
                actual.StatusCode.Should().Be(HttpStatusCode.OK);
            }
        }
    }
}
