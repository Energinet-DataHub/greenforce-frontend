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
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories
{
    public sealed class DomainEventRepository : IDomainEventRepository
    {
        private readonly IMarketParticipantDbContext _context;
        private readonly IDictionary<string, Type> _domainEventTypesByName;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public DomainEventRepository(IMarketParticipantDbContext context)
        {
            _context = context;
            _domainEventTypesByName = typeof(IIntegrationEvent).Assembly.GetTypes().Where(x => x.IsAssignableTo(typeof(IIntegrationEvent))).ToDictionary(x => x.Name);
        }

        [SuppressMessage("Reliability", "CA2007:Consider calling ConfigureAwait on the awaited task", Justification = "Issue: https://github.com/dotnet/roslyn-analyzers/issues/5712")]
        public async Task<DomainEventId> InsertAsync(DomainEvent domainEvent)
        {
            ArgumentNullException.ThrowIfNull(domainEvent, nameof(domainEvent));

            var integrationEvent = domainEvent.IntegrationEvent;

            await using var ms = new MemoryStream();
            await JsonSerializer
                .SerializeAsync(ms, integrationEvent, integrationEvent.GetType(), _jsonSerializerOptions)
                .ConfigureAwait(false);

            var entity = new DomainEventEntity
            {
                EntityId = domainEvent.DomainObjectId,
                EntityType = domainEvent.DomainObjectType,
                Timestamp = DateTimeOffset.UtcNow,
                Event = Encoding.UTF8.GetString(ms.ToArray()),
                EventTypeName = integrationEvent.GetType().Name
            };

            await _context.DomainEvents.AddAsync(entity).ConfigureAwait(false);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return new DomainEventId(entity.Id);
        }

        public async Task UpdateAsync(DomainEvent domainEvent)
        {
            ArgumentNullException.ThrowIfNull(domainEvent, nameof(domainEvent));

            var entity = await _context.DomainEvents.FindAsync(domainEvent.Id.Value).ConfigureAwait(false);
            if (entity == null)
            {
                throw new NotFoundValidationException($"{nameof(DomainEvent)} with ID {domainEvent.Id} was not found");
            }

            entity.IsSent = domainEvent.IsSent;

            await _context.SaveChangesAsync().ConfigureAwait(false);
        }

        [SuppressMessage("Reliability", "CA2007:Consider calling ConfigureAwait on the awaited task", Justification = "Issue: https://github.com/dotnet/roslyn-analyzers/issues/5712")]
        public async Task<IEnumerable<DomainEvent>> GetOldestUnsentDomainEventsAsync(int numberOfEvents)
        {
            var q = from x in _context.DomainEvents.AsQueryable()
                    where x.IsSent == false
                    orderby x.Id
                    select x;

            var domainEvents = new List<DomainEvent>();

            await foreach (var entity in q.Take(numberOfEvents).AsAsyncEnumerable())
            {
                if (!_domainEventTypesByName.TryGetValue(entity.EventTypeName, out var type))
                {
                    throw new InvalidOperationException($"Unknown EventType {entity.EventTypeName}");
                }

                await using var ms = new MemoryStream(Encoding.UTF8.GetBytes(entity.Event));

                var domainEvent = await JsonSerializer.DeserializeAsync(ms, type, _jsonSerializerOptions).ConfigureAwait(false);
                if (domainEvent == null)
                {
                    throw new InvalidOperationException($"{nameof(DomainEvent)} with ID: {entity.Id} could not be deserialized");
                }

                domainEvents.Add(new DomainEvent(
                    new DomainEventId(entity.Id),
                    entity.EntityId,
                    entity.EntityType,
                    entity.IsSent,
                    (IIntegrationEvent)domainEvent));
            }

            return domainEvents;
        }
    }
}
