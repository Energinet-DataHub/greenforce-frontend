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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Microsoft.AspNetCore.Mvc;
using BatchDto = Energinet.DataHub.WebApi.Controllers.Wholesale.Dto.BatchDto;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient_V3 _client;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public WholesaleBatchController(IMarketParticipantClient marketParticipantClient, IWholesaleClient_V3 client)
        {
            _marketParticipantClient = marketParticipantClient;
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

            await _client.CreateBatchAsync(batchRequestDtoNew).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        /// <param name="batchId"></param>
        [HttpGet("{batchId}")]
        public async Task<ActionResult<BatchDto>> GetBatchAsync([FromRoute]Guid batchId)
        {
            var batch = await _client.GetBatchAsync(batchId);
            var gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();

            var gridAreaDtos = gridAreas.Where(x => batch!.GridAreaCodes.Contains(x.Code));

            return new BatchDto(
                batch.BatchId,
                batch.PeriodStart,
                batch.PeriodEnd,
                batch.ExecutionTimeStart,
                batch.ExecutionTimeEnd,
                batch.ExecutionState,
                batch.AreSettlementReportsCreated,
                gridAreaDtos.ToArray());
        }

        /// <summary>
        /// Get batches
        /// </summary>
        /// <param name="gridAreaCodes"></param>
        /// <param name="executionState"></param>
        /// <param name="minExecutionTime"></param>
        /// <param name="maxExecutionTime"></param>
        /// <param name="periodStart"></param>
        /// <param name="periodEnd"></param>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BatchDto>>> SearchAsync(
            [FromQuery]IEnumerable<string>? gridAreaCodes,
            [FromQuery]BatchState? executionState,
            [FromQuery]DateTimeOffset? minExecutionTime,
            [FromQuery]DateTimeOffset? maxExecutionTime,
            [FromQuery]DateTimeOffset? periodStart,
            [FromQuery]DateTimeOffset? periodEnd)
        {
            var gridAreas = new List<GridAreaDto>();
            var batchesWithGridAreasWithNames = new List<BatchDto>();

            var batches = await _client.SearchBatchesAsync(gridAreaCodes, executionState, minExecutionTime, maxExecutionTime, periodStart, periodEnd).ConfigureAwait(false);

            if (batches.Any())
            {
                gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();
            }

            foreach (var batch in batches)
            {
                var gridAreaDtos = gridAreas.Where(x => batch.GridAreaCodes.Contains(x.Code));

                batchesWithGridAreasWithNames.Add(new BatchDto(
                    batch.BatchId,
                    batch.PeriodStart,
                    batch.PeriodEnd,
                    batch.ExecutionTimeStart,
                    batch.ExecutionTimeEnd,
                    batch.ExecutionState,
                    batch.AreSettlementReportsCreated,
                    gridAreaDtos.ToArray()));
            }

            return Ok(batchesWithGridAreasWithNames);
        }

        /// <summary>
        /// Get a processStepResult.
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="gridAreaCode"></param>
        /// <param name="timeSeriesType"></param>
        /// <param name="energySupplierGln"></param>
        /// <param name="balanceResponsiblePartyGln"></param>
        [HttpGet("{batchId}/processes/{gridAreaCode}/time-series-types/{timeSeriesType}")]
        public async Task<ActionResult<ProcessStepResultDto>> GetAsync(
            [FromRoute]Guid batchId,
            [FromRoute]string gridAreaCode,
            [FromRoute]TimeSeriesType timeSeriesType,
            [FromQuery] string? energySupplierGln,
            [FromQuery] string? balanceResponsiblePartyGln)
        {
            var dto = await _client.GetProcessStepResultAsync(
                batchId,
                gridAreaCode,
                timeSeriesType,
                energySupplierGln,
                balanceResponsiblePartyGln).ConfigureAwait(false);
            return Ok(dto);
        }
    }
}
