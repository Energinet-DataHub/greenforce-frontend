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
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Moq;
using Moq.Protected;
using NodaTime.Text;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Unit.Clients.Wholesale.SettlementReports;

public class SettlementReportsClientTests : IDisposable
{
    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly HttpClient _httpClient;
    private readonly SettlementReportsClient _client;

    public SettlementReportsClientTests()
    {
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
        _httpClient.BaseAddress = new Uri("http://localhost");
        _client = new SettlementReportsClient(_httpClient, _httpClient, _httpClient);
    }

    [Theory]
    [InlineData("2024-11-01T23:00:00.000Z", "2024-12-31T23:00:00.000Z")]
    [InlineData("2024-11-01T23:00:00.000Z", "2025-01-01T23:00:00.000Z")]
    [InlineData("2023-11-30T23:00:00.000Z", "2024-12-31T23:00:00.000Z")]
    [InlineData("2024-11-30T22:00:00.000Z", "2024-12-31T23:00:00.000Z")]
    public async Task RequestAsync_ThrowsArgumentException_WhenPeriodAcrossMonths(string periodStart, string periodEnd)
    {
        // Arrange
        var requestDto = new SettlementReportRequestDto(
            SplitReportPerGridArea: false,
            PreventLargeTextFiles: false,
            IncludeBasisData: false,
            IncludeMonthlyAmount: false,
            UseAPI: false,
            Filter: new SettlementReportRequestFilterDto(
                GridAreas: new Dictionary<string, CalculationId?>(),
                PeriodStart: OffsetDateTimePattern.ExtendedIso.Parse(periodStart).Value.ToDateTimeOffset(),
                PeriodEnd: OffsetDateTimePattern.ExtendedIso.Parse(periodEnd).Value.ToDateTimeOffset(),
                CalculationType: CalculationType.BalanceFixing,
                EnergySupplier: null,
                CsvFormatLocale: null),
            ActorNumberOverride: null,
            MarketRoleOverride: null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _client.RequestAsync(requestDto, CancellationToken.None));
    }

    [Theory]
    [InlineData("2024-11-30T23:00:00.000Z", "2024-12-31T23:00:00.000Z")]
    [InlineData("2024-12-01T00:00:00.000Z", "2024-12-31T23:00:00.000Z")]
    public async Task RequestAsync_SendsRequest_WhenValidRequest(string periodStart, string periodEnd)
    {
        // Arrange
        var requestDto = new SettlementReportRequestDto(
            SplitReportPerGridArea: false,
            PreventLargeTextFiles: false,
            IncludeBasisData: false,
            IncludeMonthlyAmount: false,
            UseAPI: false,
            Filter: new SettlementReportRequestFilterDto(
                GridAreas: new Dictionary<string, CalculationId?>(),
                PeriodStart: OffsetDateTimePattern.ExtendedIso.Parse(periodStart).Value.ToDateTimeOffset(),
                PeriodEnd: OffsetDateTimePattern.ExtendedIso.Parse(periodEnd).Value.ToDateTimeOffset(),
                CalculationType: CalculationType.BalanceFixing,
                EnergySupplier: null,
                CsvFormatLocale: null),
            ActorNumberOverride: null,
            MarketRoleOverride: null);

        _httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK));

        // Act
        await _client.RequestAsync(requestDto, CancellationToken.None);

        // Assert
        _httpMessageHandlerMock.Protected().Verify(
            "SendAsync",
            Times.Once(),
            ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Post),
            ItExpr.IsAny<CancellationToken>());
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _httpClient.Dispose();
        }
    }
}
