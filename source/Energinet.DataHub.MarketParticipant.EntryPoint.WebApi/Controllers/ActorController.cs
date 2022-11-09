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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Controllers
{
    [ApiController]
    [Route("organization")]
    public class ActorController : ControllerBase
    {
        private readonly ILogger<ActorController> _logger;
        private readonly IMediator _mediator;

        public ActorController(ILogger<ActorController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet("{organizationId:guid}/actor")]
        public async Task<IActionResult> GetActorsAsync(Guid organizationId)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var getActorsCommand = new GetActorsCommand(organizationId);

                    var response = await _mediator
                        .Send(getActorsCommand)
                        .ConfigureAwait(false);

                    return Ok(response.Actors);
                },
                _logger).ConfigureAwait(false);
        }

        [HttpGet("{organizationId:guid}/actor/{actorId:guid}")]
        public async Task<IActionResult> GetSingleActorAsync(Guid organizationId, Guid actorId)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var getSingleActorCommand = new GetSingleActorCommand(actorId, organizationId);

                    var response = await _mediator
                        .Send(getSingleActorCommand)
                        .ConfigureAwait(false);

                    return Ok(response.Actor);
                },
                _logger).ConfigureAwait(false);
        }

        [HttpPost("{organizationId:guid}/actor")]
        public async Task<IActionResult> CreateActorAsync(Guid organizationId, CreateActorDto actorDto)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var createActorCommand = new CreateActorCommand(organizationId, actorDto);

                    var response = await _mediator
                        .Send(createActorCommand)
                        .ConfigureAwait(false);

                    return Ok(response.ActorId.ToString());
                },
                _logger).ConfigureAwait(false);
        }

        [HttpPut("{organizationId:guid}/actor/{actorId:guid}")]
        public async Task<IActionResult> UpdateActorAsync(Guid organizationId, Guid actorId, ChangeActorDto changeActor)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var updateActorCommand = new UpdateActorCommand(organizationId, actorId, changeActor);

                    var response = await _mediator
                        .Send(updateActorCommand)
                        .ConfigureAwait(false);

                    return Ok(response);
                },
                _logger).ConfigureAwait(false);
        }
    }
}
