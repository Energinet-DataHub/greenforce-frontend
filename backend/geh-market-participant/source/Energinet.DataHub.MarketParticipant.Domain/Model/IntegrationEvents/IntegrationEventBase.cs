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
using System.Text.Json.Serialization;

namespace Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents
{
    public abstract class IntegrationEventBase : IIntegrationEvent
    {
        protected IntegrationEventBase()
        {
            Id = Guid.NewGuid();
            EventCreated = DateTime.UtcNow;
        }

        [JsonInclude]
        public Guid Id { get; protected set; }

        [JsonInclude]
        public DateTime EventCreated { get; protected set; }
    }
}
