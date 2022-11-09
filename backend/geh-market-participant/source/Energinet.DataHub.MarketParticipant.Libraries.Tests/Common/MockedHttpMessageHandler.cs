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
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Energinet.DataHub.MarketParticipant.Libraries.Tests.Common
{
    internal sealed class MockedHttpMessageHandler : HttpMessageHandler
    {
        private readonly HttpResponseMessage _responseMessage;

        public MockedHttpMessageHandler(string stringContent)
        {
            _responseMessage = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(stringContent) };
        }

        public MockedHttpMessageHandler(HttpStatusCode statusCode)
        {
            _responseMessage = new HttpResponseMessage(statusCode);
        }

        public HttpClient CreateHttpClient()
        {
            return new HttpClient(this) { BaseAddress = new Uri("https://localhost") };
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return Task.FromResult(_responseMessage);
        }
    }
}
