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
using Energinet.DataHub.WebApi.GraphQL.Attribute;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.User;
using HotChocolate.Types.Pagination;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<UserAuditedChangeAuditLogDto>> GetUserAuditLogsAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client)
        => await client.UserAuditAsync(id);

    public async Task<GetUserProfileResponse> GetUserProfileAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserUserprofileGetAsync();

    [PreserveParentAs("user")]
    public async Task<GetUserResponse> GetUserByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client)
    {
        return await client.UserAsync(id);
    }

    public async Task<bool> DomainExistsAsync(
        string emailAddress,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserCheckDomainAsync(emailAddress);

    public async Task<IEnumerable<string>> GetKnownEmailsAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.GetUserOverviewAsync()).Users
            .Select(x => x.Email)
            .ToList();
}
