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
using Azure.Messaging.ServiceBus;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services
{
    public sealed class MarketParticipantServiceBusClient : IAsyncDisposable, IMarketParticipantServiceBusClient
    {
        private readonly ServiceBusClient _client;
        private readonly ServiceBusConfig _serviceBusConfig;

        public MarketParticipantServiceBusClient(ServiceBusConfig serviceBusConfig)
        {
            _serviceBusConfig = serviceBusConfig;
            _client = new ServiceBusClient(_serviceBusConfig.ConnectionString);
        }

        public ValueTask DisposeAsync()
        {
            return _client.DisposeAsync();
        }

        public ServiceBusSender CreateSender()
        {
            return _client.CreateSender(_serviceBusConfig.IntegrationEventsTopicName);
        }
    }
}
