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
    public class MarketParticipantUserController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient _marketParticipantClient;
        private readonly IMarketParticipantUserRoleClient _marketParticipantUserRoleClient;

        public MarketParticipantUserController(IMarketParticipantClient marketParticipantClient, IMarketParticipantUserRoleClient marketParticipantUserRoleClient)
        {
            _marketParticipantClient = marketParticipantClient;
            _marketParticipantUserRoleClient = marketParticipantUserRoleClient;
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
        public Task<ActionResult<MarketParticipant.Dto.UserAuditLogsDto>> GetUserAuditLogsAsync(Guid userId)
        {
            return HandleExceptionAsync(async () =>
            {
                var auditLogs = await _marketParticipantClient
                    .GetUserAuditLogsAsync(userId)
                    .ConfigureAwait(false);

                var roleAssignmentAuditLogs = new List<UserRoleAssignmentAuditLogDto>();

                foreach (var auditLog in auditLogs.UserRoleAssignmentAuditLogs)
                {
                    var userDto = await _marketParticipantClient
                        .GetUserAsync(auditLog.ChangedByUserId)
                        .ConfigureAwait(false);

                    var userRoleDto = await _marketParticipantUserRoleClient
                        .GetAsync(auditLog.UserRoleId)
                        .ConfigureAwait(false);

                    roleAssignmentAuditLogs.Add(new UserRoleAssignmentAuditLogDto(
                        auditLog.ActorId,
                        auditLog.UserRoleId,
                        userRoleDto.Name,
                        auditLog.ChangedByUserId,
                        userDto.Name,
                        auditLog.Timestamp,
                        auditLog.AssignmentType));
                }

                return new MarketParticipant.Dto.UserAuditLogsDto(roleAssignmentAuditLogs);
            });
        }
    }
}
