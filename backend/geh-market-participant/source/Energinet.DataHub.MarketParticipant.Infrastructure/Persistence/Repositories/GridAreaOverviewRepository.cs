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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories
{
    public class GridAreaOverviewRepository : IGridAreaOverviewRepository
    {
        private readonly IMarketParticipantDbContext _marketParticipantDbContext;

        public GridAreaOverviewRepository(IMarketParticipantDbContext marketParticipantDbContext)
        {
            _marketParticipantDbContext = marketParticipantDbContext;
        }

        public async Task<IEnumerable<GridAreaOverviewItem>> GetAsync()
        {
            var actorsWithMarketRoleGridArea =
                from actor in _marketParticipantDbContext.Actors
                join marketRole in _marketParticipantDbContext.MarketRoles
                    on actor.Id equals marketRole.ActorInfoId
                join marketRoleGridArea in _marketParticipantDbContext.MarketRoleGridAreas
                    on marketRole.Id equals marketRoleGridArea.MarketRoleId
                where marketRole.Function == EicFunction.GridAccessProvider
                select new { actor, marketRole, marketRoleGridArea };

            var gridAreas =
                from gridArea in _marketParticipantDbContext.GridAreas
                join actorWithMarketRoleGridArea in actorsWithMarketRoleGridArea
                    on gridArea.Id equals actorWithMarketRoleGridArea.marketRoleGridArea.GridAreaId into gr
                from actorWithMarketRoleGridArea in gr.DefaultIfEmpty()
                select new { actorWithMarketRoleGridArea.actor, gridArea };

            var result = await gridAreas.ToListAsync().ConfigureAwait(false);

            return result.Select(x =>
            {
                var gridArea = x.gridArea;
                var actor = x.actor;

                return new GridAreaOverviewItem(
                    new GridAreaId(gridArea.Id),
                    new GridAreaName(gridArea.Name),
                    new GridAreaCode(gridArea.Code),
                    gridArea.PriceAreaCode,
                    gridArea.ValidFrom,
                    gridArea.ValidTo,
                    actor != null ? ActorNumber.Create(actor.ActorNumber) : null,
                    actor != null ? new ActorName(actor.Name) : null,
                    gridArea.FullFlexDate);
            });
        }
    }
}
