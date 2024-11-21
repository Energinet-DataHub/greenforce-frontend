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
    public async Task<IEnumerable<UserRoleAuditedChangeAuditLogDto>> GetUserRoleAuditLogsAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserRolesAuditAsync(id);

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

    public async Task<GetUserOverviewResponse> UserOverviewSearchAsync(
        int pageNumber,
        int pageSize,
        UserOverviewSortProperty sortProperty,
        SortDirection sortDirection,
        Guid? actorId,
        string? searchText,
        Guid[]? userRoleIds,
        UserStatus[]? userStatus,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.UserOverviewUsersSearchAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection,
            new()
            {
                ActorId = actorId,
                SearchText = searchText,
                UserRoleIds = userRoleIds ?? [],
                UserStatus = userStatus ?? [],
            });

    [UseOffsetPaging(MaxPageSize = 10_000)]
    public async Task<CollectionSegment<UserOverviewItemDto>> GetUsersAsync(
        Guid? actorId,
        Guid[]? userRoleIds,
        UserStatus[]? userStatus,
        string? filter,
        int? skip,
        int? take,
        UsersSortInput? order,
        [Service] IMarketParticipantClient_V1 client)
    {
        var pageSize = take ?? 50;
        var pageNumber = (skip / take) + 1;

        var (sortProperty, sortDirection) = order switch
        {
            { Name: not null } => (UserOverviewSortProperty.FirstName, order.Name),
            { Email: not null } => (UserOverviewSortProperty.Email, order.Email),
            { PhoneNumber: not null } => (UserOverviewSortProperty.PhoneNumber, order.PhoneNumber),
            { LatestLoginAt: not null } => (UserOverviewSortProperty.LatestLoginAt, order.LatestLoginAt),
            { Status: not null } => (UserOverviewSortProperty.Status, order.Status),
            _ => (UserOverviewSortProperty.FirstName, SortDirection.Desc),
        };

        var response = await client.UserOverviewUsersSearchAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection,
            new()
            {
                ActorId = actorId,
                SearchText = filter,
                UserRoleIds = userRoleIds ?? [],
                UserStatus = userStatus ?? [],
            });

        var totalCount = response.TotalUserCount;
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = totalCount > pageNumber * pageSize;
        var pageInfo = new CollectionSegmentInfo(hasPreviousPage, hasNextPage);

        return new CollectionSegment<UserOverviewItemDto>(
            response.Users.ToList(),
            pageInfo,
            totalCount);
    }
}
