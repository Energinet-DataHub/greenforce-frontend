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
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers.Wholesale
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public WholesaleBatchController(HttpClientFactory httpClientFactory, ApiClientSettings apiSettings)
        {
            var baseUri = new Uri(apiSettings.WholesaleBaseUrl);
            _httpClient = httpClientFactory.CreateClient(baseUri);
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(WholesaleBatchRequestDto wholesaleBatchRequestDto)
        {
            var response = await _httpClient
                .PostAsJsonAsync("v1/Batch", wholesaleBatchRequestDto)
                .ConfigureAwait(false);

            // Forward response status from domain to frontend
            return StatusCode((int)response.StatusCode);
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("search")]
        public async Task<IEnumerable<WholesaleSearchBatchResponseDto>> PostAsync(WholesaleSearchBatchDto wholesaleSearchBatchDto)
        {
            var response = await _httpClient
                .PostAsJsonAsync("v1/SearchBatch", wholesaleSearchBatchDto)
                .ConfigureAwait(false);

            // Forward response status from domain to frontend
            return new List<WholesaleSearchBatchResponseDto>();
        }
    }
}
