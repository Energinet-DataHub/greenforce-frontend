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
using System.Net.Http;
using Energinet.DataHub.Charges.Clients.Registration.Charges.ServiceCollectionExtensions;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.MarketParticipant.Client.Extensions;
using Energinet.DataHub.MeteringPoints.Client.Extensions;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

// ReSharper disable UnusedMethodReturnValue.Global
// ReSharper disable UnusedMethodReturnValue.Local
namespace Energinet.DataHub.WebApi.Registration
{
    public static class DomainRegistrationExtensions
    {
        public static IServiceCollection AddDomainClients(this IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            return services
                .AddHttpClient()
                .AddHttpContextAccessor()
                .AddAuthorizedHttpClient()
                .RegisterEDIServices(apiClientSettings.MessageArchiveBaseUrl)
                .AddChargesClient(
                    GetBaseUri(apiClientSettings.ChargesBaseUrl))
                .AddMeteringPointClient(
                    GetBaseUri(apiClientSettings.MeteringPointBaseUrl))
                .AddMarketParticipantClient(
                    GetBaseUri(apiClientSettings.MarketParticipantBaseUrl))
                .AddMarketParticipantGeneratedClient(
                    GetBaseUri(apiClientSettings.MarketParticipantBaseUrl))
                .AddWholesaleClient(
                    GetBaseUri(apiClientSettings.WholesaleBaseUrl))
                .AddESettClient(
                    GetBaseUri(apiClientSettings.ESettExchangeBaseUrl))
                .AddEdiWebAppClient(
                    GetBaseUri(apiClientSettings.EdiB2CWebApiBaseUrl))
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

        private static IServiceCollection AddWholesaleClient(this IServiceCollection serviceCollection, Uri wholesaleBaseUri)
        {
            return serviceCollection.AddScoped<IWholesaleClient_V3, WholesaleClient_V3>(
                provider => new WholesaleClient_V3(
                    wholesaleBaseUri.ToString(),
                    provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(wholesaleBaseUri)));
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
    }
}
