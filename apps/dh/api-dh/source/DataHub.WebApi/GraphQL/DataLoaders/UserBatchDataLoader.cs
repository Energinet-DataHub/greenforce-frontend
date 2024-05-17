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

namespace Energinet.DataHub.WebApi.GraphQL.DataLoaders;

public class UserBatchDataLoader : BatchDataLoader<Guid, UserOverviewItemDto>
{
    private readonly IMarketParticipantClient_V1 _client;

    public UserBatchDataLoader(
        IMarketParticipantClient_V1 client,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options) =>
        _client = client;

    protected override async Task<IReadOnlyDictionary<Guid, UserOverviewItemDto>> LoadBatchAsync(IReadOnlyList<Guid> keys, CancellationToken cancellationToken)
    {
        var filters = new UserOverviewFilterDto()
        {
            ActorId = null,
            SearchText = null,
            UserRoleIds = Array.Empty<Guid>(),
            UserStatus = Array.Empty<UserStatus>(),
        };
        var result = await _client.UserOverviewUsersSearchAsync(1, int.MaxValue, UserOverviewSortProperty.Email, SortDirection.Asc, filters, cancellationToken);
        return result.Users.ToDictionary(x => x.Id);
    }
}
