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

using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.Clients.EDI;
using Energinet.DataHub.WebApi.Clients.EDI.B2CWebApi.Factories;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class RequestAggregatedMeasureDataController : ControllerBase
    {
        private readonly IEdiB2CWebAppClient_V1 _ediB2CWebAppClientV1;

        public RequestAggregatedMeasureDataController(IEdiB2CWebAppClient_V1 ediB2CWebAppClientV1)
        {
            _ediB2CWebAppClientV1 = ediB2CWebAppClientV1;
        }

        /// <summary>
        /// Request Aggregated Measure Data
        /// </summary>
        [HttpPost("Request")]
        public async Task<ActionResult<SearchResult>> RequestAsync(
            string businessReason,
            string meteringPointType,
            string startDate,
            string? endDate,
            string? gridArea,
            string? energySupplierId,
            string? balanceResponsibleId,
            CancellationToken cancellationToken)
        {
            await _ediB2CWebAppClientV1.RequestAggregatedMeasureDataAsync(
                    RequestAggregatedMeasureDataMarketRequestFactory.Create(
                    businessReason,
                    meteringPointType,
                    startDate,
                    endDate,
                    gridArea,
                    energySupplierId,
                    balanceResponsibleId),
                    cancellationToken)
                .ConfigureAwait(false);
            return Ok();
        }
    }
}
