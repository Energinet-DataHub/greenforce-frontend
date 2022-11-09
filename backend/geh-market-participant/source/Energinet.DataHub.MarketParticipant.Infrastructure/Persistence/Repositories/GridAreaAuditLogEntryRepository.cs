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
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories
{
    public sealed class GridAreaAuditLogEntryRepository : IGridAreaAuditLogEntryRepository
    {
        private readonly IMarketParticipantDbContext _context;

        public GridAreaAuditLogEntryRepository(IMarketParticipantDbContext context)
        {
            _context = context;
        }

        public async Task InsertAsync(GridAreaAuditLogEntry logEntry)
        {
            ArgumentNullException.ThrowIfNull(logEntry);

            var entity = new GridAreaAuditLogEntryEntity
            {
                UserId = logEntry.UserId,
                Timestamp = logEntry.Timestamp,
                Field = logEntry.Field,
                OldValue = logEntry.OldValue,
                NewValue = logEntry.NewValue,
                GridAreaId = logEntry.GridAreaId
            };

            _context.GridAreaAuditLogEntries.Add(entity);

            await _context.SaveChangesAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<GridAreaAuditLogEntry>> GetAsync(GridAreaId gridAreaId)
        {
            var query = from l in _context.GridAreaAuditLogEntries.AsQueryable()
                        where l.GridAreaId == gridAreaId.Value
                        select l;

            return (await query.ToListAsync().ConfigureAwait(false))
                .Select(x =>
                    new GridAreaAuditLogEntry(
                        x.Timestamp,
                        x.UserId,
                        x.Field,
                        x.OldValue,
                        x.NewValue,
                        x.GridAreaId));
        }
    }
}
