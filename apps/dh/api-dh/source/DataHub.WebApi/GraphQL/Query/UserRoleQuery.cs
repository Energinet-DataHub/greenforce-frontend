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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<UserRoleDto>> GetUserRolesByActorIdAsync(
           Guid actorId,
           [Service] IMarketParticipantClient_V1 client) =>
           await client.ActorsRolesAsync(actorId);

    public async Task<IEnumerable<UserRoleDto>> GetUserRolesByEicFunctionAsync(
            EicFunction eicFunction,
            [Service] IMarketParticipantClient_V1 client) =>
            (await client.UserRolesGetAsync())
                .Where(u => u.EicFunction == eicFunction);

    public async Task<UserRoleWithPermissionsDto> GetUserRoleByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesGetAsync(id);

    public async Task<IEnumerable<UserRoleDto>> GetUserRolesAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesGetAsync();

    public async Task<IEnumerable<ActorViewDto>> GetUserRoleViewAsync(
        Guid userId,
        [Service] IMarketParticipantClient_V1 client)
        {
            var usersActors = await client
            .UserActorsGetAsync(userId)
            .ConfigureAwait(false);

            var fetchedActors = new List<ActorDto>();

            foreach (var actorId in usersActors.ActorIds)
            {
                fetchedActors.Add(await client.ActorGetAsync(actorId).ConfigureAwait(false));
            }

            var actorViews = new List<ActorViewDto>();

            foreach (var organizationAndActors in fetchedActors.GroupBy(actor => actor.OrganizationId))
            {
                var organization = await client
                    .OrganizationGetAsync(organizationAndActors.Key)
                    .ConfigureAwait(false);

                foreach (var actor in organizationAndActors)
                {
                    var actorUserRoles = new List<UserRoleViewDto>();
                    var assignedRoles = await client
                        .ActorsUsersRolesGetAsync(actor.ActorId, userId)
                        .ConfigureAwait(false);

                    var assignmentLookup = assignedRoles
                        .Select(ar => ar.Id)
                        .ToHashSet();

                    foreach (var userRole in await client.ActorsRolesAsync(actor.ActorId).ConfigureAwait(false))
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
}
