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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.User.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.User.Types;
using SortDirection = Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.User;

public static class UserOperations
{
    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> UpdateUserProfileAsync(
        UserProfileUpdateDto userProfileUpdateDto,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserUserprofilePutAsync(userProfileUpdateDto).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> UpdateUserIdentityAsync(
        Guid userId,
        UserIdentityUpdateDto userIdentityUpdateDto,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserUseridentityAsync(userId, userIdentityUpdateDto).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> InviteUserAsync(
        UserInvitationDto userInviteDto,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UsersInviteAsync(userInviteDto).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> ReInviteUserAsync(
        Guid userId,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UsersReinviteAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> ResetTwoFactorAuthenticationAsync(
        Guid userId,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserReset2faAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> DeactivateUserAsync(
        Guid userId,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserDeactivateAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> ReActivateUserAsync(
        Guid userId,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserReactivateAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> InitiateMitIdSignupAsync(
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserInitiateMitidSignupAsync();
        return true;
    }

    [Query]
    public static async Task<IEnumerable<UserCsvDto>> GetUsersForCsvExportAsync(
        Guid? actorId,
        Guid[]? userRoleIds,
        UserStatus[]? userStatus,
        string? filter,
        UsersSortInput? order,
        [Service] IMarketParticipantClient_V1 client)
    {
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
            1,
            50_000,
            sortProperty,
            sortDirection.FromSortingToMarketParticipantSorting(),
            new()
            {
                ActorId = actorId,
                SearchText = filter,
                UserRoleIds = userRoleIds ?? [],
                UserStatus = userStatus ?? [],
            });

        var actorLookup = (await client.QuerySelectionActorsAsync()).ToDictionary(x => x.Id);

        return response.Users.Select(x =>
        {
            var actor = actorLookup[x.AdministratedBy];
            return new UserCsvDto(UserOverviewItemNode.GetName(x), x.Email, actor.ActorName, actor.OrganizationName, x.LatestLoginAt);
        }).ToList();
    }
}
