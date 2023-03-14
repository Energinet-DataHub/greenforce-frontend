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
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserRoleController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantUserRoleClient _userRoleClient;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public MarketParticipantUserRoleController(
            IMarketParticipantUserRoleClient userRoleClient,
            IMarketParticipantClient marketParticipantClient)
        {
            _userRoleClient = userRoleClient;
            _marketParticipantClient = marketParticipantClient;
        }

        [HttpGet]
        [Route("Get")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAsync(Guid actorId, Guid userId)
        {
            return HandleExceptionAsync(() => _userRoleClient.GetAsync(actorId, userId));
        }

        [HttpGet]
        [Route("GetUserRoleWithPermissions")]
        public Task<ActionResult<UserRoleWithPermissionsDto>> GetUserRoleWithPermissionsAsync(Guid userRoleId)
        {
            return HandleExceptionAsync(() => _userRoleClient.GetAsync(userRoleId));
        }

        [HttpGet]
        [Route("GetAll")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAllAsync()
        {
            return HandleExceptionAsync(() => _userRoleClient.GetAllAsync());
        }

        [HttpGet]
        [Route("GetAssignable")]
        public Task<ActionResult<IEnumerable<UserRoleDto>>> GetAssignableAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _userRoleClient.GetAssignableAsync(actorId));
        }

        [HttpGet]
        [Route("GetUserRoleView")]
        public async Task<ActionResult<IEnumerable<ActorViewDto>>> GetUserRoleViewAsync(Guid userId)
        {
            var usersActors = await _marketParticipantClient
                .GetUserActorsAsync(userId)
                .ConfigureAwait(false);

            var fetchedActors = new List<ActorDto>();

            foreach (var actorId in usersActors.ActorIds)
            {
                fetchedActors.Add(await _marketParticipantClient.GetActorAsync(actorId).ConfigureAwait(false));
            }

            var actorViews = new List<ActorViewDto>();

            foreach (var organizationAndActors in fetchedActors.GroupBy(actor => actor.OrganizationId))
            {
                var organization = await _marketParticipantClient
                    .GetOrganizationAsync(organizationAndActors.Key)
                    .ConfigureAwait(false);

                foreach (var actor in organizationAndActors)
                {
                    var actorUserRoles = new List<UserRoleViewDto>();
                    var assignedRoles = await _userRoleClient
                        .GetAsync(actor.ActorId, userId)
                        .ConfigureAwait(false);

                    var assignmentLookup = assignedRoles
                        .Select(ar => ar.Id)
                        .ToHashSet();

                    foreach (var userRole in await _userRoleClient.GetAssignableAsync(actor.ActorId).ConfigureAwait(false))
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
        public Task<ActionResult<Guid>> CreateAsync(CreateUserRoleDto userRole)
        {
            return HandleExceptionAsync(() => _userRoleClient.CreateAsync(userRole));
        }

        [HttpPut]
        [Route("Update")]
        public Task<ActionResult> UpdateAsync(Guid userRoleId, UpdateUserRoleDto userRole)
        {
            return HandleExceptionAsync(() => _userRoleClient.UpdateAsync(userRoleId, userRole));
        }

        /// <summary>
        ///     Retrieves the audit log history for the specified user role.
        /// </summary>
        [HttpGet]
        [Route("GetUserRoleAuditLogs")]
        public Task<ActionResult<UserRoleAuditLogsDto>> GetUserRoleAuditLogsAsync(Guid userRoleId)
        {
            return HandleExceptionAsync(async () =>
            {
                var userRoleAuditLogsResult = await _userRoleClient
                    .GetUserRoleAuditLogsAsync(userRoleId)
                    .ConfigureAwait(false);

                var userRoleAuditLogs = new List<UserRoleAuditLogDto>();

                foreach (var auditLog in userRoleAuditLogsResult)
                {
                    var userDto = await _marketParticipantClient
                        .GetUserAsync(auditLog.ChangedByUserId)
                        .ConfigureAwait(false);

                    userRoleAuditLogs.Add(new UserRoleAuditLogDto(
                        auditLog.UserRoleId,
                        auditLog.ChangedByUserId,
                        userDto.Name,
                        auditLog.Timestamp,
                        auditLog.UserRoleChangeType,
                        auditLog.ChangeDescriptionJson));
                }

                return new UserRoleAuditLogsDto(userRoleAuditLogs);
            });
        }

        [HttpGet]
        [Route("Permissions")]
        public Task<ActionResult<IEnumerable<PermissionDetailsDto>>> GetPermissionDetailsAsync(EicFunction eicFunction)
        {
            return HandleExceptionAsync(() => _userRoleClient.GetPermissionDetailsAsync(eicFunction));
        }
    }
}
