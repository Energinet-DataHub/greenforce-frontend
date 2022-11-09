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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    /// <summary>
    /// A factory service ensuring correct construction of an actor.
    /// </summary>
    public interface IActorFactoryService
    {
        /// <summary>
        /// Creates an actor.
        /// </summary>
        /// <param name="organization">The organization that will contain the new actor.</param>
        /// <param name="actorNumber">The actor number of the new actor.</param>
        /// <param name="actorName">The actor name for the new actor.</param>
        /// <param name="marketRoles">The market roles assigned to the new actor.</param>
        /// <returns>The created actor.</returns>
        Task<Actor> CreateAsync(
            Organization organization,
            ActorNumber actorNumber,
            ActorName actorName,
            IReadOnlyCollection<ActorMarketRole> marketRoles);
    }
}
