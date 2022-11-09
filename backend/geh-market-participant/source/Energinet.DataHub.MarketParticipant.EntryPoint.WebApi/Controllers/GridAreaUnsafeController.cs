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
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Controllers
{
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Route("gridarea")]
    public sealed class GridAreaUnsafeController : ControllerBase
    {
        private readonly ILogger<GridAreaController> _logger;
        private readonly IMediator _mediator;

        public GridAreaUnsafeController(ILogger<GridAreaController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGridAreaAsync(CreateGridAreaDto gridAreaDto)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var createGridAreaCommand = new CreateGridAreaCommand(gridAreaDto);

                    var response = await _mediator
                        .Send(createGridAreaCommand)
                        .ConfigureAwait(false);

                    return Ok(response.GridAreaId.ToString());
                },
                _logger).ConfigureAwait(false);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateGridAreaAsync(ChangeGridAreaDto gridAreaDto)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var updateGridAreaCommand = new UpdateGridAreaCommand(gridAreaDto.Id, gridAreaDto);

                    var response = await _mediator
                        .Send(updateGridAreaCommand)
                        .ConfigureAwait(false);

                    return Ok(response);
                },
                _logger).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<IActionResult> GetGridAreasAsync()
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var command = new GetGridAreasCommand();
                    var response = await _mediator.Send(command).ConfigureAwait(false);
                    return Ok(response.GridAreas);
                },
                _logger).ConfigureAwait(false);
        }

        [HttpGet("{gridAreaId:guid}")]
        public async Task<IActionResult> GetGridAreaAsync(Guid gridAreaId)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var command = new GetGridAreaCommand(gridAreaId);
                    var response = await _mediator.Send(command).ConfigureAwait(false);
                    return Ok(response.GridArea);
                },
                _logger).ConfigureAwait(false);
        }

        [HttpGet("{gridAreaId:guid}/auditlogentry")]
        public async Task<IActionResult> GetGridAreaAuditLogEntriesAsync(Guid gridAreaId)
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var command = new GetGridAreaAuditLogEntriesCommand(gridAreaId);
                    var response = await _mediator.Send(command).ConfigureAwait(false);
                    return Ok(response.GridAreaAuditLogEntries);
                },
                _logger).ConfigureAwait(false);
        }
    }
}
