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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Types;

[ObjectType<ActorDto>]
public static partial class ActorUserRoleType
{
    public static async Task<IEnumerable<ActorUserRole>> GetUserRolesAsync(
       Guid? userId,
       [Parent] ActorDto actor,
       [Service] IMarketParticipantClient_V1 client)
    {
        var roles = await client.ActorsRolesAsync(actor.ActorId);

        if (userId is null)
        {
            return roles.Select(r => new ActorUserRole(
                r.Id,
                r.Name,
                r.Status,
                r.Description,
                r.EicFunction,
                false));
        }

        var assignedRoles = await client
                    .ActorsUsersRolesGetAsync(actor.ActorId, userId.Value)
                    .ConfigureAwait(false);

        var assignmentLookup = assignedRoles
            .Select(ar => ar.Id)
            .ToHashSet();

        return roles.Select(r => new ActorUserRole(
            r.Id,
            r.Name,
            r.Status,
            r.Description,
            r.EicFunction,
            assignmentLookup.Contains(r.Id)));
    }
}
