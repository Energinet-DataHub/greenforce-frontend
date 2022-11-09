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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands;
using Energinet.DataHub.MarketParticipant.Domain.Repositories;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using MediatR;

namespace Energinet.DataHub.MarketParticipant.Application.Handlers
{
    public sealed class DispatchEventsHandler : IRequestHandler<DispatchEventsCommand>
    {
        private readonly IDomainEventRepository _domainEventRepository;
        private readonly IEnumerable<IIntegrationEventDispatcher> _integrationEventDispatchers;

        public DispatchEventsHandler(
            IDomainEventRepository domainEventRepository,
            IEnumerable<IIntegrationEventDispatcher> integrationEventDispatchers)
        {
            _domainEventRepository = domainEventRepository;
            _integrationEventDispatchers = integrationEventDispatchers;
        }

        public async Task<Unit> Handle(DispatchEventsCommand request, CancellationToken cancellationToken)
        {
            ArgumentNullException.ThrowIfNull(request, nameof(request));

            foreach (var domainEvent in await _domainEventRepository.GetOldestUnsentDomainEventsAsync(100).ConfigureAwait(false))
            {
                foreach (var dispatcher in _integrationEventDispatchers)
                {
                    if (await dispatcher.TryDispatchAsync(domainEvent.IntegrationEvent).ConfigureAwait(false))
                    {
                        domainEvent.MarkAsSent();
                        await _domainEventRepository.UpdateAsync(domainEvent).ConfigureAwait(false);
                        break;
                    }
                }

                if (!domainEvent.IsSent)
                {
                    throw new InvalidOperationException($"No dispatcher found for event {domainEvent.IntegrationEvent.GetType().Name}");
                }
            }

            return Unit.Value;
        }
    }
}
