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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Contact;
using Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Controllers
{
    [ApiController]
    [Route("organization")]
    public sealed class ActorContactController : ControllerBase
    {
        private readonly ILogger<ActorContactController> _logger;
        private readonly IMediator _mediator;

        public ActorContactController(ILogger<ActorContactController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet("{organizationId:guid}/actor/{actorId:guid}/contact")]
        public async Task<IActionResult> ListAllAsync(Guid organizationId, Guid actorId)
        {
            return await this.ProcessAsync(
                async () =>
                    {
                        var getOrganizationsCommand = new GetActorContactsCommand(organizationId, actorId);

                        var response = await _mediator
                            .Send(getOrganizationsCommand)
                            .ConfigureAwait(false);

                        return Ok(response.Contacts);
                    },
                _logger).ConfigureAwait(false);
        }

        [HttpPost("{organizationId:guid}/actor/{actorId:guid}/contact")]
        public async Task<IActionResult> CreateContactAsync(Guid organizationId, Guid actorId, CreateActorContactDto contactDto)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var createContactCommand = new CreateActorContactCommand(organizationId, actorId, contactDto);

                    var response = await _mediator
                        .Send(createContactCommand)
                        .ConfigureAwait(false);

                    return Ok(response.ContactId.ToString());
                },
                _logger).ConfigureAwait(false);
        }

        [HttpDelete("{organizationId:guid}/actor/{actorId:guid}/contact/{contactId:guid}")]
        public async Task<IActionResult> DeleteContactAsync(Guid organizationId, Guid actorId, Guid contactId)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var deleteContactCommand = new DeleteActorContactCommand(organizationId, actorId, contactId);

                    var response = await _mediator
                        .Send(deleteContactCommand)
                        .ConfigureAwait(false);

                    return Ok(response);
                },
                _logger).ConfigureAwait(false);
        }
    }
}
