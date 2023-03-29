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
using Energinet.DataHub.Wholesale.Client;
using Microsoft.AspNetCore.Mvc;
using BatchDto = Energinet.DataHub.WebApi.Controllers.Wholesale.Dto.BatchDto;

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
            // batchRequestDto = batchRequestDto with { EndDate = batchRequestDto.EndDate.AddMilliseconds(1) };
            // var periodEnd = Instant.FromDateTimeOffset(batchRequestDto.EndDate);
            // if (new ZonedDateTime(periodEnd, _dateTimeZone).TimeOfDay != LocalTime.Midnight)
            //     throw new BusinessValidationException($"The period end '{periodEnd.ToString()}' must be 1 ms before midnight.");
            await _clientV3.CreateBatchAsync(batchRequestDto).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("Search")]
        public async Task<ActionResult<IEnumerable<BatchDto>>> SearchAsync(
            IEnumerable<string>? gridAreaCodes,
            BatchState? executionState,
            DateTimeOffset? minExecutionTime,
            DateTimeOffset? maxExecutionTime,
            DateTimeOffset? periodStart,
            DateTimeOffset? periodEnd)
        {
            var gridAreas = new List<GridAreaDto>();
            var batchesWithGridAreasWithNames = new List<BatchDto>();

            var batches = (await _clientV3.SearchBatchesAsync(gridAreaCodes, executionState, minExecutionTime, maxExecutionTime, periodStart, periodEnd).ConfigureAwait(false)).ToList();

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
        /// Get a batch.
        /// </summary>
        [HttpGet("Batch")]
        public async Task<ActionResult<BatchDto>> GetBatchAsync(Guid batchId)
        {
            var batch = await _clientV3.GetBatchAsync(batchId);
            var gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();

            var gridAreaDtos = gridAreas.Where(x => batch!.GridAreaCodes.Contains(x.Code));

            return new BatchDto(
                batch!.BatchId,
                batch.PeriodStart,
                batch.PeriodEnd,
                batch.ExecutionTimeStart,
                batch.ExecutionTimeEnd,
                batch.ExecutionState,
                batch.AreSettlementReportsCreated,
                gridAreaDtos.ToArray());
        }

        /// <summary>
        /// Get a processStepResult.
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="gridAreaCode"></param>
        /// <param name="timeSeriesType"></param>
        /// <param name="energySupplierGln"></param>
        /// <param name="balanceResponsiblePartyGln"></param>
        [HttpPost("ProcessStepResult")]
        public async Task<ActionResult<ProcessStepResultDto>> GetAsync(
            [FromRoute]Guid batchId,
            [FromRoute]string gridAreaCode,
            [FromRoute]TimeSeriesType timeSeriesType,
            [FromQuery] string energySupplierGln,
            [FromQuery] string balanceResponsiblePartyGln)
        {
            var dto = await _clientV3.GetProcessStepResultAsync(
                batchId,
                gridAreaCode,
                timeSeriesType,
                energySupplierGln,
                balanceResponsiblePartyGln).ConfigureAwait(false);
            return Ok(dto);
        }

        // /// <summary>
        // /// Get a list of actors.
        // /// </summary>
        // [HttpPost("Actors")]
        // public async Task<ActionResult<ActorDto[]>> GetAsync(ProcessStepActorsRequest processStepActorsRequestDto)
        // {
        //     var dto = await _client.GetProcessStepActorsAsync(processStepActorsRequestDto).ConfigureAwait(false);
        //     return Ok(dto);
        // }
    }
}
