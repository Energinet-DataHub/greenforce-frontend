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
using Energinet.Charges.Contracts.Charge;
using Energinet.DataHub.Charges.Clients.Charges;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class ChargesController : ControllerBase
    {
        private readonly IChargesClient _chargesClient;

        public ChargesController(IChargesClient chargesClient)
        {
            _chargesClient = chargesClient;
        }

        [HttpGet]
        public async Task<ActionResult<IList<ChargeV1Dto>>> GetAsync()
        {
            var result = await _chargesClient.GetChargesAsync();

            return result.Any() ? Ok(result) : NotFound();
        }
    }
}
