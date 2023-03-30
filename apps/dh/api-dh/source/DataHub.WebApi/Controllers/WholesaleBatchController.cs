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
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.Wholesale.Client;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient_V3 _clientV3;
        private readonly IWholesaleClient _client;

        public WholesaleBatchController(IWholesaleClient_V3 clientV3, IWholesaleClient client)
        {
            _clientV3 = clientV3;
            _client = client;
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        /// <param name="batchRequestDto"></param>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(BatchRequestDto batchRequestDto)
        {
            // hacks
            var dateTimeOffset = batchRequestDto.EndDate.AddMilliseconds(1);
            var batchRequestDtoNew = new BatchRequestDto(
                dateTimeOffset,
                batchRequestDto.GridAreaCodes,
                batchRequestDto.ProcessType,
                batchRequestDto.StartDate);

            await _clientV3.CreateBatchAsync(batchRequestDtoNew).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpGet("ZippedBasisDataStream")]
        [Produces("application/zip")]
        public async Task<ActionResult<Stream>> GetAsync(Guid batchId)
        {
            var stream = await _client.GetZippedBasisDataStreamAsync(batchId);
            return File(stream, MediaTypeNames.Application.Zip);
        }
    }
}
