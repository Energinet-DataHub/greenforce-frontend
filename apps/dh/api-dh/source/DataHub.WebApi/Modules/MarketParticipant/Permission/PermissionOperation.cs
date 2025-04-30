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
using Energinet.DataHub.WebApi.Modules.Common.Extensions;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Permission;

[ObjectType<PermissionDto>]
public static partial class PermissionOperation
{
    [Query]
    public static async Task<PermissionDto> GetPermissionByIdAsync(
        int id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.PermissionGetAsync(id);

    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<PermissionDto>> GetFilteredPermissionsAsync(
        string? filter,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.PermissionGetAsync())
            .Where(p =>
                filter is null ||
                p.Name.Contains(filter, StringComparison.CurrentCultureIgnoreCase) ||
                p.Description.Contains(filter, StringComparison.CurrentCultureIgnoreCase));

    [Query]
    public static async Task<IEnumerable<PermissionDetailsDto>> GetPermissionsByEicFunctionAsync(
        EicFunction eicFunction,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesPermissionsAsync(eicFunction);

    [Mutation]
    [Error(typeof(ApiException))]
    public static Task<PermissionDto> UpdatePermissionAsync(
        int id,
        string description,
        [Service] IMarketParticipantClient_V1 client)
    {
        return client
            .PermissionPutAsync(id, new() { Description = description })
            .Then(() => client.PermissionGetAsync(id));
    }

    #region Computed fields on GetUserResponse

    public static async Task<IEnumerable<UserRoleDto>> GetUserRolesAsync(
        [Parent] PermissionDto permission,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesAssignedtopermissionAsync(permission.Id);

    public static async Task<IEnumerable<PermissionAuditedChangeAuditLogDto>> GetAuditLogsAsync(
        [Parent] PermissionDto permission,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.PermissionAuditAsync(permission.Id);

    #endregion

    static partial void Configure(
        IObjectTypeDescriptor<PermissionDto> descriptor)
    {
        descriptor.Name("Permission");
    }
}
