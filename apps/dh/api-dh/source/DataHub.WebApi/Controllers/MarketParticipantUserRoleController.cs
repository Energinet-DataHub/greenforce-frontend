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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserRoleController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient_V1 _client;

        public MarketParticipantUserRoleController(IMarketParticipantClient_V1 client)
        {
            _client = client;
        }

        [HttpGet]
        [Route("Get")]
        public Task<ActionResult<ICollection<UserRoleDto>>> GetAsync(Guid actorId, Guid userId)
        {
            return HandleExceptionAsync(() => _client.ActorsUsersRolesGetAsync(actorId, userId));
        }

        [HttpGet]
        [Route("GetUserRoleWithPermissions")]
        public Task<ActionResult<UserRoleWithPermissionsDto>> GetUserRoleWithPermissionsAsync(Guid userRoleId)
        {
            return HandleExceptionAsync(() => _client.UserRolesGetAsync(userRoleId));
        }

        [HttpGet]
        [Route("GetAll")]
        public Task<ActionResult<ICollection<UserRoleDto>>> GetAllAsync()
        {
            return HandleExceptionAsync(() => _client.UserRolesGetAsync());
        }

        [HttpGet]
        [Route("GetAssignable")]
        public Task<ActionResult<ICollection<UserRoleDto>>> GetAssignableAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.ActorsRolesAsync(actorId));
        }

        [HttpGet]
        [Route("GetUserRoleView")]
        public async Task<ActionResult<IEnumerable<ActorViewDto>>> GetUserRoleViewAsync(Guid userId)
        {
            var usersActors = await _client
                .UserActorsGetAsync(userId)
                .ConfigureAwait(false);

            var fetchedActors = new List<ActorDto>();

            foreach (var actorId in usersActors.ActorIds)
            {
                fetchedActors.Add(await _client.ActorGetAsync(actorId).ConfigureAwait(false));
            }

            var actorViews = new List<ActorViewDto>();

            foreach (var organizationAndActors in fetchedActors.GroupBy(actor => actor.OrganizationId))
            {
                var organization = await _client
                    .OrganizationGetAsync(organizationAndActors.Key)
                    .ConfigureAwait(false);

                foreach (var actor in organizationAndActors)
                {
                    var actorUserRoles = new List<UserRoleViewDto>();
                    var assignedRoles = await _client
                        .ActorsUsersRolesGetAsync(actor.ActorId, userId)
                        .ConfigureAwait(false);

                    var assignmentLookup = assignedRoles
                        .Select(ar => ar.Id)
                        .ToHashSet();

                    foreach (var userRole in await _client.ActorsRolesAsync(actor.ActorId).ConfigureAwait(false))
                    {
                        actorUserRoles.Add(new UserRoleViewDto(
                            userRole.Id,
                            userRole.EicFunction,
                            userRole.Name,
                            userRole.Description,
                            assignmentLookup.Contains(userRole.Id) ? actor.ActorId : null));
                    }

                    actorViews.Add(new ActorViewDto(
                        actor.ActorId,
                        organization.Name,
                        actor.ActorNumber.Value,
                        actor.Name.Value,
                        actorUserRoles));
                }
            }

            return actorViews;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<Guid>> CreateAsync(CreateUserRoleDto userRole)
        {
            var copy = new CreateUserRoleDto
            {
                Name = userRole.Name,
                Description = userRole.Description,
                EicFunction = userRole.EicFunction,
                Permissions = userRole.Permissions,
                Status = userRole.Status,
            };

            var userRoleId = await _client
                .UserRolesPostAsync(copy)
                .ConfigureAwait(false);

            return Ok(userRoleId);
        }

        [HttpPut]
        [Route("Update")]
        public Task<ActionResult> UpdateAsync(Guid userRoleId, UpdateUserRoleDto userRole)
        {
            return HandleExceptionAsync(() => _client.UserRolesPutAsync(userRoleId, userRole));
        }

        [HttpGet]
        [Route("Permissions")]
        public Task<ActionResult<ICollection<PermissionDetailsDto>>> GetPermissionDetailsAsync(EicFunction eicFunction)
        {
            return HandleExceptionAsync(() => _client.UserRolesPermissionsAsync(eicFunction));
        }

        [HttpGet]
        [Route("Deactivate")]
        public Task<ActionResult> DeactivateRoleAsync(Guid roleId)
        {
            return HandleExceptionAsync(() => _client.UserRolesDeactivateAsync(roleId));
        }
    }
}
