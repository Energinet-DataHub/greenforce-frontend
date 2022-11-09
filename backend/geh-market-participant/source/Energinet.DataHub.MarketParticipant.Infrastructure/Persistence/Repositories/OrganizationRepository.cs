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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Mappers;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories
{
    public sealed class OrganizationRepository : IOrganizationRepository
    {
        private readonly IMarketParticipantDbContext _marketParticipantDbContext;

        public OrganizationRepository(IMarketParticipantDbContext marketParticipantDbContext)
        {
            _marketParticipantDbContext = marketParticipantDbContext;
        }

        public async Task<OrganizationId> AddOrUpdateAsync(Organization organization)
        {
            ArgumentNullException.ThrowIfNull(organization, nameof(organization));

            OrganizationEntity destination;

            if (organization.Id.Value == default)
            {
                destination = new OrganizationEntity();
            }
            else
            {
                destination = await GetOrganizationQuery()
                    .FirstAsync(x => x.Id == organization.Id.Value)
                    .ConfigureAwait(false);
            }

            OrganizationMapper.MapToEntity(organization, destination);
            _marketParticipantDbContext.Organizations.Update(destination);

            foreach (var actor in destination.Actors.Where(x => x.New))
            {
                _marketParticipantDbContext.Entry(actor).State = EntityState.Added;
                foreach (var mr in actor.MarketRoles)
                {
                    _marketParticipantDbContext.Entry(mr).State = EntityState.Added;
                    foreach (var ga in mr.GridAreas)
                    {
                        _marketParticipantDbContext.Entry(ga).State = EntityState.Added;
                        foreach (var mp in ga.MeteringPointTypes)
                        {
                            _marketParticipantDbContext.Entry(mp).State = EntityState.Added;
                        }
                    }
                }

                actor.New = false;
            }

            await _marketParticipantDbContext.SaveChangesAsync().ConfigureAwait(false);
            return new OrganizationId(destination.Id);
        }

        public async Task<Organization?> GetAsync(OrganizationId id)
        {
            ArgumentNullException.ThrowIfNull(id, nameof(id));

            var org = await GetOrganizationQuery()
                .FirstOrDefaultAsync(x => x.Id == id.Value)
                .ConfigureAwait(false);

            return org is not null ? OrganizationMapper.MapFromEntity(org) : null;
        }

        public async Task<IEnumerable<Organization>> GetAsync()
        {
            var entities = await GetOrganizationQuery()
                .OrderBy(x => x.Name)
                .ToListAsync()
                .ConfigureAwait(false);

            return entities.Select(OrganizationMapper.MapFromEntity);
        }

        public async Task<IEnumerable<Organization>> GetAsync(ActorNumber actorNumber)
        {
            ArgumentNullException.ThrowIfNull(actorNumber, nameof(actorNumber));

            var organizations = await GetOrganizationQuery()
                .Where(x => x.Actors.Any(y => y.ActorNumber == actorNumber.Value))
                .ToListAsync()
                .ConfigureAwait(false);

            return organizations.Select(OrganizationMapper.MapFromEntity);
        }

        private IQueryable<OrganizationEntity> GetOrganizationQuery()
        {
            return _marketParticipantDbContext
                .Organizations
                .Include(x => x.Actors)
                .ThenInclude(x => x.MarketRoles)
                .ThenInclude(x => x.GridAreas)
                .ThenInclude(m => m.MeteringPointTypes)
                .Include(x => x.Address)
                .AsSingleQuery();
        }
    }
}
