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
    /// BFF client for contacts in Energinet.DataHub.MarketParticipant.
    /// </summary>
    public interface IMarketParticipantActorContactClient
    {
        /// <summary>
        /// List all contacts for an actor.
        /// </summary>
        /// <param name="organizationId">The id of the organization.</param>
        /// <param name="actorId">The id of the actor.</param>
        /// <returns>A list of contacts <see cref="ActorDto"/> belonging to the actor.</returns>
        Task<IEnumerable<ActorContactDto>> GetContactsAsync(Guid organizationId, Guid actorId);

        /// <summary>
        /// Creates a new contact for an actor.
        /// </summary>
        /// <param name="organizationId">The id of the organization.</param>
        /// <param name="actorId">The id of the actor.</param>
        /// <param name="contactDto">The details of the contact to create.</param>
        /// <returns>The id of the created contact.</returns>
        Task<Guid> CreateContactAsync(Guid organizationId, Guid actorId, CreateActorContactDto contactDto);

        /// <summary>
        /// Removes the specified contact from an actor.
        /// </summary>
        /// <param name="organizationId">The id of the organization.</param>
        /// <param name="actorId">The id of the actor.</param>
        /// <param name="contactId">The id of the contact.</param>
        Task DeleteContactAsync(Guid organizationId, Guid actorId, Guid contactId);
    }
}
