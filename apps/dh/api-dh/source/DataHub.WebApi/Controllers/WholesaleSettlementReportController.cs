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
using Energinet.DataHub.Wholesale.Client;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public sealed class WholesaleSettlementReportController : ControllerBase
    {
        private readonly IWholesaleClientV3 _client;

        public WholesaleSettlementReportController(IWholesaleClientV3 client)
        {
            _client = client;
        }

        [HttpGet]
        public async Task<ActionResult<Stream>> GetAsync(Guid batchId, string gridAreaCode)
        {
            return File(
                await _client.GetSettlementReportAsStreamAsync(batchId, gridAreaCode).ConfigureAwait(false),
                MediaTypeNames.Application.Zip);
        }
    }
}
