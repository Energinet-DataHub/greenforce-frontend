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
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Repositories
{
    /// <summary>
    /// Provides access to the Grid Areas.
    /// </summary>
    public interface IActorContactRepository
    {
        /// <summary>
        /// Gets an Contact with the specified Id
        /// </summary>
        /// <param name="contactId">The Id of the Contact to get.</param>
        /// <returns>The specified Contact or null if not found</returns>
        Task<ActorContact?> GetAsync(ContactId contactId);

        /// <summary>
        /// Gets all contacts tied to a specific actor.
        /// </summary>
        /// <param name="actorId">The id of the actor to get the contacts for.</param>
        /// <returns>A collection of contacts tied to the specified actor.</returns>
        Task<IEnumerable<ActorContact>> GetAsync(Guid actorId);

        /// <summary>
        /// Updates a Contact, or adds it if it's not already present.
        /// </summary>
        /// <param name="contact">The Contact to add or update</param>
        /// <returns>The id of the added Contact</returns>
        Task<ContactId> AddAsync(ActorContact contact);

        /// <summary>
        /// Deletes the specified contact.
        /// </summary>
        /// <param name="contact">The contact to delete.</param>
        Task RemoveAsync(ActorContact contact);
    }
}
