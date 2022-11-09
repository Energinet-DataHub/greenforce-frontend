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

using System.Threading.Tasks;
using Energinet.DataHub.Core.App.Common.Security;
using Energinet.DataHub.Core.App.WebApp.Authorization;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public sealed class GridAreaOverviewController : ControllerBase
    {
        private readonly ILogger<GridAreaOverviewController> _logger;
        private readonly IMediator _mediator;

        public GridAreaOverviewController(ILogger<GridAreaOverviewController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet]
        [AuthorizeUser(Permission.OrganizationView)]
        public async Task<IActionResult> GetGridAreaOverviewAsync()
        {
            return await this.ProcessAsync(
                async () =>
                {
                    var command = new GetGridAreaOverviewCommand();
                    var response = await _mediator.Send(command).ConfigureAwait(false);
                    return Ok(response.GridAreas);
                },
                _logger).ConfigureAwait(false);
        }
    }
}
