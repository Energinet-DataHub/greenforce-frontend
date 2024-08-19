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

using System.Net.Mime;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class MarketParticipantPermissionsController : MarketParticipantControllerBase
{
    private readonly IMarketParticipantClient_V1 _client;

    public MarketParticipantPermissionsController(IMarketParticipantClient_V1 client)
    {
        _client = client;
    }

    [HttpGet]
    [Route("GetPermissionRelationsCSV")]
    [Produces(MediaTypeNames.Text.Plain)]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<ICollection<PermissionDto>>> GetPermissionRelationsAsync()
    {
        var result = await _client.PermissionRelationAsync();
        return File(result.Stream, MediaTypeNames.Text.Plain);
    }
}
