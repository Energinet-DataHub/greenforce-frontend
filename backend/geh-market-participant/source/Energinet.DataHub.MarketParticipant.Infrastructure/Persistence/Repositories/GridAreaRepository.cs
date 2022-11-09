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
    public class GridAreaRepository : IGridAreaRepository
    {
        private readonly IMarketParticipantDbContext _marketParticipantDbContext;

        public GridAreaRepository(IMarketParticipantDbContext marketParticipantDbContext)
        {
            _marketParticipantDbContext = marketParticipantDbContext;
        }

        public async Task<GridAreaId> AddOrUpdateAsync(GridArea gridArea)
        {
            ArgumentNullException.ThrowIfNull(gridArea, nameof(gridArea));

            GridAreaEntity destination;
            if (gridArea.Id.Value == default)
            {
                destination = new GridAreaEntity();
            }
            else
            {
                destination = await _marketParticipantDbContext
                    .GridAreas
                    .FindAsync(gridArea.Id.Value)
                    .ConfigureAwait(false) ?? throw new InvalidOperationException($"GridArea with id {gridArea.Id.Value} is missing, even though it cannot be deleted.");
            }

            GridAreaMapper.MapToEntity(gridArea, destination);
            _marketParticipantDbContext.GridAreas.Update(destination);

            await _marketParticipantDbContext.SaveChangesAsync().ConfigureAwait(false);

            return new GridAreaId(destination.Id);
        }

        public async Task<GridArea?> GetAsync(GridAreaId id)
        {
            ArgumentNullException.ThrowIfNull(id, nameof(id));

            var gridArea = await _marketParticipantDbContext.GridAreas
                .FindAsync(id.Value)
                .ConfigureAwait(false);

            return gridArea is null ? null : GridAreaMapper.MapFromEntity(gridArea);
        }

        public async Task<IEnumerable<GridArea>> GetAsync()
        {
            var query = from gridArea in _marketParticipantDbContext.GridAreas
                        select gridArea;

            var entites = await query.ToListAsync().ConfigureAwait(false);

            return entites.Select(GridAreaMapper.MapFromEntity);
        }
    }
}
