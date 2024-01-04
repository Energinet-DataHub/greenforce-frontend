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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Clients.EDI
{
    public class ActorService
    {
        private readonly IMarketParticipantClient_V1 _marketParticipantClient;

        public ActorService(IMarketParticipantClient_V1 marketParticipantClient)
        {
            _marketParticipantClient = marketParticipantClient ??
                                       throw new ArgumentNullException(nameof(marketParticipantClient));
        }

        public async Task<IEnumerable<Actor>> GetActorsAsync(CancellationToken cancellationToken)
        {
            if (cancellationToken.IsCancellationRequested) return new List<Actor>();

            var allActors = await _marketParticipantClient
                .ActorGetAsync()
                .ConfigureAwait(false);

            return MapResult(allActors);
        }

        private IEnumerable<Actor> MapResult(IEnumerable<ActorDto> actorDtos)
        {
            return actorDtos
                .Select(actorDto => new Actor(
                    ActorId: actorDto.ActorId,
                    ActorNumber: new ActorNumberDto(actorDto.ActorNumber.Value),
                    Name: new ActorNameDto(actorDto.Name.Value)))
                .ToList();
        }
    }
}
