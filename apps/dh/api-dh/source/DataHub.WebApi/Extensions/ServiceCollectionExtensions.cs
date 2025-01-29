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

using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

namespace Energinet.DataHub.WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddClient<TClient>(
        this IServiceCollection serviceCollection,
        Func<SubSystemBaseUrls, string> getBaseUrl,
        Func<string, HttpClient, TClient> createClient)
        where TClient : class =>
        serviceCollection.AddScoped(provider =>
        {
            var baseUrls = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>();
            var baseUrl = getBaseUrl(baseUrls.Value);
            var client = provider
                .GetRequiredService<AuthorizedHttpClientFactory>()
                .CreateClient(GetBaseUri(baseUrl));

            return createClient(baseUrl, client);
        });

    private static Uri GetBaseUri(string baseUrl) =>
        Uri.TryCreate(baseUrl, UriKind.Absolute, out var url)
            ? url
            : new Uri("https://empty");
}
