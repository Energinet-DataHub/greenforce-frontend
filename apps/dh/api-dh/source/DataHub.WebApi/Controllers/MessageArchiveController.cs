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
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class MessageArchiveController : ControllerBase
{
    private readonly IEdiB2CWebAppClient_V1 _client;

    public MessageArchiveController(IEdiB2CWebAppClient_V1 client)
    {
        _client = client;
    }

    [HttpGet]
    [Route("Document")]
    [Produces(MediaTypeNames.Text.Plain)]
    public async Task<ActionResult<string>> GetDocumentByIdAsync(string id, CancellationToken cancellationToken)
    {
        var document = await _client.ArchivedMessageGetDocumentAsync(
            Guid.Parse(id),
            "1.0",
            cancellationToken);

        return Ok(document);
    }
}
