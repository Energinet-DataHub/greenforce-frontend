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

    [UsePaging(MaxPageSize = 10_000)]
    [UseSorting]
    public async Task<Connection<UserOverviewItemDto>> GetUsersAsync(
        UserOverviewSortProperty sortProperty,
        SortDirection sortDirection,
        Guid? actorId,
        Guid[]? userRoleIds,
        UserStatus[]? userStatus,
        string? filter,
        int? first,
        string? after,
        int? last,
        string? before,
        [Service] IMarketParticipantClient_V1 client)
    {
        var pageSize = first ?? last ?? 10;
        var index = before ?? after;
        var pageNumber = CalculatePageNumber(index, !last.HasValue);

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

        var edges = response.Users.Select(message => MakeEdge(message, sortProperty)).ToList();

        var totalCount = response.TotalUserCount;

        var isFirstPage = pageNumber == 1;
        var isLastPage = totalCount <= pageSize * pageNumber;

        var pageInfo = new ConnectionPageInfo(
            !isFirstPage,
            !isLastPage,
            pageNumber.ToString(),
            pageNumber.ToString());

        var connection = new Connection<UserOverviewItemDto>(
            edges,
            pageInfo,
            totalCount);

        return connection;
    }

    private static int CalculatePageNumber(string? index, bool forward)
    {
        if (index is null)
        {
            return 1;
        }

        if (forward)
        {
            return int.Parse(index) + 1;
        }

        return int.Parse(index) - 1;
    }

    private static Edge<UserOverviewItemDto> MakeEdge(
        UserOverviewItemDto message,
        UserOverviewSortProperty field)
    {
        var sortCursor = field switch
        {
            UserOverviewSortProperty.CreatedDate => message.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss.fff"),
            UserOverviewSortProperty.Email => message.Email ?? string.Empty,
            UserOverviewSortProperty.FirstName => message.FirstName ?? string.Empty,
            UserOverviewSortProperty.LastName => message.LastName ?? string.Empty,
            UserOverviewSortProperty.LatestLoginAt => message.LatestLoginAt?.ToString("yyyy-MM-dd HH:mm:ss.fff"),
            UserOverviewSortProperty.PhoneNumber => message.PhoneNumber ?? string.Empty,
            UserOverviewSortProperty.Status => message.Status.ToString(),
            _ => throw new ArgumentOutOfRangeException(nameof(field), field, "Unexpected FieldToSortBy value"),
        };

        return new Edge<UserOverviewItemDto>(message, $"{message.Id}+{sortCursor}");
    }
}
