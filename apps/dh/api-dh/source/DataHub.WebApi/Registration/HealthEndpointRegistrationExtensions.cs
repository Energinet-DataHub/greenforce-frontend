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

using Energinet.DataHub.Core.App.Common.Extensions.Builder;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

namespace Energinet.DataHub.WebApi.Registration;

public static class HealthEndpointRegistrationExtensions
{
    public static void SetupHealthEndpoints(this IServiceCollection services, IConfiguration configuration)
    {
        // TODO: Change this to IOptions pattern.
        var subSystemBaseUrls = configuration
            .GetSection(SubSystemBaseUrls.SectionName)
            .Get<SubSystemBaseUrls>() ?? throw new InvalidOperationException($"Missing configuration section '{SubSystemBaseUrls.SectionName}'");

        services
            .AddHealthChecks()
            .AddLiveCheck()
            .AddServiceHealthCheck("marketParticipant", CreateHealthEndpointUri(subSystemBaseUrls.MarketParticipantBaseUrl))
            .AddServiceHealthCheck("wholesale", CreateHealthEndpointUri(subSystemBaseUrls.WholesaleBaseUrl))
            .AddServiceHealthCheck("wholesaleOrchestrations", CreateHealthEndpointUri(subSystemBaseUrls.WholesaleOrchestrationsBaseUrl, isAzureFunction: true))
            .AddServiceHealthCheck("eSettExchange", CreateHealthEndpointUri(subSystemBaseUrls.ESettExchangeBaseUrl))
            .AddServiceHealthCheck("settlementReportsAPI", CreateHealthEndpointUri(subSystemBaseUrls.SettlementReportsAPIBaseUrl))
            .AddServiceHealthCheck("ediB2CWebApi", CreateHealthEndpointUri(subSystemBaseUrls.EdiB2CWebApiBaseUrl))
            .AddServiceHealthCheck("notificationsWebApi", CreateHealthEndpointUri(subSystemBaseUrls.NotificationsBaseUrl, isAzureFunction: true))
            .AddServiceHealthCheck("dh2BridgeWebApi", CreateHealthEndpointUri(subSystemBaseUrls.Dh2BridgeBaseUrl, isAzureFunction: true));
    }

    internal static Uri CreateHealthEndpointUri(string baseUri, bool isAzureFunction = false)
    {
        var liveEndpoint = "/monitor/live";
        if (isAzureFunction)
        {
            liveEndpoint = "/api" + liveEndpoint;
        }

        return string.IsNullOrWhiteSpace(baseUri)
            ? new Uri("https://empty")
            : new Uri(baseUri + liveEndpoint);
    }
}
