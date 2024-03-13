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
using System.IO;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Telemetry;

public class FileStreamTelemetryTests(WebApiFactory factory, TelemetryFixture fixture)
    : WebApiTestBase(factory), IClassFixture<TelemetryFixture>
{
    private TelemetryFixture Fixture { get; } = fixture;

    private Mock<IWholesaleClient_V3> WholesaleClientV3Mock { get; } = new();

    private string RequestUri { get; } =
        $"/v1/WholesaleSettlementReport/download" +
        $"?gridAreaCodes=123" +
        $"&calculationType=BalanceFixing" +
        $"&periodStart=2021-01-01" +
        $"&periodEnd=2021-01-01" +
        $"&logAnalyticsIdentifier={Guid.NewGuid()}";

    [Fact]
    public async Task DownloadRequest_Should_CauseExpectedEventsToBeLogged()
    {
        await Client.GetAsync(RequestUri);

        var wasEventsLogged = await Fixture.QueryLogAnalyticsUntilCountAsync(
            $$"""
                let OperationId = AppRequests
                | where Url has "{{RequestUri}}"
                | project OperationId
                | take 1;
                let OperationIdScalar = toscalar(OperationId);
                let RelevantAppTraces = AppTraces
                | where Message contains "Executing FileStreamResult, sending file with download name 'SettlementReport.zip'" and OperationId == OperationIdScalar
                | project OperationId
                | take 1;
                RelevantAppTraces
                | count
            """,
            1);

        wasEventsLogged.Should().BeTrue("Expected events was not logged to Application Insights within time limit.");
    }

    protected override void ConfigureMocks(IServiceCollection services)
    {
        var headers = new Dictionary<string, IEnumerable<string>>
            { ["Content-Disposition"] = ["attachment; filename=SettlementReport.zip"] };

        var fileResponse = new FileResponse(0, headers, new MemoryStream(), null, null);
        List<string> gridAreaCodes = ["123"];

        WholesaleClientV3Mock
            .Setup(x => x.DownloadAsync(
                gridAreaCodes,
                CalculationType.BalanceFixing,
                It.IsAny<DateTimeOffset>(),
                It.IsAny<DateTimeOffset>(),
                null,
                null,
                default))
            .ReturnsAsync(fileResponse);

        services.AddSingleton(WholesaleClientV3Mock.Object);
    }
}
