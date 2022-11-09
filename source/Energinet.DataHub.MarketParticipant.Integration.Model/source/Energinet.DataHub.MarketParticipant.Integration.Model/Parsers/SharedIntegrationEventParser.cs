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
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Organization;
using Energinet.DataHub.MarketParticipant.Integration.Model.Protobuf;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers
{
    public class SharedIntegrationEventParser : ISharedIntegrationEventParser
    {
        public BaseIntegrationEvent Parse(byte[] protoContract)
        {
            try
            {
                var contract = SharedIntegrationEventContract.Parser.ParseFrom(protoContract);
                switch (contract.IntegrationEventCase)
                {
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.None:
                        break;
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ActorCreatedIntegrationEvent:
                        return ActorCreatedIntegrationEventParser.Parse(contract.ActorCreatedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ActorExternalIdChangedIntegrationEvent:
                        return ActorExternalIdChangedIntegrationEventParser.Parse(contract.ActorExternalIdChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ActorNameChangedIntegrationEvent:
                        return ActorNameChangedIntegrationEventParser.Parse(contract.ActorNameChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ActorStatusChangedIntegrationEvent:
                        return ActorStatusChangedIntegrationEventParser.Parse(contract.ActorStatusChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ActorUpdatedIntegrationEvent:
                        return ActorUpdatedIntegrationEventParser.Parse(contract.ActorUpdatedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ContactAddedToActorIntegrationEvent:
                        return ContactAddedToActorIntegrationEventParser.Parse(contract.ContactAddedToActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.ContactRemovedFromActorIntegrationEvent:
                        return ContactRemovedFromActorIntegrationEventParser.Parse(contract.ContactRemovedFromActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.GridAreaAddedToActorIntegrationEvent:
                        return GridAreaAddedToActorIntegrationEventParser.Parse(contract.GridAreaAddedToActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.GridAreaCreatedIntegrationEvent:
                        return GridAreaIntegrationEventParser.Parse(contract.GridAreaCreatedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.GridAreaNameChangedIntegrationEvent:
                        return GridAreaNameChangedIntegrationEventParser.Parse(contract.GridAreaNameChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.GridAreaRemovedFromActorIntegrationEvent:
                        return GridAreaRemovedFromActorIntegrationEventParser.Parse(contract.GridAreaRemovedFromActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.GridAreaUpdatedIntegrationEvent:
                        return GridAreaUpdatedIntegrationEventParser.Parse(contract.GridAreaUpdatedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.MarketRoleAddedToActorIntegrationEvent:
                        return MarketRoleAddedToActorIntegrationEventParser.Parse(contract.MarketRoleAddedToActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.MarketRoleRemovedFromActorIntegrationEvent:
                        return MarketRoleRemovedFromActorIntegrationEventParser.Parse(contract.MarketRoleRemovedFromActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.MeteringPointTypeAddedToActorIntegrationEvent:
                        return MeteringPointTypeAddedToActorIntegrationEventParser.Parse(contract.MeteringPointTypeAddedToActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.MeteringPointTypeRemovedFromActorIntegrationEvent:
                        return MeteringPointTypeRemovedFromActorIntegrationEventParser.Parse(contract.MeteringPointTypeRemovedFromActorIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationAddressChangedIntegrationEvent:
                        return OrganizationAddressChangedIntegrationEventParser.Parse(contract.OrganizationAddressChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationBusinessRegisterIdentifierChangedIntegrationEvent:
                        return OrganizationBusinessRegisterIdentifierChangedIntegrationEventParser.Parse(contract.OrganizationBusinessRegisterIdentifierChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationCommentChangedIntegrationEvent:
                        return OrganizationCommentChangedIntegrationEventParser.Parse(contract.OrganizationCommentChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationCreatedIntegrationEvent:
                        return OrganizationCreatedIntegrationEventParser.Parse(contract.OrganizationCreatedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationNameChangedIntegrationEvent:
                        return OrganizationNameChangedIntegrationEventParser.Parse(contract.OrganizationNameChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationStatusChangedIntegrationEvent:
                        return OrganizationStatusChangedIntegrationEventParser.Parse(contract.OrganizationStatusChangedIntegrationEvent);
                    case SharedIntegrationEventContract.IntegrationEventOneofCase.OrganizationUpdatedIntegrationEvent:
                        return OrganizationUpdatedIntegrationEventParser.Parse(contract.OrganizationUpdatedIntegrationEvent);
                    default:
                        throw new MarketParticipantException("IntegrationEventParser not found");
                }
            }
            catch (Exception e)
            {
                throw new MarketParticipantException("IntegrationEventParser, parser error", e);
            }

            throw new MarketParticipantException("IntegrationEventParser not found");
        }
    }
}
