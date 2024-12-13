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

public class ConsolidationByGridAreaIdBatchDataLoader : BatchDataLoader<string, DateTimeOffset?>
{
    private readonly IMarketParticipantClient_V1 _client;

    public ConsolidationByGridAreaIdBatchDataLoader(
        IMarketParticipantClient_V1 client,
        IBatchScheduler batchScheduler,
        DataLoaderOptions options)
        : base(batchScheduler, options) =>
        _client = client;

    protected override async Task<IReadOnlyDictionary<string, DateTimeOffset?>> LoadBatchAsync(
        IReadOnlyList<string> keys,
        CancellationToken cancellationToken)
        {
            var gridAreas = (await _client.GridAreaGetAsync(cancellationToken))
                .Where(x => keys.Contains(x.Code))
                .Select(x => (x.Id, x.Code))
                .ToDictionary(x => x.Id, x => x.Code);

            var consolidations = (await _client.ActorConsolidationsAsync(cancellationToken)).ActorConsolidations;

            var returnDict = new Dictionary<string, DateTimeOffset?>();
            foreach (var gridArea in gridAreas)
            {
                var audits = (await _client
                .GridAreaAuditAsync(gridArea.Key, cancellationToken))
                .Where(x => x.Change == GridAreaAuditedChange.ConsolidationRequested || x.Change == GridAreaAuditedChange.ConsolidationCompleted);

                var completed = audits.FirstOrDefault(x => x.Change == GridAreaAuditedChange.ConsolidationCompleted);
                var requested = audits.FirstOrDefault(x => x.Change == GridAreaAuditedChange.ConsolidationRequested);
                if (completed is null && requested is null)
                {
                    returnDict.Add(gridArea.Value, null);
                    continue;
                }

                if (completed is not null)
                {
                    returnDict.Add(gridArea.Value, completed.Timestamp);
                    continue;
                }

                if (requested is not null)
                {
                    returnDict.Add(gridArea.Value, requested.Timestamp);
                    continue;
                }
            }

            return returnDict;
        }
}
