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
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.UserRole;

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

    [UsePaging(MaxPageSize = 10_000)]
    [UseSorting]
    public async Task<IEnumerable<UserRoleDto>> GetFilteredUserRolesAsync(
        UserRoleStatus? status,
        EicFunction[]? eicFunctions,
        string? filter,
        [Service] IHttpContextAccessor httpContext,
        [Service] IMarketParticipantClient_V1 client)
    {
        if (httpContext.HttpContext == null)
        {
            return Enumerable.Empty<UserRoleDto>();
        }

        var user = httpContext.HttpContext.User;
        if (user.IsFas())
        {
            return ApplyFilter(await client.UserRolesGetAsync(), status, eicFunctions, filter);
        }

        return ApplyFilter(await client.ActorsRolesAsync(user.GetAssociatedActor()), status, eicFunctions, filter);
    }

    public async Task<IEnumerable<UserRoleDto>> GetUserRolesAsync(
        Guid? actorId,
        [Service] IHttpContextAccessor httpContext,
        [Service] IMarketParticipantClient_V1 client)
    {
        if (httpContext.HttpContext == null)
        {
            return Enumerable.Empty<UserRoleDto>();
        }

        if (actorId.HasValue)
        {
            return await client.ActorsRolesAsync(actorId.Value);
        }

        var user = httpContext.HttpContext.User;

        if (user.IsFas())
        {
            return await client.UserRolesGetAsync();
        }

        return await client.ActorsRolesAsync(user.GetAssociatedActor());
    }

    internal static IEnumerable<UserRoleDto> ApplyFilter(
        ICollection<UserRoleDto> userRoles,
        UserRoleStatus? status,
        EicFunction[]? eicFunctions,
        string? filter)
    {
        return userRoles
            .Where(x => status == null || x.Status == status)
            .Where(x => eicFunctions == null || eicFunctions.Length == 0 || eicFunctions.Contains(x.EicFunction))
            // TODO: How do we support text search in multiple languages
            .Where(x => filter == null || x.Name.Contains(filter) || x.EicFunction.ToString().Contains(filter));
    }
}
