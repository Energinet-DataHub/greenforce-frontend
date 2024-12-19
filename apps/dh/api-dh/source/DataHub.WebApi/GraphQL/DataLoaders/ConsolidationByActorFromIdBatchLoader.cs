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

public class ConsolidationByActorFromIdBatchLoader(
    IMarketParticipantClient_V1 client,
    IBatchScheduler batchScheduler,
    DataLoaderOptions options)
    : BatchDataLoader<Guid, ActorConsolidationDto>(batchScheduler, options)
{
    protected override async Task<IReadOnlyDictionary<Guid, ActorConsolidationDto>> LoadBatchAsync(
        IReadOnlyList<Guid> keys,
        CancellationToken cancellationToken)
    {
        var consolidations = (await client.ActorConsolidationsAsync(cancellationToken)).ActorConsolidations;

        return consolidations
            .Select(c => new KeyValuePair<Guid, ActorConsolidationDto>(c.ActorFromId, c))
            .ToDictionary();
    }
}
