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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]/Organization")]
    public class MarketParticipantController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient _client;

        public MarketParticipantController(IMarketParticipantClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieves all organizations
        /// </summary>
        [HttpGet]
        [Route("GetAllOrganizations")]
        public Task<ActionResult<IEnumerable<OrganizationDto>>> GetAllOrganizationsAsync()
        {
            return HandleExceptionAsync(() => _client.GetOrganizationsAsync());
        }

        /// <summary>
        /// Retrieves a single organization
        /// </summary>
        [HttpGet("GetOrganization")]
        public Task<ActionResult<OrganizationDto>> GetOrganizationAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.GetOrganizationAsync(orgId));
        }

        /// <summary>
        /// Creates an organization
        /// </summary>
        [HttpPost]
        [Route("CreateOrganization")]
        public Task<ActionResult<Guid>> CreateOrganizationAsync(CreateOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.CreateOrganizationAsync(organizationDto));
        }

        /// <summary>
        /// Updates an organization
        /// </summary>
        [HttpPut]
        [Route("UpdateOrganization")]
        public Task<ActionResult> UpdateOrganizationAsync(Guid orgId, ChangeOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.UpdateOrganizationAsync(orgId, organizationDto));
        }

        /// <summary>
        /// Retrieves all actors to a single organization
        /// </summary>
        [HttpGet("GetActors")]
        public Task<ActionResult<IEnumerable<ActorDto>>> GetActorsAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.GetActorsAsync(orgId));
        }

        /// <summary>
        /// Gets a list of actors ready for use in filters in frontend.
        /// The list is made so that FAS members can choose from all the actors, while
        /// non-FAS member can only pick their own actor.
        /// </summary>
        [HttpGet("GetFilteredActors")]
        public Task<ActionResult<IEnumerable<ActorDto>>> GetFilteredActorsAsync()
        {
            return HandleExceptionAsync(async () =>
            {
                var organizations = await _client
                    .GetOrganizationsAsync()
                    .ConfigureAwait(false);

                var accessibleActors = organizations.SelectMany(org => org.Actors);

                if (HttpContext.User.IsFas())
                {
                    return accessibleActors;
                }

                var actorId = HttpContext.User.GetAssociatedActor();
                return accessibleActors.Where(actor => actor.ActorId == actorId);
            });
        }

        /// <summary>
        /// Retrieves a single actor to a specific organization
        /// </summary>
        [HttpGet("GetActor")]
        public Task<ActionResult<ActorDto>> GetActorAsync(Guid orgId, Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetActorAsync(orgId, actorId));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPost("CreateActor")]
        public Task<ActionResult<Guid>> CreateActorAsync(Guid orgId, CreateActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.CreateActorAsync(orgId, actorDto));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPut("UpdateActor")]
        public Task<ActionResult> UpdateActorAsync(Guid orgId, Guid actorId, ChangeActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.UpdateActorAsync(orgId, actorId, actorDto));
        }

        /// <summary>
        /// Gets all the contacts for an actor.
        /// </summary>
        [HttpGet("GetContacts")]
        public Task<ActionResult<IEnumerable<ActorContactDto>>> GetContactsAsync(Guid orgId, Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetContactsAsync(orgId, actorId));
        }

        /// <summary>
        /// Creates a contact for the actor.
        /// </summary>
        [HttpPost("CreateContact")]
        public Task<ActionResult<Guid>> CreateContactAsync(Guid orgId, Guid actorId, CreateActorContactDto createDto)
        {
            return HandleExceptionAsync(() => _client.CreateContactAsync(orgId, actorId, createDto));
        }

        /// <summary>
        /// Removes a contact from an actor.
        /// </summary>
        [HttpDelete("DeleteContact")]
        public Task<ActionResult> DeleteContactAsync(Guid orgId, Guid actorId, Guid contactId)
        {
            return HandleExceptionAsync(() => _client.DeleteContactAsync(orgId, actorId, contactId));
        }
    }
}
