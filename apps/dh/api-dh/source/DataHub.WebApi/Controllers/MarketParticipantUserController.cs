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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuditLogsDto = Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto.UserAuditLogsDto;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient_V1 _client;

        public MarketParticipantUserController(IMarketParticipantClient_V1 client)
        {
            _client = client;
        }

        [HttpPost]
        [Route("InviteUser")]
        public Task<ActionResult> InviteUserAsync(UserInvitationDto invite)
        {
            return HandleExceptionAsync(() =>
                _client.UsersInviteAsync(invite));
        }

        [HttpPost]
        [Route("ReInviteUser")]
        public Task<ActionResult> ReInviteUserAsync(Guid userId)
        {
            return HandleExceptionAsync(() =>
                _client.UsersReinviteAsync(userId));
        }

        [HttpPost]
        [Route("ResetUser2Fa")]
        public Task<ActionResult> ResetTwoFactorAuthenticationAsync(Guid userId)
        {
            return HandleExceptionAsync(() =>
                _client.UserReset2faAsync(userId));
        }

        /// <summary>
        ///     Retrieves actors associated with the users external actor token.
        /// </summary>
        [HttpGet]
        [Route("GetUserActors")]
        [AllowAnonymous]
        public Task<ActionResult<GetActorsAssociatedWithExternalUserIdResponse>> GetUserActorsAsync()
        {
            var externalToken = HttpContext.Request.Headers["Authorization"].ToString();
            externalToken = externalToken.Replace("Bearer ", string.Empty);
            return HandleExceptionAsync(() => _client.UserActorsGetAsync(externalToken));
        }

        /// <summary>
        ///     Retrieves actors associated with the userId specified, ensures only actors you are allowed to see are returned.
        /// </summary>
        [HttpGet]
        [Route("GetUserActorsByUserId")]
        public Task<ActionResult<GetActorsAssociatedWithUserResponse>> GetUserActorsByUserIdAsync(Guid userId)
        {
            return HandleExceptionAsync(() => _client.UserActorsGetAsync(userId));
        }

        /// <summary>
        ///     Retrieves the audit log history for the specified user.
        /// </summary>
        [HttpGet]
        [Route("GetUserAuditLogs")]
        public Task<ActionResult<UserAuditLogsDto>> GetUserAuditLogsAsync(Guid userId)
        {
            return HandleExceptionAsync(async () =>
            {
                var auditLogs = await _client
                    .UserAuditlogentryAsync(userId)
                    .ConfigureAwait(false);

                var userAuditLogs = new List<UserAuditLogDto>();

                foreach (var auditLog in auditLogs.InviteAuditLogs)
                {
                    var changedByUserDto = await _client
                        .AuditIdentityAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    userAuditLogs.Add(new UserAuditLogDto(
                        auditLog.ActorName,
                        changedByUserDto.DisplayName,
                        UserAuditLogType.UserInvite,
                        auditLog.Timestamp));
                }

                foreach (var auditLog in auditLogs.UserRoleAssignmentAuditLogs)
                {
                    var changedByUserDto = await _client
                        .AuditIdentityAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    var userRoleDto = await _client
                        .UserRolesGetAsync(auditLog.UserRoleId)
                        .ConfigureAwait(false);

                    var auditLogType = auditLog.AssignmentType switch
                    {
                        UserRoleAssignmentTypeAuditLog.Added => UserAuditLogType.UserRoleAdded,
                        UserRoleAssignmentTypeAuditLog.Removed => UserAuditLogType.UserRoleRemoved,
                        UserRoleAssignmentTypeAuditLog.RemovedDueToDeactivation => UserAuditLogType.UserRoleRemovedDueToDeactivation,
                        _ => UserAuditLogType.UserRoleAdded,
                    };

                    userAuditLogs.Add(new UserAuditLogDto(
                        userRoleDto.Name,
                        changedByUserDto.DisplayName,
                        auditLogType,
                        auditLog.Timestamp));
                }

                foreach (var auditLog in auditLogs.IdentityAuditLogs)
                {
                    var changedByUserDto = await _client
                        .AuditIdentityAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    var auditLogType = auditLog.Field switch
                    {
                        UserIdentityAuditLogField.FirstName => UserAuditLogType.UserFirstNameChanged,
                        UserIdentityAuditLogField.LastName => UserAuditLogType.UserLastNameChanged,
                        UserIdentityAuditLogField.PhoneNumber => UserAuditLogType.UserPhoneNumberChanged,
                        UserIdentityAuditLogField.Status => UserAuditLogType.UserStatusChanged,
                        _ => throw new ArgumentOutOfRangeException(),
                    };

                    userAuditLogs.Add(new UserAuditLogDto(
                        auditLog.NewValue,
                        changedByUserDto.DisplayName,
                        auditLogType,
                        auditLog.Timestamp));
                }

                return new UserAuditLogsDto(userAuditLogs.OrderByDescending(l => l.Timestamp));
            });
        }

        [HttpPut]
        [Route("UpdateUserIdentity")]
        public Task<ActionResult> UpdateUserIdentityAsync(Guid userId, UserIdentityUpdateDto userIdentityUpdateDto)
        {
            return HandleExceptionAsync(() => _client.UserUseridentityAsync(userId, userIdentityUpdateDto));
        }

        /// <summary>
        /// Initiates MitID signup
        /// </summary>
        [HttpPost]
        [Route("InitiateMitIdSignup")]
        public Task InitiateMitIdSignupAsync()
        {
            return HandleExceptionAsync(() => _client.UserInitiateMitidSignupAsync());
        }

        /// <summary>
        /// Deactivates the specified user.
        /// </summary>
        [HttpPut]
        [Route("DeactivateUser")]
        public Task<ActionResult> DeactivateUserAsync(Guid userId)
        {
            return HandleExceptionAsync(() => _client.UserDeactivateAsync(userId));
        }
    }
}
