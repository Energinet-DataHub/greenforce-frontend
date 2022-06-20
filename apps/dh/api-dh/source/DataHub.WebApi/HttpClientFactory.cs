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
using Microsoft.AspNetCore.Http;

namespace Energinet.DataHub.WebApi
{
    /// <summary>
    /// Factory to create <see cref="HttpClient"/>s with authentication headers.
    /// </summary>
    public class HttpClientFactory
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpClientFactory(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public HttpClient CreateClient(Uri baseUrl)
        {
            var httpClient = _httpClientFactory.CreateClient();
            SetAuthorizationHeader(httpClient);
            httpClient.BaseAddress = baseUrl;
            return httpClient;
        }

        private void SetAuthorizationHeader(HttpClient httpClient)
        {
            var authHeaderValue = GetAuthorizationHeaderValue();
            httpClient.DefaultRequestHeaders.Add("Authorization", authHeaderValue);
        }

        private string GetAuthorizationHeaderValue()
        {
            return _httpContextAccessor.HttpContext!.Request.Headers
                .Where(x => x.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase))
                .Select(x => x.Value.ToString())
                .Single();
        }
    }
}
