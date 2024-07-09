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
using Energinet.DataHub.WebApi.GraphQL.Types.UserRole;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    [Error(typeof(ApiException))]
    public async Task<bool> UpdateUserRoleAssignmentAsync(
            Guid userId,
            UpdateActorUserRoles[] input,
            [Service] IMarketParticipantClient_V1 client)
    {
        var tasks = input.Select(async x => await client.ActorsUsersRolesPutAsync(x.ActorId, userId, x.Assignments));
        await Task.WhenAll(tasks).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> UpdateUserRoleAsync(
            Guid userRoleId,
            UpdateUserRoleDto userRole,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserRolesPutAsync(userRoleId, userRole).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> CreateUserRoleAsync(
        CreateUserRoleDto userRole,
        [Service] IMarketParticipantClient_V1 client)
    {
        var userRoleToCreate = new CreateUserRoleDto
        {
            Name = userRole.Name,
            Description = userRole.Description,
            EicFunction = userRole.EicFunction,
            Permissions = userRole.Permissions,
            Status = userRole.Status,
        };

        await client.UserRolesPostAsync(userRoleToCreate).ConfigureAwait(false);
        return true;
    }
}
