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
using Energinet.DataHub.WebApi.GraphQL.Types.Actor;

namespace Energinet.DataHub.WebApi.GraphQL.DataLoaders;

public class ActorNameByIdBatchDataLoader : BatchDataLoader<Guid, ActorNameWithId?>
{
    private readonly IMarketParticipantClient_V1 _client;

    public ActorNameByIdBatchDataLoader(
        IMarketParticipantClient_V1 client,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options) =>
        _client = client;

    protected override async Task<IReadOnlyDictionary<Guid, ActorNameWithId?>> LoadBatchAsync(
        IReadOnlyList<Guid> keys,
        CancellationToken cancellationToken)
        {
            var result = new Dictionary<Guid, ActorNameWithId?>();
            var actors = await _client.ActorGetAsync(cancellationToken).ConfigureAwait(false);
            foreach (var actor in actors.Where(x => keys.Contains(x.ActorId)))
            {
                result.Add(actor.ActorId, new ActorNameWithId(actor.ActorId, actor.Name));
            }

            return result;
        }
}
