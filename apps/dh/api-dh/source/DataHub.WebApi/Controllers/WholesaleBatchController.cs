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
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Controllers.Wholesale.Dto;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using Microsoft.AspNetCore.Mvc;
using BatchRequestDto = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchRequestDto;
using BatchSearchDtoV2 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchSearchDtoV2;
using ProcessStepResultDto = Energinet.DataHub.Wholesale.Contracts.ProcessStepResultDto;
using TimeSeriesTypeV3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.TimeSeriesType;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient _client;
        private readonly IWholesaleClient_V3 _clientV3;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public WholesaleBatchController(IWholesaleClient client, IMarketParticipantClient marketParticipantClient, IWholesaleClient_V3 clientV3)
        {
            _client = client;
            _marketParticipantClient = marketParticipantClient;
            _clientV3 = clientV3;
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
        public async Task<ActionResult<IEnumerable<BatchDto>>> SearchAsync(BatchSearchDtoV2 batchSearchDto)
        {
            var gridAreas = new List<GridAreaDto>();
            var batchesWithGridAreasWithNames = new List<BatchDto>();

            var batches = (await _clientV3.SearchBatchesAsync(batchSearchDto).ConfigureAwait(false)).ToList();

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
            var batch = await _clientV3.GetBatchAsync(batchId);
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
        [HttpPost("ProcessStepResult")]
        public async Task<ActionResult<ProcessStepResultDto>> GetAsync(ProcessStepResultRequestDtoV3 processStepResultRequestDto)
        {
            var dto = await _clientV3.GetProcessStepResultAsync(
                processStepResultRequestDto.BatchId,
                processStepResultRequestDto.GridAreaCode,
                (TimeSeriesTypeV3)processStepResultRequestDto.TimeSeriesType,
                processStepResultRequestDto.EnergySupplierGln,
                processStepResultRequestDto.BalanceResponsiblePartyGln).ConfigureAwait(false);
            return Ok(dto);
        }

        /// <summary>
        /// Get a list of actors.
        /// </summary>
        [HttpPost("Actors")]
        public async Task<ActionResult<WholesaleActorDto[]>> GetAsync(ProcessStepActorsRequest processStepActorsRequestDto)
        {
            var dto = await _client.GetProcessStepActorsAsync(processStepActorsRequestDto).ConfigureAwait(false);
            return Ok(dto);
        }
    }
}
