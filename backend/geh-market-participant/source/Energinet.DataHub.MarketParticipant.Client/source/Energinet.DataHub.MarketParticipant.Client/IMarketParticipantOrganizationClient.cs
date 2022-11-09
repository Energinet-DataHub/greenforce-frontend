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
    /// BFF client for organizations in Energinet.DataHub.MarketParticipant.
    /// </summary>
    public interface IMarketParticipantOrganizationClient
    {
        /// <summary>
        /// Gets all organizations.
        /// </summary>
        /// <returns>A list of all the organizations.</returns>
        Task<IEnumerable<OrganizationDto>> GetOrganizationsAsync();

        /// <summary>
        /// Gets an organization with the specified id.
        /// </summary>
        /// <param name="organizationId">The id of the organization to get.</param>
        /// <returns>The organization <see cref="OrganizationDto" /> with the specified id.</returns>
        Task<OrganizationDto> GetOrganizationAsync(Guid organizationId);

        /// <summary>
        /// Creates a new organization.
        /// </summary>
        /// <param name="organizationDto">The organization to create.</param>
        /// <returns>The id <see cref="Guid"/> of the created organization.</returns>
        Task<Guid> CreateOrganizationAsync(CreateOrganizationDto organizationDto);

        /// <summary>
        /// Updates an organization.
        /// </summary>
        /// <param name="organizationId">The id of the organization to update.</param>
        /// <param name="organizationDto">The updated data for the organization.</param>
        Task UpdateOrganizationAsync(Guid organizationId, ChangeOrganizationDto organizationDto);
    }
}
