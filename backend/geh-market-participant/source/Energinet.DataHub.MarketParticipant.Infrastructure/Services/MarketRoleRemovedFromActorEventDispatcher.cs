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
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services;

public sealed class MarketRoleRemovedFromActorEventDispatcher : EventDispatcherBase
{
    private readonly IMarketRoleRemovedFromActorIntegrationEventParser _eventParser;

    public MarketRoleRemovedFromActorEventDispatcher(
        IMarketRoleRemovedFromActorIntegrationEventParser eventParser,
        IMarketParticipantServiceBusClient serviceBusClient)
        : base(serviceBusClient)
    {
        _eventParser = eventParser;
    }

    public override async Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent)
    {
        ArgumentNullException.ThrowIfNull(integrationEvent);

        if (integrationEvent is not Domain.Model.IntegrationEvents.ActorIntegrationEvents.MarketRoleRemovedFromActorIntegrationEvent marketRoleAddedToActorIntegrationEvent)
        {
            return false;
        }

        var outboundIntegrationEvent = new MarketRoleRemovedFromActorIntegrationEvent(
            marketRoleAddedToActorIntegrationEvent.Id,
            marketRoleAddedToActorIntegrationEvent.ActorId,
            marketRoleAddedToActorIntegrationEvent.OrganizationId.Value,
            (BusinessRoleCode)marketRoleAddedToActorIntegrationEvent.BusinessRole,
            (EicFunction)marketRoleAddedToActorIntegrationEvent.MarketRole,
            marketRoleAddedToActorIntegrationEvent.EventCreated);

        var bytes = _eventParser.ParseToSharedIntegrationEvent(outboundIntegrationEvent);
        await DispatchAsync(outboundIntegrationEvent, bytes).ConfigureAwait(false);

        return true;
    }
}
