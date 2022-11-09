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
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Exceptions;
using Energinet.DataHub.MarketParticipant.Integration.Model.Protobuf;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea
{
    public sealed class GridAreaNameChangedIntegrationEventParser : IGridAreaNameChangedIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(GridAreaNameChangedIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { GridAreaNameChangedIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(GridAreaNameChangedIntegrationEvent)}", ex);
            }
        }

        internal static GridAreaNameChangedIntegrationEvent Parse(GridAreaNameChangedIntegrationEventContract protoContract)
        {
            return MapContract(protoContract);
        }

        private static GridAreaNameChangedIntegrationEvent MapContract(GridAreaNameChangedIntegrationEventContract contract)
        {
            var integrationEvent = new GridAreaNameChangedIntegrationEvent(
                Guid.Parse(contract.Id),
                contract.EventCreated.ToDateTime(),
                Guid.Parse(contract.GridAreaId),
                contract.Name);

            if (integrationEvent.Type != contract.Type)
            {
                throw new FormatException("Invalid Type");
            }

            return integrationEvent;
        }

        private static GridAreaNameChangedIntegrationEventContract MapEvent(
            GridAreaNameChangedIntegrationEvent integrationEvent)
        {
            var contract = new GridAreaNameChangedIntegrationEventContract
            {
                Id = integrationEvent.Id.ToString(),
                EventCreated = Timestamp.FromDateTime(integrationEvent.EventCreated),
                GridAreaId = integrationEvent.GridAreaId.ToString(),
                Name = integrationEvent.Name,
                Type = integrationEvent.Type
            };
            return contract;
        }
    }
}
