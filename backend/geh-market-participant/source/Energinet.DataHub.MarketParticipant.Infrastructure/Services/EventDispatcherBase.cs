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
using System.Globalization;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using NodaTime;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services
{
    public abstract class EventDispatcherBase : IIntegrationEventDispatcher
    {
        private readonly IMarketParticipantServiceBusClient _serviceBusClient;

        protected EventDispatcherBase(IMarketParticipantServiceBusClient serviceBusClient)
        {
            _serviceBusClient = serviceBusClient;
        }

        public abstract Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent);

        protected async Task DispatchAsync(BaseIntegrationEvent integrationEvent, byte[] payload)
        {
            ArgumentNullException.ThrowIfNull(integrationEvent);
            ArgumentNullException.ThrowIfNull(payload);

            var message = new ServiceBusMessage(payload);

            SetEventTypeMetadata(message, integrationEvent);
            SetIntegrationEventMetadata(message, integrationEvent);

            var sender = _serviceBusClient.CreateSender();

            await using (sender.ConfigureAwait(false))
            {
                await sender.SendMessageAsync(message).ConfigureAwait(false);
            }
        }

        private static void SetEventTypeMetadata(ServiceBusMessage message, BaseIntegrationEvent baseIntegrationEvent)
        {
            message.ApplicationProperties.Add("IntegrationEventType", baseIntegrationEvent.Type);
        }

        private static void SetIntegrationEventMetadata(ServiceBusMessage message, BaseIntegrationEvent baseIntegrationEvent)
        {
            var correlationId = Guid.NewGuid();
            var timestamp = SystemClock
                .Instance
                .GetCurrentInstant()
                .ToString(null, CultureInfo.InvariantCulture);

            message.ApplicationProperties.Add("OperationTimestamp", timestamp);
            message.ApplicationProperties.Add("OperationCorrelationId", correlationId.ToString());
            message.ApplicationProperties.Add("MessageVersion", 1);
            message.ApplicationProperties.Add("MessageType", baseIntegrationEvent.Type);
            message.ApplicationProperties.Add("EventIdentification", baseIntegrationEvent.Id.ToString());
        }
    }
}
