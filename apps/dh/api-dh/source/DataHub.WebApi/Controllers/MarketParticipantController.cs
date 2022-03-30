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
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]/organization")]
    public class MarketParticipantController : ControllerBase
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
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetAllOrganizationsAsync()
        {
            return Ok(await _client.GetOrganizationsAsync().ConfigureAwait(false));
        }

        /// <summary>
        /// Retrieves a single organization
        /// </summary>
        [HttpGet("{orgId:guid}/")]
        public async Task<ActionResult<OrganizationDto>> GetOrganizationAsync(Guid orgId)
        {
            return Ok(await _client.GetOrganizationAsync(orgId).ConfigureAwait(false));
        }

        /// <summary>
        /// Creates an organization
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<OrganizationDto>> CreateOrganizationAsync(ChangeOrganizationDto organizationDto)
        {
            return Ok(await _client.CreateOrganizationAsync(organizationDto).ConfigureAwait(false));
        }

        /// <summary>
        /// Updates an organization
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<OrganizationDto>> UpdateOrganizationAsync(Guid orgId, ChangeOrganizationDto organizationDto)
        {
            return Ok(await _client.UpdateOrganizationAsync(orgId, organizationDto).ConfigureAwait(false));
        }

        /// <summary>
        /// Retrieves all actors to a single organization
        /// </summary>
        [HttpGet("{orgId:guid}/actor")]
        public async Task<ActionResult<IEnumerable<ActorDto>>> GetActorsAsync(Guid orgId)
        {
            return Ok(await _client.GetActorsAsync(orgId).ConfigureAwait(false));
        }

        /// <summary>
        /// Retrieves a single actor to a specific organization
        /// </summary>
        [HttpGet("{orgId:guid}/actor/{actorId:guid}")]
        public async Task<ActionResult<ActorDto>> GetActorAsync(Guid orgId, Guid actorId)
        {
            return Ok(await _client.GetActorAsync(orgId, actorId).ConfigureAwait(false));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPost("{orgId:guid}/actor")]
        public async Task<ActionResult<OrganizationDto>> CreateActorAsync(Guid orgId, CreateActorDto actorDto)
        {
            return Ok(await _client.CreateActorAsync(orgId, actorDto).ConfigureAwait(false));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPut("{orgId:guid}/actor/{actorId:guid}")]
        public async Task<ActionResult<OrganizationDto>> UpdateActorAsync(Guid orgId, Guid actorId, ChangeActorDto actorDto)
        {
            return Ok(await _client.UpdateActorAsync(orgId, actorId, actorDto).ConfigureAwait(false));
        }
    }
}
