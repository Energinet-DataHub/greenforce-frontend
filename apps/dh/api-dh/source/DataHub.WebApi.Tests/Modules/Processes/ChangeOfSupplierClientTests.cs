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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier;
using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier.Models;
using Moq;
using Moq.Protected;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Processes;

public class ChangeOfSupplierClientTests
{
    [Fact]
    public async Task InitiateChangeOfSupplierAsync_ReturnsTrue_OnSuccessStatusCode()
    {
        // Arrange
        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.RequestUri!.AbsolutePath == "/api/v1/RequestChangeOfSupplier/request"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.OK });
        var httpClient = new HttpClient(handlerMock.Object) { BaseAddress = new Uri("http://localhost") };
        var client = new ChangeOfSupplierClient(httpClient);
        var input = new InitiateChangeOfSupplierInput(
            "E65",
            "1234567890",
            "2025-12-03",
            "SupplierId",
            "BalanceResponsibleId",
            "John Doe",
            "123456-7890",
            null);
        // Act
        var result = await client.InitiateChangeOfSupplierAsync(input);
        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task InitiateChangeOfSupplierAsync_ReturnsFalse_OnNonSuccessStatusCode()
    {
        // Arrange
        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.RequestUri!.AbsolutePath == "/api/v1/RequestChangeOfSupplier/request"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest });
        var httpClient = new HttpClient(handlerMock.Object) { BaseAddress = new Uri("http://localhost") };
        var client = new ChangeOfSupplierClient(httpClient);
        var input = new InitiateChangeOfSupplierInput(
            "E65",
            "1234567890",
            "2025-12-03",
            "SupplierId",
            "BalanceResponsibleId",
            "John Doe",
            "123456-7890",
            null);
        // Act
        var result = await client.InitiateChangeOfSupplierAsync(input);
        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UpdateCustomerMasterDataAsync_ReturnsTrue_OnSuccessStatusCode()
    {
        // Arrange
        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.RequestUri!.AbsolutePath == "/api/v1/RequestChangeCustomerCharacteristics/request"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.OK });
        var httpClient = new HttpClient(handlerMock.Object) { BaseAddress = new Uri("http://localhost") };
        var client = new ChangeOfSupplierClient(httpClient);
        var input = new UpdateCustomerMasterDataInput(
            "E65",
            "1234567890",
            "2025-12-03",
            "John Doe",
            "Jane Doe",
            "123456-7890",
            "234567-8901",
            null,
            "Main Street 1",
            "Second Street 2");
        // Act
        var result = await client.UpdateCustomerMasterDataAsync(input);
        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UpdateCustomerMasterDataAsync_ReturnsFalse_OnNonSuccessStatusCode()
    {
        // Arrange
        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.RequestUri!.AbsolutePath == "/api/v1/RequestChangeCustomerCharacteristics/request"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest });
        var httpClient = new HttpClient(handlerMock.Object) { BaseAddress = new Uri("http://localhost") };
        var client = new ChangeOfSupplierClient(httpClient);
        var input = new UpdateCustomerMasterDataInput(
            "E65",
            "1234567890",
            "2025-12-03",
            "John Doe",
            "Jane Doe",
            "123456-7890",
            "234567-8901",
            null,
            "Main Street 1",
            "Second Street 2");
        // Act
        var result = await client.UpdateCustomerMasterDataAsync(input);
        // Assert
        Assert.False(result);
    }
}
