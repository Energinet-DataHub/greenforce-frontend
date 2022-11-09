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

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Organization
{
    public sealed class OrganizationUpdatedIntegrationEventParser : IOrganizationUpdatedIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(OrganizationUpdatedIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { OrganizationUpdatedIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(OrganizationUpdatedIntegrationEvent)}", ex);
            }
        }

        internal static OrganizationUpdatedIntegrationEvent Parse(OrganizationUpdatedIntegrationEventContract protoContract)
        {
            return MapContract(protoContract);
        }

        private static OrganizationUpdatedIntegrationEvent MapContract(OrganizationUpdatedIntegrationEventContract contract)
        {
            return new OrganizationUpdatedIntegrationEvent(
                Guid.Parse(contract.Id),
                Guid.Parse(contract.OrganizationId),
                contract.Name,
                contract.BusinessRegisterIdentifier,
                new Address(
                    contract.Address.StreetName,
                    contract.Address.Number,
                    contract.Address.ZipCode,
                    contract.Address.City,
                    contract.Address.Country));
        }

        private static OrganizationUpdatedIntegrationEventContract MapEvent(
            OrganizationUpdatedIntegrationEvent integrationEvent)
        {
            var contract = new OrganizationUpdatedIntegrationEventContract()
            {
                Id = integrationEvent.Id.ToString(),
                OrganizationId = integrationEvent.OrganizationId.ToString(),
                Name = integrationEvent.Name,
                BusinessRegisterIdentifier = integrationEvent.BusinessRegisterIdentifier,
                Address = new OrganizationAddressEventData
                {
                    City = integrationEvent.Address.City,
                    Country = integrationEvent.Address.Country,
                    Number = integrationEvent.Address.Number,
                    StreetName = integrationEvent.Address.StreetName,
                    ZipCode = integrationEvent.Address.ZipCode
                }
            };
            return contract;
        }
    }
}
