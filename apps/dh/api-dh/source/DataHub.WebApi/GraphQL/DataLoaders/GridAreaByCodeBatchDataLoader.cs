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

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using GreenDonut;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GridAreaByCodeBatchDataLoader : BatchDataLoader<string, GridAreaDto>
    {
        private readonly IMarketParticipantClient_V1 _client;

        public GridAreaByCodeBatchDataLoader(
            IMarketParticipantClient_V1 client,
            IBatchScheduler batchScheduler,
            DataLoaderOptions? options = null)
            : base(batchScheduler, options) =>
            _client = client;

        protected override async Task<IReadOnlyDictionary<string, GridAreaDto>> LoadBatchAsync(
            IReadOnlyList<string> keys,
            CancellationToken cancellationToken)
        {
            var actors = await _client
                .ActorGetAsync(cancellationToken)
                .ConfigureAwait(false);

            var gridAreas = await _client
                .GridAreaGetAsync(cancellationToken)
                .ConfigureAwait(false);

            var result = new Dictionary<string, GridAreaDto>();

            foreach (var gridArea in gridAreas)
            {
                var owner = actors.FirstOrDefault(actor =>
                    actor.Status == "Active" &&
                    actor.MarketRoles.Any(mr =>
                        mr.EicFunction == EicFunction.GridAccessProvider &&
                        mr.GridAreas.Any(ga => ga.Id == gridArea.Id)));

                if (owner != null)
                {
                    result.Add(gridArea.Code, new GridAreaDto
                    {
                        Id = gridArea.Id,
                        Code = gridArea.Code,
                        Name = owner.Name.Value,
                        PriceAreaCode = gridArea.PriceAreaCode,
                        ValidFrom = gridArea.ValidFrom,
                        ValidTo = gridArea.ValidTo,
                    });
                }
                else
                {
                    result.Add(gridArea.Code, gridArea);
                }
            }

            return result;
        }
    }
}
