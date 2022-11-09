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
using Energinet.DataHub.MarketParticipant.Domain.Model.ActiveDirectory;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    /// <summary>
    /// Service for accessing Azure AD.
    /// </summary>
    public interface IActiveDirectoryService
    {
        /// <summary>
        /// Creates a consumer app registration.
        /// </summary>
        /// <param name="actorNumber">The actor number of the actor to create.</param>
        /// <param name="permissions">Roles to be assigned to the app.</param>
        /// <returns>A <see cref="CreateAppRegistrationResponse"/> representing the newly created app and service principal.</returns>
        Task<CreateAppRegistrationResponse> CreateAppRegistrationAsync(
            ActorNumber actorNumber,
            IReadOnlyCollection<EicFunction> permissions);

        /// <summary>
        /// Gets an existing app from active directory.
        /// </summary>
        /// <param name="appRegistrationObjectId">The object id for the registered app.</param>
        /// <param name="appRegistrationServicePrincipalObjectId">The object id representing the service principal.</param>
        /// <returns>A <see cref="ActiveDirectoryAppInformation"/> representing the retrieved app.</returns>
        Task<ActiveDirectoryAppInformation> GetExistingAppRegistrationAsync(
            AppRegistrationObjectId appRegistrationObjectId,
            AppRegistrationServicePrincipalObjectId appRegistrationServicePrincipalObjectId);

        /// <summary>
        /// Deletes the registered app from active directory.
        /// </summary>
        /// <param name="externalActorId">The unique id for the app.</param>
        Task DeleteAppRegistrationAsync(ExternalActorId externalActorId);
    }
}
