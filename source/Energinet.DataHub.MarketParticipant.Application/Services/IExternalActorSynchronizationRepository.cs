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

namespace Energinet.DataHub.MarketParticipant.Application.Services;

/// <summary>
/// Schedules synchronization of actors into external systems.
/// </summary>
public interface IExternalActorSynchronizationRepository
{
    /// <summary>
    /// Schedules synchronization of the specified actor.
    /// </summary>
    /// <param name="organizationId">The organization id of the actor.</param>
    /// <param name="actorId">The actor id.</param>
    Task ScheduleAsync(OrganizationId organizationId, Guid actorId);

    /// <summary>
    /// Dequeue the next scheduled actor for synchronization.
    /// Returns null if there are no actors to synchronize.
    /// </summary>
    Task<(OrganizationId OrganizationId, Guid ActorId)?> DequeueNextAsync();
}
