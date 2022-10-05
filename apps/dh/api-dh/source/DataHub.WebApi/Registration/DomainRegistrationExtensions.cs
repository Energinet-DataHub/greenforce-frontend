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
using Energinet.DataHub.Wholesale.Client;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class DomainRegistrationExtensions
    {
        public static void AddDomainClients(this IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            AddMeteringPointClient(services, apiClientSettings);
            AddChargesClient(services, apiClientSettings);
            AddMessageArchiveClient(services, apiClientSettings);
            AddMarketParticipantClient(services, apiClientSettings);
            AddWholesaleClient(services, apiClientSettings);

            services.AddSingleton(apiClientSettings);
        }

        private static void AddChargesClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            var baseUri = GetBaseUri(apiClientSettings.ChargesBaseUrl);
            services.AddChargesClient(baseUri);
        }

        private static void AddMeteringPointClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            var baseUri = GetBaseUri(apiClientSettings.MeteringPointBaseUrl);
            services.AddMeteringPointClient(baseUri);
        }

        private static void AddMessageArchiveClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            var baseUri = GetBaseUri(apiClientSettings.MessageArchiveBaseUrl);
            services.AddMessageArchiveClient(baseUri);
        }

        private static void AddMarketParticipantClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            var baseUri = GetBaseUri(apiClientSettings.MarketParticipantBaseUrl);
            services.AddMarketParticipantClient(baseUri);
        }

        private static void AddWholesaleClient(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
            var baseUri = GetBaseUri(apiClientSettings.WholesaleBaseUrl);
            services.AddWholesaleClient(baseUri, AuthorizationHeaderProvider);
        }

        private static Uri GetBaseUri(string baseUri)
        {
            var emptyUrl = "https://empty";
            var messageArchiveBaseUrl = Uri.TryCreate(baseUri, UriKind.Absolute, out var url)
                ? url
                : new Uri(emptyUrl);
            return messageArchiveBaseUrl;
        }

        private static string AuthorizationHeaderProvider(IServiceProvider serviceProvider)
        {
            var httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            return httpContextAccessor.HttpContext!.Request.Headers["Authorization"];
        }
    }
}
