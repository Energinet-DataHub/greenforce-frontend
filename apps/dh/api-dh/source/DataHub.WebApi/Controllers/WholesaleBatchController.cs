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
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_3;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_4;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Controllers.Wholesale.Dto;
using Microsoft.AspNetCore.Mvc;
using ActorDto_V3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ActorDto;
using BatchRequestDto_V2 = Energinet.DataHub.WebApi.Clients.Wholesale.v2.BatchRequestDto;
using BatchSearchDtoV2_V2_1 = Energinet.DataHub.WebApi.Clients.Wholesale.v2_1.BatchSearchDtoV2;
using ProcessStepResultDto_V2 = Energinet.DataHub.WebApi.Clients.Wholesale.v2.ProcessStepResultDto;
using ProcessStepResultDto_V3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessStepResultDto;
using Stream = System.IO.Stream;
using TimeSeriesType_V3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.TimeSeriesType;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient_V2 _clientV2;
        private readonly IWholesaleClient_V2_1 _clientV2_1;
        private readonly IWholesaleClient_V2_3 _clientV2_3;
        private readonly IWholesaleClient_V3 _clientV3;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public WholesaleBatchController(
            IMarketParticipantClient marketParticipantClient,
            IWholesaleClient_V2 clientV2,
            IWholesaleClient_V2_1 clientV21,
            IWholesaleClient_V3 clientV3,
            IWholesaleClient_V2_3 clientV23)
        {
            _marketParticipantClient = marketParticipantClient;
            _clientV2 = clientV2;
            _clientV2_1 = clientV21;
            _clientV3 = clientV3;
            _clientV2_3 = clientV23;
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(BatchRequestDto_V2 batchRequestDto)
        {
            await _clientV2.BatchPOSTAsync(batchRequestDto).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("Search")]
        public async Task<ActionResult<IEnumerable<BatchDto_V2_1>>> SearchAsync(BatchSearchDtoV2_V2_1 batchSearchDto)
        {
            var gridAreas = new List<GridAreaDto>();
            var batchesWithGridAreasWithNames = new List<BatchDto_V2_1>();
            var batches = (await _clientV2_1.SearchAsync(batchSearchDto).ConfigureAwait(false)).ToList();

            if (batches.Any())
            {
                gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();
            }

            foreach (var batch in batches)
            {
                var gridAreaDtos = gridAreas.Where(x => batch.GridAreaCodes.Contains(x.Code));

                batchesWithGridAreasWithNames.Add(new BatchDto_V2_1(
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
            var stream = await _clientV2_3.SettlementReportAsync(batchId);
            return File(stream, MediaTypeNames.Application.Zip);
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpGet("Batch")]
        public async Task<ActionResult<BatchDto_V2>> GetBatchAsync(Guid batchId)
        {
            var batch = await _clientV2.BatchGETAsync(batchId);
            var gridAreas = (await _marketParticipantClient.GetGridAreasAsync().ConfigureAwait(false)).ToList();

            var gridAreaDtos = gridAreas.Where(x => batch!.GridAreaCodes.Contains(x.Code));

            return new BatchDto_V2(
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
        public async Task<ActionResult<ProcessStepResultDto_V3>> GetAsync(
            ProcessStepResultRequestDtoV3 processStepResultRequestDto)
        {
            var dto = await _clientV3.TimeSeriesTypesAsync(
                processStepResultRequestDto.BatchId,
                processStepResultRequestDto.GridAreaCode,
                (TimeSeriesType_V3)processStepResultRequestDto.TimeSeriesType,
                processStepResultRequestDto.EnergySupplierGln,
                processStepResultRequestDto.BalanceResponsiblePartyGln,
                "3").ConfigureAwait(false);
            return Ok(dto);
        }

        /// <summary>
        /// Get a list of actors.
        /// </summary>
        [HttpPost("Actors")]
        public async Task<ActionResult<ActorDto_V3[]>> GetAsync(ProcessStepActorsRequest processStepActorsRequestDto)
        {
            var batchId = processStepActorsRequestDto.BatchId;
            var gridAreaCode = processStepActorsRequestDto.GridAreaCode;
            var type = (TimeSeriesType_V3)processStepActorsRequestDto.Type;
            var marketRole = processStepActorsRequestDto.MarketRole;
            if (marketRole == MarketRole._0)
            {
                var energySupplierDto = await _clientV3.EnergySuppliersAsync(batchId, gridAreaCode, type)
                    .ConfigureAwait(false);
                return Ok(energySupplierDto);
            }

            var balanceResponsiblePartyDto =
                await _clientV3.BalanceResponsiblePartiesAsync(batchId, gridAreaCode, type)
                    .ConfigureAwait(false);
            return Ok(balanceResponsiblePartyDto);
        }
    }
}
