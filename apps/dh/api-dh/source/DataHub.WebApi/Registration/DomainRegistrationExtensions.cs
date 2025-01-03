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
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Notifications;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;

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

    public static IServiceCollection AddDomainClients(this IServiceCollection services, ApiClientSettings apiClientSettings)
    {
        return services
            .AddHttpClient()
            .AddHttpContextAccessor()
            .AddAuthorizedHttpClient()
            .AddMarketParticipantGeneratedClient(
                GetBaseUri(apiClientSettings.MarketParticipantBaseUrl))
            .AddWholesaleClient(
                GetBaseUri(apiClientSettings.WholesaleBaseUrl))
            .AddWholesaleOrchestrationsClient(
                GetBaseUri(apiClientSettings.WholesaleOrchestrationsBaseUrl))
            .AddSettlementReportsClient(
                GetBaseUri(apiClientSettings.WholesaleOrchestrationSettlementReportsBaseUrl),
                GetBaseUri(apiClientSettings.WholesaleOrchestrationSettlementReportsLightBaseUrl),
                GetBaseUri(apiClientSettings.SettlementReportsAPIBaseUrl))
            .AddESettClient(
                GetBaseUri(apiClientSettings.ESettExchangeBaseUrl))
            .AddEdiWebAppClient(
                GetBaseUri(apiClientSettings.EdiB2CWebApiBaseUrl))
            .AddEdiWebAppClientV3(
                GetBaseUri(apiClientSettings.EdiB2CWebApiBaseUrl))
            .AddImbalancePricesClient(
                GetBaseUri(apiClientSettings.ImbalancePricesBaseUrl))
            .AddNotificationsClient(
                GetBaseUri(apiClientSettings.NotificationsBaseUrl))
            .AddSingleton(apiClientSettings);
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

    private static IServiceCollection AddWholesaleClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IWholesaleClient_V3, WholesaleClient_V3>(
            provider => new WholesaleClient_V3(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddWholesaleOrchestrationsClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IWholesaleOrchestrationsClient, WholesaleOrchestrationsClient>(
            provider => new WholesaleOrchestrationsClient(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddSettlementReportsClient(this IServiceCollection serviceCollection, Uri baseUri, Uri lightBaseUri, Uri apiBaseUri)
    {
        return serviceCollection.AddScoped<ISettlementReportsClient, SettlementReportsClient>(
            provider => new SettlementReportsClient(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(lightBaseUri),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(apiBaseUri)));
    }

    private static IServiceCollection AddESettClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IESettExchangeClient_V1, ESettExchangeClient_V1>(
            provider => new ESettExchangeClient_V1(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddMarketParticipantGeneratedClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IMarketParticipantClient_V1, MarketParticipantClient_V1>(
            provider => new MarketParticipantClient_V1(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddEdiWebAppClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IEdiB2CWebAppClient_V1, EdiB2CWebAppClient_V1>(
            provider => new EdiB2CWebAppClient_V1(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddEdiWebAppClientV3(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IEdiB2CWebAppClient_V3, EdiB2CWebAppClient_V3>(
            provider => new EdiB2CWebAppClient_V3(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddImbalancePricesClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<IImbalancePricesClient_V1, ImbalancePricesClient_V1>(
            provider => new ImbalancePricesClient_V1(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }

    private static IServiceCollection AddNotificationsClient(this IServiceCollection serviceCollection, Uri baseUri)
    {
        return serviceCollection.AddScoped<INotificationsClient, NotificationClient>(
            provider => new NotificationClient(
                baseUri.ToString(),
                provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(baseUri)));
    }
}
