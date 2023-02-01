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
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.Wholesale.Dto;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient _client;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public WholesaleBatchController(IWholesaleClient client, IMarketParticipantClient marketParticipantClient)
        {
            _client = client;
            _marketParticipantClient = marketParticipantClient;
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(BatchRequestDto batchRequestDto)
        {
            await _client.CreateBatchAsync(batchRequestDto).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("Search")]
        public async Task<ActionResult<IEnumerable<BatchDto>>> SearchAsync(BatchSearchDto batchSearchDto)
        {
            var gridAreas = new List<GridAreaDto>();
            var batchesWithGridAreasWithNames = new List<BatchDto>();

            var batches = (await _client.GetBatchesAsync(batchSearchDto).ConfigureAwait(false)).ToList();

            if (batches.Any())
            {
                gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();
            }

            foreach (var batch in batches)
            {
                var gridAreaDtos = gridAreas.Where(x => batch.GridAreaCodes.Contains(x.Code));

                batchesWithGridAreasWithNames.Add(new BatchDto(
                    batch.BatchNumber,
                    batch.PeriodStart,
                    batch.PeriodEnd,
                    batch.ExecutionTimeStart,
                    batch.ExecutionTimeEnd,
                    batch.ExecutionState,
                    batch.IsBasisDataDownloadAvailable,
                    gridAreaDtos.ToArray()));
            }

            return Ok(batchesWithGridAreasWithNames);
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

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpGet("Batch")]
        public async Task<ActionResult<BatchDto>> GetBatchAsync(Guid batchId)
        {
            var batch = await _client.GetBatchAsync(batchId);
            var gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();

            var gridAreaDtos = gridAreas.Where(x => batch!.GridAreaCodes.Contains(x.Code));

            return new BatchDto(
                batch!.BatchNumber,
                batch.PeriodStart,
                batch.PeriodEnd,
                batch.ExecutionTimeStart,
                batch.ExecutionTimeEnd,
                batch.ExecutionState,
                batch.IsBasisDataDownloadAvailable,
                gridAreaDtos.ToArray());
        }

        /// <summary>
        /// Get a processStepResult.
        /// </summary>
        [HttpPost("ProcessResult")]
        public async Task<ActionResult<ProcessStepResultDto>> GetAsync(ProcessStepResultRequestDtoV2 processResultRequestDto)
        {
            var dto = await _client.GetProcessStepResultAsync(processResultRequestDto).ConfigureAwait(false);
            return Ok(dto);
        }

        /// <summary>
        /// Get a list of actors.
        /// </summary>
        [HttpPost("Actors")]
        public async Task<ActionResult<WholesaleActorDto[]>> GetAsync(ProcessStepActorsRequest batchActorsRequestDto)
        {
            var dto = await _client.GetProcessStepActorsAsync(batchActorsRequestDto).ConfigureAwait(false);
            return Ok(dto);
        }
    }
}
