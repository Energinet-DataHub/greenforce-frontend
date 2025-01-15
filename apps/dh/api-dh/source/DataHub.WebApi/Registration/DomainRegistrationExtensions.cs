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
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;
using Energinet.DataHub.ProcessManager.Client.Extensions.DependencyInjection;
using Energinet.DataHub.ProcessManager.Client.Extensions.Options;
using Energinet.DataHub.WebApi.Clients.Dh2Bridge;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Notifications;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

// ReSharper disable UnusedMethodReturnValue.Global
// ReSharper disable UnusedMethodReturnValue.Local
namespace Energinet.DataHub.WebApi.Registration;

public static class DomainRegistrationExtensions
{
    /// <summary>
    /// Register Process Manager clients and health checks.
    /// </summary>
    public static IServiceCollection AddProcessManager(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        // Client and adapters
        services.AddProcessManagerHttpClients();
        services.AddScoped<IProcessManagerClientAdapter, ProcessManagerClientAdapter>();

        // Health Checks
        // TODO: Change this to IOptions pattern.
        var processManagerClientOptions = configuration
            .GetSection(ProcessManagerHttpClientsOptions.SectionName)
            .Get<ProcessManagerHttpClientsOptions>();

        // Until we remove the feature flag "UseProcessManager" we allow skipping the configuration of the Process Manager
        if (processManagerClientOptions != null)
        {
            services.AddHealthChecks()
                .AddServiceHealthCheck(
                    "ProcessManager General endpoints",
                    HealthEndpointRegistrationExtensions.CreateHealthEndpointUri(
                        processManagerClientOptions.GeneralApiBaseAddress,
                        isAzureFunction: true))
                .AddServiceHealthCheck(
                    "ProcessManager Orchestrations endpoints",
                    HealthEndpointRegistrationExtensions.CreateHealthEndpointUri(
                        processManagerClientOptions.OrchestrationsApiBaseAddress,
                        isAzureFunction: true));
        }

        return services;
    }

    public static IServiceCollection AddDomainClients(this IServiceCollection services)
    {
        return services
            .AddHttpClient()
            .AddHttpContextAccessor()
            .AddAuthorizedHttpClient()
            .AddMarketParticipantGeneratedClient()
            .AddWholesaleClient()
            .AddWholesaleOrchestrationsClient()
            .AddSettlementReportsClient()
            .AddESettClient()
            .AddEdiWebAppClient()
            .AddEdiWebAppClientV3()
            .AddImbalancePricesClient()
            .AddNotificationsClient()
            .AddDh2BridgeClient()
            .AddElectricityMarket();
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

    private static IServiceCollection AddWholesaleClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IWholesaleClient_V3, WholesaleClient_V3>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.WholesaleBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new WholesaleClient_V3(baseUrl, client);
            });
    }

    private static IServiceCollection AddWholesaleOrchestrationsClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IWholesaleOrchestrationsClient, WholesaleOrchestrationsClient>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.WholesaleOrchestrationsBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new WholesaleOrchestrationsClient(client);
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

    private static IServiceCollection AddESettClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IESettExchangeClient_V1, ESettExchangeClient_V1>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.ESettExchangeBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new ESettExchangeClient_V1(baseUrl, client);
            });
    }

    private static IServiceCollection AddMarketParticipantGeneratedClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IMarketParticipantClient_V1, MarketParticipantClient_V1>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.MarketParticipantBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new MarketParticipantClient_V1(baseUrl, client);
            });
    }

    private static IServiceCollection AddEdiWebAppClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IEdiB2CWebAppClient_V1, EdiB2CWebAppClient_V1>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.EdiB2CWebApiBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new EdiB2CWebAppClient_V1(baseUrl, client);
            });
    }

    private static IServiceCollection AddEdiWebAppClientV3(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IEdiB2CWebAppClient_V3, EdiB2CWebAppClient_V3>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.EdiB2CWebApiBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new EdiB2CWebAppClient_V3(baseUrl, client);
            });
    }

    private static IServiceCollection AddImbalancePricesClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IImbalancePricesClient_V1, ImbalancePricesClient_V1>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.ImbalancePricesBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new ImbalancePricesClient_V1(baseUrl, client);
            });
    }

    private static IServiceCollection AddNotificationsClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<INotificationsClient, NotificationClient>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.NotificationsBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new NotificationClient(client);
            });
    }

    private static IServiceCollection AddDh2BridgeClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IDh2BridgeClient, Dh2BridgeClient>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.Dh2BridgeBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new Dh2BridgeClient(client);
            });
    }

    private static IServiceCollection AddElectricityMarket(this IServiceCollection serviceCollection)
    {
        return serviceCollection.AddScoped<IElectricityMarketClient_V1, ElectricityMarketClient_V1>(
            provider =>
            {
                var baseUrl = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value.ElectricityMarketBaseUrl;
                var client = provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(GetBaseUri(baseUrl));

                return new ElectricityMarketClient_V1(baseUrl, client);
            });
    }
}
