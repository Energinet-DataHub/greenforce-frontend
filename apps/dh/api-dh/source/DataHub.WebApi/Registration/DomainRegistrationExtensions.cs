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
using Energinet.DataHub.Charges.Clients.Registration.Charges.ServiceCollectionExtensions;
using Energinet.DataHub.MarketParticipant.Client.Extensions;
using Energinet.DataHub.MessageArchive.Client.Extensions;
using Energinet.DataHub.MeteringPoints.Client.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class DomainRegistrationExtensions
    {
        public static IServiceCollection AddDomainClients(this IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            services
                .AddChargesClient(
                    GetBaseUri(apiClientSettings.ChargesBaseUrl))
                .AddMeteringPointClient(
                    GetBaseUri(apiClientSettings.MeteringPointBaseUrl))
                .AddMessageArchiveClient(
                    GetBaseUri(apiClientSettings.MessageArchiveBaseUrl))
                .AddMarketParticipantClient(
                    GetBaseUri(apiClientSettings.MarketParticipantBaseUrl));

            services.AddSingleton(apiClientSettings);

            return services;
        }

        private static Uri GetBaseUri(string baseUrl)
        {
            var emptyUrl = "https://empty";
            var baseUri = Uri.TryCreate(baseUrl, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);
            return baseUri;
        }

        private static string AuthorizationHeaderProvider(IServiceProvider serviceProvider)
        {
            var httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            return (string?)httpContextAccessor.HttpContext!.Request.Headers["Authorization"] ?? string.Empty;
        }
    }
}
