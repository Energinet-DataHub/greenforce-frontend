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

namespace Energinet.DataHub.MarketParticipant.Domain.Repositories
{
    /// <summary>
    /// Provides access to organizations.
    /// </summary>
    public interface IOrganizationRepository
    {
        /// <summary>
        /// Adds the given organization to the repository, or updates it, if it already exists.
        /// </summary>
        /// <param name="organization">The organization to add or update.</param>
        /// <returns>The id of the added organization.</returns>
        Task<OrganizationId> AddOrUpdateAsync(Organization organization);

        /// <summary>
        /// Gets an organization with the specified id.
        /// </summary>
        /// <param name="id">The id of the organization to get.</param>
        /// <returns>The organization with the specified id; or null if the organization does not exist.</returns>
        Task<Organization?> GetAsync(OrganizationId id);

        /// <summary>
        /// Gets all organizations.
        /// </summary>
        /// <returns>All organizations.</returns>
        Task<IEnumerable<Organization>> GetAsync();

        /// <summary>
        /// Gets all organizations that contain an actor with the specified GLN.
        /// </summary>
        /// <param name="actorNumber">The GLN to find organizations for.</param>
        /// <returns>The list of organizations with an actor that has the specified GLN.</returns>
        Task<IEnumerable<Organization>> GetAsync(ActorNumber actorNumber);
    }
}
