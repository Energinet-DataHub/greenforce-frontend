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
using Energinet.DataHub.Core.App.Common.Extensions.Options;
using Energinet.DataHub.Core.FunctionApp.TestCommon.AppConfiguration;
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;

namespace Energinet.DataHub.WebApi.Tests.Integration.HealthCheck;

public sealed class HealthCheckFixture : IDisposable
{
    private WireMockServer ServerMock { get; } = WireMockServer.Start(8080);

    private static readonly string[] _paths =
    [
        "/marketparticipant/monitor/live",
        "/esett/monitor/live",
        "/edib2capi/monitor/live",
        "/settlement-reports/monitor/live",
        "/notifications/api/monitor/live",
        "/dh2bridge/api/monitor/live",
        "/process-manager-general/api/monitor/live",
        "/process-manager-orchestrations/api/monitor/live",
    ];

    public HealthCheckFixture()
    {
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__MarketParticipantBaseUrl", "http://localhost:8080/marketparticipant");
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__ESettExchangeBaseUrl", "http://localhost:8080/esett");
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__EdiB2CWebApiBaseUrl", "http://localhost:8080/edib2capi");
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__SettlementReportsAPIBaseUrl", "http://localhost:8080/settlement-reports");
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__NotificationsBaseUrl", "http://localhost:8080/notifications");
        Environment.SetEnvironmentVariable("SubSystemBaseUrls__Dh2BridgeBaseUrl", "http://localhost:8080/dh2bridge");
        Environment.SetEnvironmentVariable("ProcessManagerHttpClients__GeneralApiBaseAddress", "http://localhost:8080/process-manager-general");
        Environment.SetEnvironmentVariable("ProcessManagerHttpClients__OrchestrationsApiBaseAddress", "http://localhost:8080/process-manager-orchestrations");
        Environment.SetEnvironmentVariable($"{AzureAppConfigurationOptions.SectionName}__{nameof(AzureAppConfigurationOptions.Endpoint)}", "not-used");
        SetServicesAsHealthy();
    }

    public void SetServicesAsHealthy()
    {
        var healthChecks = Request
            .Create()
            .WithPath(_paths)
            .UsingGet();

        ServerMock
            .Given(healthChecks)
            .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.OK));
    }

    public void SetServiceAsUnavailable()
    {
        var wholesaleHealthCheck = Request
            .Create()
            .WithPath("/marketparticipant/monitor/live")
            .UsingGet();

        ServerMock
            .Given(wholesaleHealthCheck)
            .RespondWith(Response.Create().WithStatusCode(HttpStatusCode.ServiceUnavailable));
    }

    public void Reset()
    {
        ServerMock.Reset();
        SetServicesAsHealthy();
    }

    public void Dispose()
    {
        ServerMock.Stop();
        ServerMock.Dispose();
    }
}
