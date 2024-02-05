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
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public sealed class WholesaleSettlementReportController : ControllerBase
    {
        private readonly IWholesaleClient_V3 _client;

        public WholesaleSettlementReportController(IWholesaleClient_V3 client)
        {
            _client = client;
        }

        [HttpGet]
        [Produces("application/zip")]
        public async Task<ActionResult<Stream>> GetAsync(Guid calculationId, string gridAreaCode)
        {
            var fileResponse = await _client.GetSettlementReportAsStreamAsync(calculationId, gridAreaCode).ConfigureAwait(false);
            return File(
                fileResponse.Stream,
                MediaTypeNames.Application.Zip);
        }

        [HttpGet("Download")]
        [Produces("application/zip")]
        public async Task<ActionResult<Stream>> DownloadAsync(
            [FromQuery] string[] gridAreaCodes,
            [FromQuery] CalculationType calculationType,
            [FromQuery] DateTimeOffset periodStart,
            [FromQuery] DateTimeOffset periodEnd,
            [FromQuery] string? energySupplier,
            [FromQuery] string? csvLanguage)
        {
            var fileResponse = await _client
                .DownloadAsync(gridAreaCodes, calculationType, periodStart, periodEnd, energySupplier, csvLanguage)
                .ConfigureAwait(false);

            var fileName = "SettlementReport.zip";

            if (fileResponse.Headers.TryGetValue("Content-Disposition", out var values))
            {
                var contentDisposition = new ContentDisposition(values.First());
                fileName = contentDisposition.FileName ?? fileName;
            }

            return File(fileResponse.Stream, MediaTypeNames.Application.Zip, fileName);
        }
    }
}
