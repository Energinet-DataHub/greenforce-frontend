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
using Energinet.DataHub.WebApi.GraphQL.Extensions;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<UserRoleAuditedChangeAuditLogDto>> GetUserRoleAuditLogsAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesAuditAsync(id);

    public async Task<IEnumerable<UserAuditedChangeAuditLogDto>> GetUserAuditLogsAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client)
        => await client.UserAuditAsync(id);

    public async Task<UserRoleWithPermissionsDto> GetUserRoleByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesGetAsync(id);

    public async Task<IEnumerable<UserRoleDto>> GetUserRolesByEicFunctionAsync(
        EicFunction eicFunction,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.UserRolesGetAsync())
            .Where(u => u.EicFunction == eicFunction);

    public async Task<GetUserProfileResponse> GetUserProfileAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserUserprofileGetAsync();

    public async Task<bool> EmailExistsAsync(
        string emailAddress,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserExistsAsync(emailAddress);

    public async Task<IEnumerable<string>> GetKnownEmailsAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.GetUserOverviewAsync()).Users
            .Select(x => x.Email)
            .ToList();
}
