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
    public class MarketParticipantPermissionsController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantPermissionsClient _client;
        private readonly IMarketParticipantClient _marketParticipantClient;

        public MarketParticipantPermissionsController(
            IMarketParticipantPermissionsClient client,
            IMarketParticipantClient marketParticipantClient)
        {
            _client = client;
            _marketParticipantClient = marketParticipantClient;
        }

        /// <summary>
        /// Retrieves All Permissions
        /// </summary>
        [HttpGet]
        [Route("GetPermissions")]
        public Task<ActionResult<IEnumerable<PermissionDetailsDto>>> GetPermissionsAsync()
        {
            return HandleExceptionAsync(() => _client.GetPermissionsAsync());
        }

        [HttpPut]
        [Route("Update")]
        public Task<ActionResult> UpdateAsync(UpdatePermissionDto permissionDto)
        {
            return HandleExceptionAsync(() => _client.UpdatePermissionAsync(permissionDto));
        }

        /// <summary>
        /// Retrieves permissions auditLogs
        /// </summary>
        [HttpGet]
        [Route("GetPermissionAuditLogs")]
        public Task<ActionResult<PermissionAuditLogsViewDto>> GetPermissionAuditLogsAsync(int permissionId)
        {
            return HandleExceptionAsync(async () =>
            {
                var permissionAuditLogs = await _client
                    .GetAuditLogsAsync(permissionId)
                    .ConfigureAwait(false);

                var permissionAuditLogWithUser = new List<PermissionAuditLogViewDto>();
                var userLookup = new Dictionary<Guid, UserDto>();
                var permission = (await _client.GetPermissionsAsync()).FirstOrDefault(x => x.Id == permissionId) ?? throw new InvalidOperationException($"Permission {permissionId} was not found");

                permissionAuditLogWithUser.Add(new PermissionAuditLogViewDto(
                    permissionId,
                    Guid.Empty,
                    "Oprettet af DataHub",
                    PermissionAuditLogType.Created,
                    permission.Created));

                foreach (var auditLog in permissionAuditLogs)
                {
                    var userFoundInCache = userLookup.ContainsKey(auditLog.ChangedByUserId);
                    if (!userFoundInCache)
                    {
                        var user = await _marketParticipantClient.GetUserAsync(auditLog.ChangedByUserId);
                        userLookup.Add(auditLog.ChangedByUserId, user);
                    }

                    userLookup.TryGetValue(auditLog.ChangedByUserId, out var userDtoCache);

                    permissionAuditLogWithUser.Add(new PermissionAuditLogViewDto(
                        auditLog.PermissionId,
                        auditLog.ChangedByUserId,
                        userDtoCache?.Name ?? throw new KeyNotFoundException("User not found"),
                        auditLog.PermissionChangeType == PermissionChangeType.DescriptionChange ? PermissionAuditLogType.DescriptionChange : PermissionAuditLogType.Unknown,
                        auditLog.Timestamp));
                }

                return new PermissionAuditLogsViewDto(permissionAuditLogWithUser);
            });
        }
    }
}
