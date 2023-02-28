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
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
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
        public Task<ActionResult<IEnumerable<FilteredActorDto>>> GetFilteredActorsAsync()
        {
            return HandleExceptionAsync(async () =>
            {
                var gridAreas = await _client.GetGridAreasAsync().ConfigureAwait(false);
                var gridAreaLookup = gridAreas.ToDictionary(x => x.Id);

                var organizations = await _client
                    .GetOrganizationsAsync()
                    .ConfigureAwait(false);

                var actors = new List<ActorDto>();

                foreach (var organizationDto in organizations)
                {
                    actors.AddRange(await _client.GetActorsAsync(organizationDto.OrganizationId).ConfigureAwait(false));
                }

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
                var actor = await _client.GetActorAsync(actorId).ConfigureAwait(false);
                return await _client.GetOrganizationAsync(actor.OrganizationId).ConfigureAwait(false);
            });
        }

        /// <summary>
        /// Retrieves an actor.
        /// </summary>
        [HttpGet("GetActor")]
        public Task<ActionResult<ActorDto>> GetActorAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetActorAsync(actorId));
        }

        /// <summary>
        /// Creates an actor.
        /// </summary>
        [HttpPost("CreateActor")]
        public Task<ActionResult<Guid>> CreateActorAsync(CreateActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.CreateActorAsync(actorDto));
        }

        /// <summary>
        /// Updates an actor.
        /// </summary>
        [HttpPut("UpdateActor")]
        public Task<ActionResult> UpdateActorAsync(Guid actorId, ChangeActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.UpdateActorAsync(actorId, actorDto));
        }

        /// <summary>
        /// Gets all the contacts for an actor.
        /// </summary>
        [HttpGet("GetContacts")]
        public Task<ActionResult<IEnumerable<ActorContactDto>>> GetContactsAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetContactsAsync(actorId));
        }

        /// <summary>
        /// Creates a contact for the actor.
        /// </summary>
        [HttpPost("CreateContact")]
        public Task<ActionResult<Guid>> CreateContactAsync(Guid actorId, CreateActorContactDto createDto)
        {
            return HandleExceptionAsync(() => _client.CreateContactAsync(actorId, createDto));
        }

        /// <summary>
        /// Removes a contact from an actor.
        /// </summary>
        [HttpDelete("DeleteContact")]
        public Task<ActionResult> DeleteContactAsync(Guid actorId, Guid contactId)
        {
            return HandleExceptionAsync(() => _client.DeleteContactAsync(actorId, contactId));
        }
    }
}
