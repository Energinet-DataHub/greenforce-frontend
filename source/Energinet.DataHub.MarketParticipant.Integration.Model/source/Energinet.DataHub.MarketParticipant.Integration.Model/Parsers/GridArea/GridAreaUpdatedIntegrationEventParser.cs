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

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea
{
    public sealed class GridAreaUpdatedIntegrationEventParser : IGridAreaUpdatedIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(GridAreaUpdatedIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { GridAreaUpdatedIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(GridAreaUpdatedIntegrationEvent)}", ex);
            }
        }

        internal static GridAreaUpdatedIntegrationEvent Parse(GridAreaUpdatedIntegrationEventContract protoContract)
        {
            return MapContract(protoContract);
        }

        private static GridAreaUpdatedIntegrationEvent MapContract(GridAreaUpdatedIntegrationEventContract contract)
        {
            var integrationEvent = new GridAreaUpdatedIntegrationEvent(
                Guid.Parse(contract.Id),
                Guid.Parse(contract.GridAreaId),
                contract.Name,
                contract.Code,
                Enum.IsDefined((PriceAreaCode)contract.PriceAreaCode) ? (PriceAreaCode)contract.PriceAreaCode : throw new FormatException(nameof(contract.PriceAreaCode)),
                Guid.Parse(contract.GridAreaLinkId));

            if (integrationEvent.Type != contract.Type)
            {
                throw new FormatException("Invalid Type");
            }

            return integrationEvent;
        }

        private static GridAreaUpdatedIntegrationEventContract MapEvent(GridAreaUpdatedIntegrationEvent integrationEvent)
        {
            var contract = new GridAreaUpdatedIntegrationEventContract
            {
                Id = integrationEvent.Id.ToString(),
                GridAreaId = integrationEvent.GridAreaId.ToString(),
                Name = integrationEvent.Name,
                Code = integrationEvent.Code,
                PriceAreaCode = (int)integrationEvent.PriceAreaCode,
                GridAreaLinkId = integrationEvent.GridAreaLinkId.ToString(),
                Type = integrationEvent.Type
            };
            return contract;
        }
    }
}
