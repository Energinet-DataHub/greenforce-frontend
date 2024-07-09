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

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    [Error(typeof(ApiException))]
    public async Task<bool> UpdateUserProfileAsync(
           UserProfileUpdateDto userProfileUpdateDto,
           [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserUserprofilePutAsync(userProfileUpdateDto).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> UpdateUserIdentityAsync(
            Guid userId,
            UserIdentityUpdateDto userIdentityUpdateDto,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserUseridentityAsync(userId, userIdentityUpdateDto).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> InviteUserAsync(
            UserInvitationDto userInviteDto,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UsersInviteAsync(userInviteDto).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> ReInviteUserAsync(
            Guid userId,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UsersReinviteAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> ResetTwoFactorAuthenticationAsync(
            Guid userId,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserReset2faAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> DeactivateUserAsync(
            Guid userId,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserDeactivateAsync(userId).ConfigureAwait(false);
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> ReActivateUserAsync(
            Guid userId,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserReactivateAsync(userId).ConfigureAwait(false);
        return true;
    }
}
