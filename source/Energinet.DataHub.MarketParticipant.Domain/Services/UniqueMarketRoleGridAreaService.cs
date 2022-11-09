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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    public sealed class UniqueMarketRoleGridAreaService : IUniqueMarketRoleGridAreaService
    {
        private readonly IUniqueActorMarketRoleGridAreaRepository _repository;

        public UniqueMarketRoleGridAreaService(IUniqueActorMarketRoleGridAreaRepository repository)
        {
            _repository = repository;
        }

        private static HashSet<EicFunction> MarketRoleSet => new HashSet<EicFunction>
        {
            EicFunction.GridAccessProvider,
            EicFunction.MeterAdministrator,
            EicFunction.MeterOperator,
            EicFunction.MeteredDataCollector,
            EicFunction.PartyConnectedToTheGrid
        };

        public async Task EnsureUniqueMarketRolesPerGridAreaAsync(Actor actor)
        {
            ArgumentNullException.ThrowIfNull(actor, nameof(actor));

            var actorMarketRoles = actor.MarketRoles.Where(x => MarketRoleSet.Contains(x.Function));

            await _repository.RemoveAsync(actor.Id).ConfigureAwait(false);

            foreach (var actorMarketRole in actorMarketRoles)
            {
                foreach (var gridArea in actorMarketRole.GridAreas)
                {
                    var uniqueMarketRoleGridArea = new UniqueActorMarketRoleGridArea(actor.Id, actorMarketRole.Function, gridArea.Id);

                    if (!await _repository.TryAddAsync(uniqueMarketRoleGridArea).ConfigureAwait(false))
                    {
                        throw new ValidationException($"Another actor is already assigned the role of '{actorMarketRole.Function}' for the chosen grid area.");
                    }
                }
            }
        }
    }
}
