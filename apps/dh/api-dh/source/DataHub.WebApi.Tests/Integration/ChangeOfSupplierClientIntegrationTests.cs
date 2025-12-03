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

using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier;
using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier.Models;
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration;

public class ChangeOfSupplierClientIntegrationTests
{
    [Fact]
    public async Task RequestChangeOfSupplierAsync_ReturnsTrue_WhenWireMockReturnsSuccess()
    {
        // Arrange
        using var server = WireMockServer.Start();
        server.Given(
                Request.Create()
                    .WithPath("/api/v1/RequestChangeOfSupplier/request")
                    .UsingPost())
            .RespondWith(
                Response.Create()
                    .WithStatusCode(200));

        var baseUrl = server.Url ?? throw new System.InvalidOperationException("WireMock server URL is null");
        var httpClient = new HttpClient { BaseAddress = new System.Uri(baseUrl) };
        var client = new ChangeOfSupplierClient(httpClient);
        var input = new RequestChangeOfSupplierInput("metering-point-id", "supplier-id", "2025-12-03");

        // Act
        var result = await client.RequestChangeOfSupplierAsync(input);

        // Assert
        Assert.True(result);
    }
}
