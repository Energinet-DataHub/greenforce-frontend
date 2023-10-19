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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuditLogsDto = Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto.UserAuditLogsDto;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantAuditIdentityClient _marketParticipantAuditIdentityClient;
        private readonly IMarketParticipantClient _marketParticipantClient;
        private readonly IMarketParticipantUserRoleClient _marketParticipantUserRoleClient;
        private readonly IMarketParticipantUserInvitationClient _marketParticipantUserInvitationClient;

        public MarketParticipantUserController(
            IMarketParticipantAuditIdentityClient marketParticipantAuditIdentityClient,
            IMarketParticipantClient marketParticipantClient,
            IMarketParticipantUserRoleClient marketParticipantUserRoleClient,
            IMarketParticipantUserInvitationClient marketParticipantUserInvitationClient)
        {
            _marketParticipantAuditIdentityClient = marketParticipantAuditIdentityClient;
            _marketParticipantClient = marketParticipantClient;
            _marketParticipantUserRoleClient = marketParticipantUserRoleClient;
            _marketParticipantUserInvitationClient = marketParticipantUserInvitationClient;
        }

        [HttpPost]
        [Route("InviteUser")]
        public Task<ActionResult> InviteUserAsync(UserInvitationDto invite)
        {
            return HandleExceptionAsync(() =>
                _marketParticipantUserInvitationClient.InviteUserAsync(invite));
        }

        [HttpPost]
        [Route("ReInviteUser")]
        public Task<ActionResult> ReInviteUserAsync(Guid userId)
        {
            return HandleExceptionAsync(() =>
                _marketParticipantUserInvitationClient.ReInviteUserAsync(userId));
        }

        [HttpPost]
        [Route("ResetUser2Fa")]
        public Task<ActionResult> ResetTwoFactorAuthenticationAsync(Guid userId)
        {
            return HandleExceptionAsync(() =>
                _marketParticipantClient.ResetTwoFactorAuthenticationAsync(userId));
        }

        /// <summary>
        ///     Retrieves actors associated with the users external actor token.
        /// </summary>
        [HttpGet]
        [Route("GetUserActors")]
        [AllowAnonymous]
        public Task<ActionResult<GetAssociatedUserActorsResponseDto>> GetUserActorsAsync()
        {
            var externalToken = HttpContext.Request.Headers["Authorization"].ToString();
            externalToken = externalToken.Replace("Bearer ", string.Empty);
            return HandleExceptionAsync(() => _marketParticipantClient.GetUserActorsAsync(externalToken));
        }

        /// <summary>
        ///     Retrieves actors associated with the userId specified, ensures only actors you are allowed to see are returned.
        /// </summary>
        [HttpGet]
        [Route("GetUserActorsByUserId")]
        public Task<ActionResult<GetAssociatedUserActorsResponseDto>> GetUserActorsByUserIdAsync(Guid userId)
        {
            return HandleExceptionAsync(() => _marketParticipantClient.GetUserActorsAsync(userId));
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
                var auditLogs = await _marketParticipantClient
                    .GetUserAuditLogsAsync(userId)
                    .ConfigureAwait(false);

                var userAuditLogs = new List<UserAuditLogDto>();

                foreach (var auditLog in auditLogs.InviteAuditLogs)
                {
                    var changedByUserDto = await _marketParticipantAuditIdentityClient
                        .GetAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    userAuditLogs.Add(new UserAuditLogDto(
                        auditLog.ActorName,
                        changedByUserDto.DisplayName,
                        UserAuditLogType.UserInvite,
                        auditLog.Timestamp));
                }

                foreach (var auditLog in auditLogs.UserRoleAssignmentAuditLogs)
                {
                    var changedByUserDto = await _marketParticipantAuditIdentityClient
                        .GetAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    var userRoleDto = await _marketParticipantUserRoleClient
                        .GetAsync(auditLog.UserRoleId)
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
                    var changedByUserDto = await _marketParticipantAuditIdentityClient
                        .GetAsync(auditLog.AuditIdentityId)
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
            return HandleExceptionAsync(() => _marketParticipantClient.UpdateUserPhoneNumberAsync(userId, userIdentityUpdateDto));
        }

        /// <summary>
        /// Initiates MitID signup
        /// </summary>
        [HttpPost]
        [Route("InitiateMitIdSignup")]
        public Task InitiateMitIdSignupAsync()
        {
            return HandleExceptionAsync(() => _marketParticipantClient.InitiateMitIdSignupAsync());
        }

        /// <summary>
        /// Deactivates the specified user.
        /// </summary>
        [HttpPut]
        [Route("DeactivateUser")]
        public Task<ActionResult> DeactivateUserAsync(Guid userId)
        {
            return HandleExceptionAsync(() => _marketParticipantClient.DeactivateUserAsync(userId));
        }
    }
}
