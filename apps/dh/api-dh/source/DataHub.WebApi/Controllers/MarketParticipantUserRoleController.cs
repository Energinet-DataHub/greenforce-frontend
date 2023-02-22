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
using Microsoft.AspNetCore.Mvc;
using ViewModels = Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;

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
        public async Task<ActionResult<ViewModels.UserRolesViewDto>> GetUserRoleViewAsync(Guid userId)
        {
            var allOrganizations = await _marketParticipantClient.GetOrganizationsAsync();
            var allActors = allOrganizations.SelectMany(o => o.Actors);
            var userActorsIds = (await _marketParticipantClient.GetUserActorsAsync(userId)).ActorIds;

            var userOrganizations = allOrganizations.Where(org => org.Actors.Any(a => userActorsIds.Any(userActor => userActor == a.ActorId)));
            var userActors = allActors.Where(actor => userActorsIds.Any(userActor => userActor == actor.ActorId));
            var assignableUserRolesTasks = userActorsIds.Select(async userActorId => await _userRoleClient.GetAssignableAsync(userActorId));
            var assignableUserRoles = (await Task.WhenAll(assignableUserRolesTasks)).SelectMany(userRole => userRole);
            var selectedUserRolesTasks = userActorsIds
                                                .Select(async userActorId =>
                                                    (await _userRoleClient.GetAsync(userActorId, userId))
                                                        .Select(role => new ViewModels.UserRoleViewDto(role.Id, role.Name, userActorId)));
            var selectedUserRoles = (await Task.WhenAll(selectedUserRolesTasks)).SelectMany(userRole => userRole);

            var userRoleView = new ViewModels.UserRolesViewDto(
                userOrganizations.Select(org => new ViewModels.OrganizationViewDto(
                    org.OrganizationId,
                    org.Name,
                    userActors
                        .Where(actor => org.Actors.Any(a => a.ActorId == actor.ActorId))
                        .Select(actor =>
                            new ViewModels.ActorViewDto(
                                actor.ActorId,
                                actor.Name.Value,
                                actor.ActorNumber.Value,
                                assignableUserRoles
                                    .Select(mr => new ViewModels.UserRoleViewDto(
                                        mr.Id,
                                        mr.Name,
                                        selectedUserRoles
                                            .Where(x => x.Id == mr.Id && x.UserActorId == actor.ActorId)
                                            .Select(x => x.UserActorId)
                                            .FirstOrDefault())),
                                actor.MarketRoles.Select(mr => new ViewModels.ActorMarketRoleViewDto(mr.EicFunction)))))));
            return userRoleView;
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
        public Task<ActionResult<MarketParticipant.Dto.UserRoleAuditLogsDto>> GetUserRoleAuditLogsAsync(Guid userRoleId)
        {
            return HandleExceptionAsync(async () =>
            {
                var userRoleAuditLogsResult = await _userRoleClient
                    .GetUserRoleAuditLogsAsync(userRoleId)
                    .ConfigureAwait(false);

                var userRoleAuditLogs = new List<MarketParticipant.Dto.UserRoleAuditLogDto>();

                foreach (var auditLog in userRoleAuditLogsResult)
                {
                    var userDto = await _marketParticipantClient
                        .GetUserAsync(auditLog.ChangedByUserId)
                        .ConfigureAwait(false);

                    userRoleAuditLogs.Add(new MarketParticipant.Dto.UserRoleAuditLogDto(
                        auditLog.UserRoleId,
                        auditLog.ChangedByUserId,
                        userDto.Name,
                        auditLog.Timestamp,
                        auditLog.UserRoleChangeType,
                        auditLog.ChangeDescriptionJson));
                }

                return new MarketParticipant.Dto.UserRoleAuditLogsDto(userRoleAuditLogs);
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
