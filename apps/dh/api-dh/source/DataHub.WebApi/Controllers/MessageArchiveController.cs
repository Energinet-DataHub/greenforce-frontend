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
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1;
using Energinet.DataHub.EDI.B2CClient.Abstractions.MeteringPointArchivedMessages.V1;
using Energinet.DataHub.WebApi.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class MessageArchiveController(IB2CClient b2CClient) : ControllerBase
{
    private readonly IB2CClient _b2CClient = b2CClient;

    [HttpGet]
    [Route("Document")]
    [Produces(MediaTypeNames.Text.Plain)]
    public async Task<ActionResult<string>> GetDocumentByIdAsync(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var archivedMessageId))
        {
            return BadRequest("Invalid document ID format");
        }

        var archivedMessageIdDto = new ArchivedMessageStreamQueryV1(archivedMessageId);
        var stream = await _b2CClient.SendAsync(archivedMessageIdDto, cancellationToken);

        if (stream == null)
        {
            return NoContent();
        }

        return Ok(await FormatDocumentAsync(stream, cancellationToken));
    }

    [HttpGet]
    [Route("MasterDataDocument")]
    [Produces(MediaTypeNames.Text.Plain)]
    public async Task<ActionResult<string>> GetMasterDataDocumentByIdAsync(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var archivedMessageId))
        {
            return BadRequest("Invalid document ID format");
        }

        var query = new MasterDataArchivedMessageStreamQueryV1(archivedMessageId);
        var stream = await _b2CClient.SendAsync(query, cancellationToken);

        if (stream == null)
        {
            return NoContent();
        }

        return Ok(await FormatDocumentAsync(stream, cancellationToken));
    }

    private static async Task<string> FormatDocumentAsync(Stream stream, CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(stream, leaveOpen: false);
        var documentContent = await reader.ReadToEndAsync(cancellationToken);
        return DocumentFormatter.FormatDocumentIfNeeded(documentContent);
    }
}
