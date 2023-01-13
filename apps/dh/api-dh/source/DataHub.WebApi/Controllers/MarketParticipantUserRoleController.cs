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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserRoleController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantUserRoleClient _client;

        public MarketParticipantUserRoleController(IMarketParticipantUserRoleClient client)
        {
            _client = client;
        }

        [HttpGet]
        [Route("Get")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAsync(Guid actorId, Guid userId)
        {
            return HandleExceptionAsync(() => _client.GetAsync(actorId, userId));
        }

        [HttpGet]
        [Route("Get")]
        public Task<ActionResult<UserRoleWithPermissionsDto>> GetUserRoleWithPermissionsAsync(Guid userRoleId)
        {
            return HandleExceptionAsync(() => _client.GetAsync(userRoleId));
        }

        [HttpGet]
        [Route("GetAll")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAllAsync()
        {
            return HandleExceptionAsync(() => _client.GetAllAsync());
        }

        [HttpGet]
        [Route("GetAssignable")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAssignableAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetAssignableAsync(actorId));
        }

        [HttpGet]
        [Route("Create")]
        public Task<ActionResult<Guid>> CreateAsync(CreateUserRoleDto userRole)
        {
            return HandleExceptionAsync(() => _client.CreateAsync(userRole));
        }
    }
}
