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
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Exceptions;
using Energinet.DataHub.MarketParticipant.Integration.Model.Protobuf;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Enum = System.Enum;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers
{
    public sealed class ActorUpdatedIntegrationEventParser : IActorUpdatedIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(ActorUpdatedIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { ActorUpdatedIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(ActorUpdatedIntegrationEvent)}", ex);
            }
        }

        internal static ActorUpdatedIntegrationEvent Parse(ActorUpdatedIntegrationEventContract contract)
        {
            return MapContract(contract);
        }

        private static ActorUpdatedIntegrationEvent MapContract(ActorUpdatedIntegrationEventContract contract)
        {
            Guid? externalActorId = Guid.TryParse(contract.ExternalActorId, out var id)
                ? id
                : null;

            return new ActorUpdatedIntegrationEvent(
                Guid.Parse(contract.Id),
                contract.EventCreated.ToDateTime(),
                Guid.Parse(contract.ActorId),
                Guid.Parse(contract.OrganizationId),
                externalActorId,
                new Dtos.ActorNumber(contract.ActorNumber, (Dtos.ActorNumberType)contract.ActorNumberType),
                Enum.IsDefined((ActorStatus)contract.Status) ? (ActorStatus)contract.Status : throw new FormatException(nameof(contract.Status)),
                contract.BusinessRoles.Select(
                    x => Enum.IsDefined((BusinessRoleCode)x) ? (BusinessRoleCode)x : throw new FormatException(nameof(contract.BusinessRoles))).ToList(),
                contract.ActorMarketRoles.Select(
                    x => new Dtos.ActorMarketRole((EicFunction)x.Function, x.GridAreas.Select(
                        g => new Dtos.ActorGridArea(Guid.Parse(g.Id), g.MeteringPointTypes)))));
        }

        private static ActorUpdatedIntegrationEventContract MapEvent(ActorUpdatedIntegrationEvent integrationEvent)
        {
            var externalActorId = integrationEvent.ExternalActorId.HasValue
                ? integrationEvent.ExternalActorId.Value.ToString()
                : string.Empty;

            var contract = new ActorUpdatedIntegrationEventContract
            {
                Id = integrationEvent.Id.ToString(),
                EventCreated = Timestamp.FromDateTime(integrationEvent.EventCreated),
                ActorId = integrationEvent.ActorId.ToString(),
                ExternalActorId = externalActorId,
                OrganizationId = integrationEvent.OrganizationId.ToString(),
                ActorNumber = integrationEvent.ActorNumber.Value,
                ActorNumberType = (Protobuf.ActorNumberType)integrationEvent.ActorNumber.Type,
                Status = (int)integrationEvent.Status,
                ActorMarketRoles =
                {
                    integrationEvent.ActorMarketRoles.Select(x => new Protobuf.ActorMarketRole
                    {
                        Function = (int)x.Function, GridAreas =
                        {
                            x.GridAreas.Select(g => new Protobuf.ActorGridArea
                            {
                                Id = g.Id.ToString(),
                                MeteringPointTypes = { g.MeteringPointTypes }
                            })
                        }
                    })
                }
            };

            foreach (var x in integrationEvent.BusinessRoles)
            {
                contract.BusinessRoles.Add((int)x);
            }

            return contract;
        }
    }
}
