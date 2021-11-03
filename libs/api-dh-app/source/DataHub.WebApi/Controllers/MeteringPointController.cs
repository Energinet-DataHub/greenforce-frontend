// Copyright 2021 Energinet DataHub A/S
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

using System.Threading.Tasks;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MeteringPointController : ControllerBase
    {
        private readonly IMeteringPointClient _meteringPointClient;

        public MeteringPointController(IMeteringPointClient meteringPointClient)
        {
            _meteringPointClient = meteringPointClient;
        }

        /// <summary>
        /// Get a metering point by GSRN number.
        /// </summary>
        /// <param name="gsrnNumber">Public identifier of a metering point.</param>
        /// <returns>A metering point if found.</returns>
        /// <response code="200">Returns a metering point if found.</response>
        /// <response code="404">Returned if not found.</response>
        [HttpGet("GetByGsrn")]
        public async Task<ActionResult<MeteringPointDto>> GetByGsrnAsync(string gsrnNumber)
        {
            var result = await _meteringPointClient.GetMeteringPointByGsrnAsync(gsrnNumber);

            return result == null ? NotFound() : Ok(result);
        }
    }
}
