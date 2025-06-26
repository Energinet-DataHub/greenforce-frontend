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

using Energinet.DataHub.WebApi.Clients.Dh2Bridge;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.Import;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Clients.Notifications;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

namespace Energinet.DataHub.WebApi.Registration;

public static class DomainRegistrationExtensions
{
    public static IServiceCollection AddDomainClients(this IServiceCollection services)
    {
        return services
            .AddHttpClient()
            .AddHttpContextAccessor()
            .AddAuthorizedHttpClient()
            .AddClient<IESettExchangeClient_V1>(baseUrls => baseUrls.ESettExchangeBaseUrl, (baseUrl, client) => new ESettExchangeClient_V1(baseUrl, client))
            .AddClient<INotificationsClient>(baseUrls => baseUrls.NotificationsBaseUrl, (_, client) => new NotificationsClient(client))
            .AddClient<IDh2BridgeClient>(baseUrls => baseUrls.Dh2BridgeBaseUrl, (_, client) => new Dh2BridgeClient(client))
            .AddClient<IElectricityMarketImportClient>(baseUrls => baseUrls.ElectricityMarketBaseUrl, (_, client) => new ElectricityMarketImportClient(client));
    }

    private static IServiceCollection AddAuthorizedHttpClient(this IServiceCollection serviceCollection)
    {
        return serviceCollection
            .AddSingleton(provider => new AuthorizedHttpClientFactory(
                provider.GetRequiredService<IHttpClientFactory>(),
                () => (string?)provider.GetRequiredService<IHttpContextAccessor>().HttpContext!.Request.Headers["Authorization"] ?? string.Empty,
                provider.GetRequiredService<IOptions<SubSystemBaseUrls>>()));
    }
}
