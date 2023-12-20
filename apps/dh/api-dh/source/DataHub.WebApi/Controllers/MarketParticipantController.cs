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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.WebApi.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]/Organization")]
    public class MarketParticipantController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient_V1 _client;

        public MarketParticipantController(IMarketParticipantClient_V1 client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieves all organizations.
        /// </summary>
        [HttpGet]
        [Route("GetAllOrganizations")]
        public Task<ActionResult<ICollection<OrganizationDto>>> GetAllOrganizationsAsync()
        {
            return HandleExceptionAsync(() => _client.OrganizationGetAsync());
        }

        /// <summary>
        /// Retrieves all organizations with actors.
        /// </summary>
        [HttpGet]
        [Route("GetAllOrganizationsWithActors")]
        public Task<ActionResult<IEnumerable<OrganizationWithActorsDto>>> GetAllOrganizationsWithActorsAsync()
        {
            return HandleExceptionAsync(async () =>
            {
                var organizations = await _client
                    .OrganizationGetAsync()
                    .ConfigureAwait(false);

                var allActors = await _client
                    .ActorGetAsync()
                    .ConfigureAwait(false);

                var groupByOrganization = allActors.ToLookup(a => a.OrganizationId);

                var result = organizations.Select(organization =>
                {
                    var actors = groupByOrganization[organization.OrganizationId];
                    return new OrganizationWithActorsDto(organization, actors);
                });

                return result;
            });
        }

        /// <summary>
        /// Retrieves a single organization
        /// </summary>
        [HttpGet("GetOrganization")]
        public Task<ActionResult<OrganizationDto>> GetOrganizationAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.OrganizationGetAsync(orgId));
        }

        /// <summary>
        /// Creates an organization
        /// </summary>
        [HttpPost]
        [Route("CreateOrganization")]
        public Task<ActionResult<Guid>> CreateOrganizationAsync(CreateOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.OrganizationPostAsync(organizationDto));
        }

        /// <summary>
        /// Updates an organization
        /// </summary>
        [HttpPut]
        [Route("UpdateOrganization")]
        public Task<ActionResult> UpdateOrganizationAsync(Guid orgId, ChangeOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.OrganizationPutAsync(orgId, organizationDto));
        }

        /// <summary>
        /// Retrieves all actors to a single organization
        /// </summary>
        [HttpGet("GetActors")]
        public Task<ActionResult<ICollection<ActorDto>>> GetActorsAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.OrganizationActorAsync(orgId));
        }

        /// <summary>
        /// Gets a list of actors ready for use in filters in frontend.
        /// The list is made so that FAS members can choose from all the actors, while
        /// non-FAS member can only pick their own actor.
        /// </summary>
        [HttpGet("GetFilteredActors")]
        public Task<ActionResult<IEnumerable<FilteredActorDto>>> GetFilteredActorsAsync()
        {
            return HandleExceptionAsync(async () =>
            {
                var gridAreas = await _client.GridAreaGetAsync().ConfigureAwait(false);
                var gridAreaLookup = gridAreas.ToDictionary(x => x.Id);

                var actors = await _client
                    .ActorGetAsync()
                    .ConfigureAwait(false);

                var accessibleActors = actors
                    .Select(x =>
                        new FilteredActorDto(
                            x.ActorId,
                            x.ActorNumber,
                            x.Name,
                            x.MarketRoles
                                .Select(marketRole => marketRole.EicFunction)
                                .Distinct()
                                .ToList(),
                            x.MarketRoles
                                .SelectMany(marketRole => marketRole.GridAreas.Select(gridArea => gridArea.Id))
                                .Distinct()
                                .Select(gridAreaId => gridAreaLookup[gridAreaId].Code)
                                .ToList()));

                if (HttpContext.User.IsFas())
                {
                    return accessibleActors;
                }

                var actorId = HttpContext.User.GetAssociatedActor();
                return accessibleActors.Where(actor => actor.ActorId == actorId);
            });
        }

        /// <summary>
        /// Retrieves the organization for a single actor.
        /// </summary>
        [HttpGet("GetActorOrganization")]
        public Task<ActionResult<OrganizationDto>> GetActorOrganizationAsync(Guid actorId)
        {
            return HandleExceptionAsync(async () =>
            {
                var actor = await _client.ActorGetAsync(actorId).ConfigureAwait(false);
                return await _client.OrganizationGetAsync(actor.OrganizationId).ConfigureAwait(false);
            });
        }

        /// <summary>
        /// Retrieves an actor.
        /// </summary>
        [HttpGet("GetActor")]
        public Task<ActionResult<ActorDto>> GetActorAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.ActorGetAsync(actorId));
        }

        /// <summary>
        /// Creates an actor.
        /// </summary>
        [HttpPost("CreateActor")]
        public Task<ActionResult<Guid>> CreateActorAsync(CreateActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.ActorPostAsync(actorDto));
        }

        /// <summary>
        /// Updates an actor.
        /// </summary>
        [HttpPut("UpdateActor")]
        public Task<ActionResult> UpdateActorAsync(Guid actorId, ChangeActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.ActorPutAsync(actorId, actorDto));
        }

        /// <summary>
        /// Gets all the contacts for an actor.
        /// </summary>
        [HttpGet("GetContacts")]
        public Task<ActionResult<ICollection<ActorContactDto>>> GetContactsAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.ActorContactGetAsync(actorId));
        }

        /// <summary>
        /// Creates a contact for the actor.
        /// </summary>
        [HttpPost("CreateContact")]
        public Task<ActionResult<Guid>> CreateContactAsync(Guid actorId, CreateActorContactDto createDto)
        {
            return HandleExceptionAsync(() => _client.ActorContactPostAsync(actorId, createDto));
        }

        /// <summary>
        /// Removes a contact from an actor.
        /// </summary>
        [HttpDelete("DeleteContact")]
        public Task<ActionResult> DeleteContactAsync(Guid actorId, Guid contactId)
        {
            return HandleExceptionAsync(() => _client.ActorContactDeleteAsync(actorId, contactId));
        }
    }
}
