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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient _client;

        public MarketParticipantUserController(IMarketParticipantClient client)
        {
            _client = client;
        }

        /// <summary>
        ///     Retrieves actors associated with the users external actor token.
        /// </summary>
        [HttpGet]
        [Route("GetUserActors")]
        public Task<ActionResult<GetAssociatedUserActorsResponseDto>> GetUserActorsAsync()
        {
            var externalToken = HttpContext.Request.Headers["Authorization"].Single();
            externalToken = externalToken.Replace("Bearer ", string.Empty);
            return HandleExceptionAsync(() => _client.GetUserActorsAsync(externalToken));
        }

        /// <summary>
        ///     Retrieves actors associated with the userId specified, ensures only actors you are allowed to see are returned.
        /// </summary>
        [HttpGet]
        [Route("GetUserActorsByUserId")]
        public Task<ActionResult<GetAssociatedUserActorsResponseDto>> GetUserActorsByUserIdAsync(Guid userId)
        {
            return HandleExceptionAsync(() => _client.GetUserActorsAsync(userId));
        }
    }
}
