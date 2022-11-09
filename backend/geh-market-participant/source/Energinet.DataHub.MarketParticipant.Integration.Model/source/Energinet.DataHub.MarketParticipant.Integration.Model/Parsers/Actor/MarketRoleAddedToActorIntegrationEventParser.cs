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
using Enum = System.Enum;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor
{
    public sealed class MarketRoleAddedToActorIntegrationEventParser : IMarketRoleAddedToActorIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(MarketRoleAddedToActorIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { MarketRoleAddedToActorIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(MarketRoleAddedToActorIntegrationEvent)}", ex);
            }
        }

        internal static MarketRoleAddedToActorIntegrationEvent Parse(MarketRoleAddedToActorIntegrationEventContract protoContract)
        {
            return MapContract(protoContract);
        }

        private static MarketRoleAddedToActorIntegrationEvent MapContract(MarketRoleAddedToActorIntegrationEventContract contract)
        {
            var integrationEvent = new MarketRoleAddedToActorIntegrationEvent(
                Guid.Parse(contract.Id),
                Guid.Parse(contract.ActorId),
                Guid.Parse(contract.OrganizationId),
                Enum.IsDefined(typeof(BusinessRoleCode), contract.BusinessRole) ? (BusinessRoleCode)contract.BusinessRole : throw new FormatException(nameof(contract.BusinessRole)),
                Enum.IsDefined(typeof(EicFunction), contract.MarketRoleFunction) ? (EicFunction)contract.MarketRoleFunction : throw new FormatException(nameof(contract.MarketRoleFunction)),
                contract.EventCreated.ToDateTime());

            if (integrationEvent.Type != contract.Type)
            {
                throw new FormatException("Invalid Type");
            }

            return integrationEvent;
        }

        private static MarketRoleAddedToActorIntegrationEventContract MapEvent(
            MarketRoleAddedToActorIntegrationEvent integrationEvent)
        {
            var contract = new MarketRoleAddedToActorIntegrationEventContract
            {
                Id = integrationEvent.Id.ToString(),
                EventCreated = Timestamp.FromDateTime(integrationEvent.EventCreated),
                ActorId = integrationEvent.ActorId.ToString(),
                OrganizationId = integrationEvent.OrganizationId.ToString(),
                BusinessRole = (int)integrationEvent.BusinessRoleCode,
                MarketRoleFunction = (int)integrationEvent.MarketRole,
                Type = integrationEvent.Type
            };
            return contract;
        }
    }
}
