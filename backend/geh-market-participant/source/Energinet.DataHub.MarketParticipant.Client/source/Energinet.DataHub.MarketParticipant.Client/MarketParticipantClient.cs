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
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Flurl.Http;

namespace Energinet.DataHub.MarketParticipant.Client
{
    public sealed class MarketParticipantClient : IMarketParticipantClient
    {
        private readonly IMarketParticipantOrganizationClient _marketParticipantOrganizationClient;
        private readonly IMarketParticipantActorClient _marketParticipantActorClient;
        private readonly IMarketParticipantGridAreaClient _marketParticipantGridAreaClient;
        private readonly IMarketParticipantActorContactClient _marketParticipantActorContactClient;
        private readonly IMarketParticipantGridAreaOverviewClient _marketParticipantGridAreaOverviewClient;

        public MarketParticipantClient(IFlurlClient client)
        {
            _marketParticipantOrganizationClient = new MarketParticipantOrganizationClient(client);
            _marketParticipantActorClient = new MarketParticipantActorClient(client);
            _marketParticipantGridAreaClient = new MarketParticipantGridAreaClient(client);
            _marketParticipantActorContactClient = new MarketParticipantActorContactClient(client);
            _marketParticipantGridAreaOverviewClient = new MarketParticipantGridAreaOverviewClient(client);
        }

        public Task<IEnumerable<OrganizationDto>> GetOrganizationsAsync()
        {
            return _marketParticipantOrganizationClient.GetOrganizationsAsync();
        }

        public Task<OrganizationDto> GetOrganizationAsync(Guid organizationId)
        {
            return _marketParticipantOrganizationClient.GetOrganizationAsync(organizationId);
        }

        public Task<Guid> CreateOrganizationAsync(CreateOrganizationDto organizationDto)
        {
            return _marketParticipantOrganizationClient.CreateOrganizationAsync(organizationDto);
        }

        public Task UpdateOrganizationAsync(Guid organizationId, ChangeOrganizationDto organizationDto)
        {
            return _marketParticipantOrganizationClient.UpdateOrganizationAsync(organizationId, organizationDto);
        }

        public Task<IEnumerable<ActorDto>> GetActorsAsync(Guid organizationId)
        {
            return _marketParticipantActorClient.GetActorsAsync(organizationId);
        }

        public Task<ActorDto> GetActorAsync(Guid organizationId, Guid actorId)
        {
            return _marketParticipantActorClient.GetActorAsync(organizationId, actorId);
        }

        public Task<Guid> CreateActorAsync(Guid organizationId, CreateActorDto createActorDto)
        {
            return _marketParticipantActorClient.CreateActorAsync(organizationId, createActorDto);
        }

        public Task UpdateActorAsync(Guid organizationId, Guid actorId, ChangeActorDto changeActorDto)
        {
            return _marketParticipantActorClient.UpdateActorAsync(organizationId, actorId, changeActorDto);
        }

        public Task<IEnumerable<GridAreaDto>> GetGridAreasAsync()
        {
            return _marketParticipantGridAreaClient.GetGridAreasAsync();
        }

        public Task UpdateGridAreaAsync(ChangeGridAreaDto changes)
        {
            return _marketParticipantGridAreaClient.UpdateGridAreaAsync(changes);
        }

        public Task<IEnumerable<ActorContactDto>> GetContactsAsync(Guid organizationId, Guid actorId)
        {
            return _marketParticipantActorContactClient.GetContactsAsync(organizationId, actorId);
        }

        public Task<Guid> CreateContactAsync(Guid organizationId, Guid actorId, CreateActorContactDto contactDto)
        {
            return _marketParticipantActorContactClient.CreateContactAsync(organizationId, actorId, contactDto);
        }

        public Task DeleteContactAsync(Guid organizationId, Guid actorId, Guid contactId)
        {
            return _marketParticipantActorContactClient.DeleteContactAsync(organizationId, actorId, contactId);
        }

        public Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewAsync()
        {
            return _marketParticipantGridAreaOverviewClient.GetGridAreaOverviewAsync();
        }

        public Task<IEnumerable<GridAreaAuditLogEntryDto>> GetGridAreaAuditLogEntriesAsync(Guid gridAreaId)
        {
            return _marketParticipantGridAreaClient.GetGridAreaAuditLogEntriesAsync(gridAreaId);
        }
    }
}
