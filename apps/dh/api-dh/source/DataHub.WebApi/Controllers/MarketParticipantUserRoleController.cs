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
        private readonly IMarketParticipantClient _client;

        public MarketParticipantUserRoleController(IMarketParticipantUserRoleClient userRoleClient, IMarketParticipantClient client)
        {
            _userRoleClient = userRoleClient;
            _client = client;
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
            var allOrganizations = await _client.GetOrganizationsAsync();
            var allActors = allOrganizations.SelectMany(o => o.Actors);
            var userActorsIds = (await _client.GetUserActorsAsync(userId)).ActorIds;

            var userOrganizations = allOrganizations.Where(org => org.Actors.Any(a => userActorsIds.Any(userActor => userActor == a.ActorId)));
            var userActors = allActors.Where(actor => userActorsIds.Any(userActor => userActor == actor.ActorId));
            var userMarketRolesOnActorTasks = userActorsIds
                                                .Select(async userActorId =>
                                                    (await _userRoleClient.GetAsync(userActorId, userId))
                                                        .Select(role => new ViewModels.UserRoleViewDto(role.Id, role.Name, userActorId)));
            var userMarketRolesOnActor = await Task.WhenAll(userMarketRolesOnActorTasks);

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
                                userMarketRolesOnActor
                                    .SelectMany(mr => mr)
                                    .Where(mr => mr.UserActorId == actor.ActorId)
                                    .Select(mr => new ViewModels.UserRoleViewDto(mr.Id, mr.Name, mr.UserActorId)))))));
            return userRoleView;
        }

        [HttpGet]
        [Route("Create")]
        public Task<ActionResult<Guid>> CreateAsync(CreateUserRoleDto userRole)
        {
            return HandleExceptionAsync(() => _userRoleClient.CreateAsync(userRole));
        }
    }
}
