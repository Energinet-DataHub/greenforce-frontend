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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.User.Types;
using HotChocolate.Types.Pagination;

using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.User;

[ObjectType<UserOverviewItemDto>]
public static partial class UserOverviewItemNode
{
    [Query]
    [UseOffsetPaging(MaxPageSize = 10_000)]
    public static async Task<CollectionSegment<UserOverviewItemDto>> GetUsersAsync(
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
            { Name: not null } => (UserOverviewSortProperty.FirstName, order.Name.Value),
            { Email: not null } => (UserOverviewSortProperty.Email, order.Email.Value),
            { PhoneNumber: not null } => (UserOverviewSortProperty.PhoneNumber, order.PhoneNumber.Value),
            { LatestLoginAt: not null } => (UserOverviewSortProperty.LatestLoginAt, order.LatestLoginAt.Value),
            { Status: not null } => (UserOverviewSortProperty.Status, order.Status.Value),
            _ => (UserOverviewSortProperty.FirstName, SortDirection.Desc),
        };

        var response = await client.UserOverviewUsersSearchAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection.FromSortingToMarketParticipantSorting(),
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

    #region Computed fields on UserOverviewItemDto

    public static string GetName(
        [Parent] UserOverviewItemDto user) => user.FirstName + ' ' + user.LastName;
    #endregion
}
