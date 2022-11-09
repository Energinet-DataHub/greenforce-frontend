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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;

public sealed class ExternalActorSynchronizationRepository : IExternalActorSynchronizationRepository
{
    private readonly IMarketParticipantDbContext _marketParticipantDbContext;

    public ExternalActorSynchronizationRepository(IMarketParticipantDbContext marketParticipantDbContext)
    {
        _marketParticipantDbContext = marketParticipantDbContext;
    }

    public async Task ScheduleAsync(OrganizationId organizationId, Guid actorId)
    {
        ArgumentNullException.ThrowIfNull(organizationId);
        ArgumentNullException.ThrowIfNull(actorId);

        var actorSync = new ActorSynchronizationEntity
        {
            OrganizationId = organizationId.Value,
            ActorId = actorId
        };

        await _marketParticipantDbContext
            .ActorSynchronizationEntries
            .AddAsync(actorSync)
            .ConfigureAwait(false);

        await _marketParticipantDbContext
            .SaveChangesAsync()
            .ConfigureAwait(false);
    }

    public async Task<(OrganizationId OrganizationId, Guid ActorId)?> DequeueNextAsync()
    {
        var query =
            from actorSync in _marketParticipantDbContext.ActorSynchronizationEntries
            orderby actorSync.Id
            select actorSync;

        var nextEntity = await query.FirstOrDefaultAsync().ConfigureAwait(false);
        if (nextEntity == null)
            return null;

        _marketParticipantDbContext.ActorSynchronizationEntries.Remove(nextEntity);
        await _marketParticipantDbContext
            .SaveChangesAsync()
            .ConfigureAwait(false);

        return (new OrganizationId(nextEntity.OrganizationId), nextEntity.ActorId);
    }
}
