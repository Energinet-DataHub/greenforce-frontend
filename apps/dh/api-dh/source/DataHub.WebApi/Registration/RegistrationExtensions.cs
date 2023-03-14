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
using System.Linq;
using System.Net.Http;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_3;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class RegistrationExtensions
    {
        public static IServiceCollection AddWholesaleClient(
            this IServiceCollection serviceCollection,
            Uri wholesaleBaseUri,
            Func<IServiceProvider, string> authorizationHeaderProvider)
        {
            if (serviceCollection.All(x => x.ServiceType != typeof(IHttpClientFactory)))
            {
                serviceCollection.AddHttpClient();
            }

            serviceCollection.AddSingleton(provider =>
            {
                var factory = provider.GetRequiredService<IHttpClientFactory>();
                return new AuthorizedHttpClientFactory(factory, () => authorizationHeaderProvider(provider));
            });

            serviceCollection.AddScoped<IWholesaleClient_V2, WholesaleClient_V2>(provider =>
            {
                var httpClientFactory = provider.GetRequiredService<AuthorizedHttpClientFactory>();
                var httpClient = httpClientFactory.CreateClient(wholesaleBaseUri);
                return new WholesaleClient_V2(wholesaleBaseUri.ToString(), httpClient);
            });

            serviceCollection.AddScoped<IWholesaleClient_V2_3, WholesaleClient_V2_3>(provider =>
            {
                var httpClientFactory = provider.GetRequiredService<AuthorizedHttpClientFactory>();
                var httpClient = httpClientFactory.CreateClient(wholesaleBaseUri);
                return new WholesaleClient_V2_3(wholesaleBaseUri.ToString(), httpClient);
            });

            serviceCollection.AddScoped<IWholesaleClient_V3, IWholesaleClient_V3>(provider =>
            {
                var httpClientFactory = provider.GetRequiredService<AuthorizedHttpClientFactory>();
                var httpClient = httpClientFactory.CreateClient(wholesaleBaseUri);
                return new WholesaleClient_V3(wholesaleBaseUri.ToString(), httpClient);
            });

            return serviceCollection;
        }
    }
}
