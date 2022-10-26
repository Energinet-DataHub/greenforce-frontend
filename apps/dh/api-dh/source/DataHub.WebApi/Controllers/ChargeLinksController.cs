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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Clients.Charges;
using Energinet.DataHub.Charges.Contracts.ChargeLink;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class ChargeLinksController : ControllerBase
    {
        private readonly IChargesClient _chargesClient;

        public ChargeLinksController(IChargesClient chargesClient)
        {
            _chargesClient = chargesClient;
        }

        /// <summary>
        /// Gets all charge links data for a given metering point.
        /// </summary>
        /// <param name="meteringPointId"></param>
        /// <returns>A collection of Charge Link DTOs if found</returns>
        /// <response code="200">Returns the charge links found for the given metering point id</response>
        /// <response code="400">When no metering point id is provided</response>
        /// <response code="404">When no charge links found</response>
        [HttpGet]
        public async Task<ActionResult<IList<ChargeLinkV1Dto>>> GetAsync(string meteringPointId)
        {
            var result = await _chargesClient.GetChargeLinksAsync(meteringPointId);

            return result.Any() ? Ok(result) : NotFound();
        }
    }
}
