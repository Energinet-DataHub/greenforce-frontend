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
using System.Text.Json;
using System.Text.Json.Serialization;
using Flurl.Http;
using Flurl.Http.Configuration;
using Flurl.Serialization.TextJson;
using Microsoft.AspNetCore.Http;

namespace Energinet.DataHub.MarketParticipant.Client
{
    public sealed class MarketParticipantClientFactory
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IFlurlClientFactory _flurlClientFactory;

        public MarketParticipantClientFactory(IHttpContextAccessor httpContextAccessor, IFlurlClientFactory flurlClientFactory)
        {
            _flurlClientFactory = flurlClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public IMarketParticipantClient CreateClient(Uri baseUrl)
        {
            var httpClient = _flurlClientFactory.Get(baseUrl);
            ConfigureClient(httpClient);
            return new MarketParticipantClient(httpClient);
        }

        private void ConfigureClient(IFlurlClient client)
        {
            var jsonSettings = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            jsonSettings.Converters.Add(new JsonStringEnumConverter());
            client.Configure(settings => settings.WithTextJsonSerializer(jsonSettings));
            SetAuthorizationHeader(client);
        }

        private string GetAuthorizationHeaderValue()
        {
            return _httpContextAccessor.HttpContext.Request.Headers
                .Where(x => x.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase))
                .Select(x => x.Value.ToString())
                .Single();
        }

        private void SetAuthorizationHeader(IFlurlClient httpClient)
        {
            var authHeaderValue = GetAuthorizationHeaderValue();
            httpClient.WithHeader("Authorization", authHeaderValue);
        }
    }
}
