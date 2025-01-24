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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;
using Energinet.DataHub.WebApi.Clients.Dh2Bridge;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Notifications;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

// ReSharper disable UnusedMethodReturnValue.Global
// ReSharper disable UnusedMethodReturnValue.Local
namespace Energinet.DataHub.WebApi.Registration;

public static class DomainRegistrationExtensions
{
    public static IServiceCollection AddDomainClients(this IServiceCollection services)
    {
        return services
            .AddHttpClient()
            .AddHttpContextAccessor()
            .AddAuthorizedHttpClient()
            .AddClient<IMarketParticipantClient_V1>(baseUrls => baseUrls.MarketParticipantBaseUrl, (baseUrl, client) => new MarketParticipantClient_V1(baseUrl, client))
            .AddClient<IWholesaleClient_V3>(baseUrls => baseUrls.WholesaleBaseUrl, (baseUrl, client) => new WholesaleClient_V3(baseUrl, client))
            .AddClient<IWholesaleOrchestrationsClient>(baseUrls => baseUrls.WholesaleOrchestrationsBaseUrl, (_, client) => new WholesaleOrchestrationsClient(client))
            .AddSettlementReportsClient()
            .AddClient<IESettExchangeClient_V1>(baseUrls => baseUrls.ESettExchangeBaseUrl, (baseUrl, client) => new ESettExchangeClient_V1(baseUrl, client))
            .AddClient<IEdiB2CWebAppClient_V1>(baseUrls => baseUrls.EdiB2CWebApiBaseUrl, (baseUrl, client) => new EdiB2CWebAppClient_V1(baseUrl, client))
            .AddClient<IEdiB2CWebAppClient_V3>(baseUrls => baseUrls.EdiB2CWebApiBaseUrl, (baseUrl, client) => new EdiB2CWebAppClient_V3(baseUrl, client))
            .AddClient<IImbalancePricesClient_V1>(baseUrls => baseUrls.ImbalancePricesBaseUrl, (baseUrl, client) => new ImbalancePricesClient_V1(baseUrl, client))
            .AddClient<INotificationsClient>(baseUrls => baseUrls.NotificationsBaseUrl, (_, client) => new NotificationsClient(client))
            .AddClient<IDh2BridgeClient>(baseUrls => baseUrls.Dh2BridgeBaseUrl, (_, client) => new Dh2BridgeClient(client))
            .AddClient<IElectricityMarketClient_V1>(baseUrls => baseUrls.ElectricityMarketBaseUrl, (baseUrl, client) => new ElectricityMarketClient_V1(baseUrl, client));
    }

    private static IServiceCollection AddAuthorizedHttpClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection
            .AddSingleton(provider => new AuthorizedHttpClientFactory(
                provider.GetRequiredService<IHttpClientFactory>(),
                () => (string?)provider.GetRequiredService<IHttpContextAccessor>().HttpContext!.Request.Headers["Authorization"] ?? string.Empty));
    }

    private static Uri GetBaseUri(string baseUrl)
    {
        return Uri.TryCreate(baseUrl, UriKind.Absolute, out var url)
            ? url
            : new Uri("https://empty");
    }

    private static IServiceCollection AddClient<TClient>(this IServiceCollection serviceCollection, Func<SubSystemBaseUrls, string> getBaseUrl, Func<string, HttpClient, TClient> createClient)
        where TClient : class
    {
        return serviceCollection.AddScoped(
            provider =>
            {
                var baseUrls = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>();
                var baseUrl = getBaseUrl(baseUrls.Value);
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));
                return createClient(baseUrl, client);
            });
    }

    private static IServiceCollection AddSettlementReportsClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<ISettlementReportsClient, SettlementReportsClient>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.WholesaleOrchestrationSettlementReportsBaseUrl;
                var lightBaseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.WholesaleOrchestrationSettlementReportsLightBaseUrl;
                var apiBaseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.SettlementReportsAPIBaseUrl;

                return new SettlementReportsClient(
                    provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl)),
                    provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(lightBaseUrl)),
                    provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(apiBaseUrl)));
            });
    }
}
