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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Repositories
{
    /// <summary>
    /// Provides access to UniqueActorMarketRoleGridAreas.
    /// </summary>
    public interface IUniqueActorMarketRoleGridAreaRepository
    {
        /// <summary>
        /// Tries to add the UniqueActorMarketRoleGridArea />
        /// </summary>
        /// <param name="domain"></param>
        /// <returns>true if operation succeeded, otherwise false.</returns>
        Task<bool> TryAddAsync(UniqueActorMarketRoleGridArea domain);

        /// <summary>
        /// Removes all UniqueActorMarketRoleGridAreas for the given actor ID
        /// </summary>
        /// <param name="actorId"></param>
        Task RemoveAsync(Guid actorId);
    }
}
