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
    /// Repository giving access to domain events
    /// </summary>
    public interface IDomainEventRepository
    {
        /// <summary>
        /// Inserts a <see cref="DomainEvent"/>
        /// </summary>
        Task<DomainEventId> InsertAsync(DomainEvent domainEvent);

        /// <summary>
        /// Saves changes to the given <see cref="DomainEvent"/>
        /// </summary>
        Task UpdateAsync(DomainEvent domainEvent);

        /// <summary>
        /// Retrieves a specified number of of unsent domain events ordered by oldest first
        /// </summary>
        Task<IEnumerable<DomainEvent>> GetOldestUnsentDomainEventsAsync(int numberOfEvents);
    }
}
