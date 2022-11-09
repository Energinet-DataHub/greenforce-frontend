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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;

namespace Energinet.DataHub.MarketParticipant.Client
{
    /// <summary>
    /// BFF client for actors in Energinet.DataHub.MarketParticipant.
    /// </summary>
    public interface IMarketParticipantActorClient
    {
        /// <summary>
        /// List all actors in an organization.
        /// </summary>
        /// <param name="organizationId">The id of the organization to get the actors for.</param>
        /// <returns>A list of actors <see cref="ActorDto"/> belonging to the organization.</returns>
        Task<IEnumerable<ActorDto>> GetActorsAsync(Guid organizationId);

        /// <summary>
        /// Gets an actor.
        /// </summary>
        /// <param name="organizationId">The organization the actor belongs to.</param>
        /// <param name="actorId">The id of the actor to get.</param>
        /// <returns>An <see cref="ActorDto" /> actor.</returns>
        Task<ActorDto> GetActorAsync(Guid organizationId, Guid actorId);

        /// <summary>
        /// Creates an actor in a specific organization.
        /// </summary>
        /// <param name="organizationId">The id of the organization to create the actor in.</param>
        /// <param name="createActorDto">The details of the actor to be created.</param>
        /// <returns>The id of the created actor.</returns>
        Task<Guid> CreateActorAsync(Guid organizationId, CreateActorDto createActorDto);

        /// <summary>
        /// Updates the specified actor.
        /// </summary>
        /// <param name="organizationId">The id of the organization the actor belongs to.</param>
        /// <param name="actorId">The id of the actor to update.</param>
        /// <param name="changeActorDto">The data to update.</param>
        Task UpdateActorAsync(Guid organizationId, Guid actorId, ChangeActorDto changeActorDto);
    }
}
