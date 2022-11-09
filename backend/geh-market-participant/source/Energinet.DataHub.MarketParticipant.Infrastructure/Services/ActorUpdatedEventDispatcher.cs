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
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services
{
    public sealed class ActorUpdatedEventDispatcher : EventDispatcherBase
    {
        private readonly IActorUpdatedIntegrationEventParser _eventParser;

        public ActorUpdatedEventDispatcher(
            IActorUpdatedIntegrationEventParser eventParser,
            IMarketParticipantServiceBusClient serviceBusClient)
            : base(serviceBusClient)
        {
            _eventParser = eventParser;
        }

        public override async Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent)
        {
            ArgumentNullException.ThrowIfNull(integrationEvent);

            if (integrationEvent is not Domain.Model.IntegrationEvents.ActorIntegrationEvents.ActorUpdatedIntegrationEvent actorUpdatedIntegrationEvent)
                return false;

            var actorNumber = new ActorNumber(
                actorUpdatedIntegrationEvent.ActorNumber.Value,
                (ActorNumberType)actorUpdatedIntegrationEvent.ActorNumber.Type);

            var outboundIntegrationEvent = new ActorUpdatedIntegrationEvent(
                actorUpdatedIntegrationEvent.Id,
                actorUpdatedIntegrationEvent.EventCreated,
                actorUpdatedIntegrationEvent.ActorId,
                actorUpdatedIntegrationEvent.OrganizationId.Value,
                actorUpdatedIntegrationEvent.ExternalActorId?.Value,
                actorNumber,
                (ActorStatus)actorUpdatedIntegrationEvent.Status,
                actorUpdatedIntegrationEvent.BusinessRoles.Select(x => (BusinessRoleCode)x),
                actorUpdatedIntegrationEvent.ActorMarketRoles.Select(x =>
                    new ActorMarketRole((EicFunction)x.Function, x.GridAreas.Select(y =>
                        new ActorGridArea(y.Id, y.MeteringPointTypes)))));

            var bytes = _eventParser.ParseToSharedIntegrationEvent(outboundIntegrationEvent);
            await DispatchAsync(outboundIntegrationEvent, bytes).ConfigureAwait(false);

            return true;
        }
    }
}
