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

using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;
using Energinet.DataHub.WebApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
[Authorize]
public sealed class ActorConversationController : ControllerBase
{
    private const long MaxFileSizeBytes = 25 * 1024 * 1024; // 25 MB

    private static readonly HashSet<string> AllowedFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".bmp", ".csv", ".jpeg", ".jpg", ".pdf", ".png", ".txt",
    };

    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IActorConversationClient_V1 _actorConversationClient;

    public ActorConversationController(
        IHttpContextAccessor httpContextAccessor,
        IActorConversationClient_V1 actorConversationClient)
    {
        _httpContextAccessor = httpContextAccessor;
        _actorConversationClient = actorConversationClient;
    }

    /// <summary>
    /// Uploads a document for an actor conversation message and returns the document ID.
    /// </summary>
    [HttpPost]
    [Route("UploadMessageDocument")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<ActionResult<Guid>> UploadMessageDocumentAsync(
        IFormFile document,
        CancellationToken ct)
    {
        var extension = System.IO.Path.GetExtension(document.FileName);
        if (string.IsNullOrEmpty(extension) || !AllowedFileExtensions.Contains(extension))
        {
            return BadRequest($"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", AllowedFileExtensions)}");
        }

        if (document.Length > MaxFileSizeBytes)
        {
            return BadRequest($"File size exceeds the maximum allowed size of 25 MB.");
        }

        ArgumentNullException.ThrowIfNull(_httpContextAccessor.HttpContext);

        var user = _httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var userId = user.GetUserId();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());

        await using var stream = document.OpenReadStream();
        var fileparameter = new FileParameter(stream, document.FileName, document.ContentType);

        var response = await _actorConversationClient.ApiAddMessageDocumentAsync(userId.ToString(), actorNumber, MapMarketRoleToActorType(marketRole).ToString(), fileparameter);

        return Ok(response.Value.DocumentId);
    }

    /// <summary>
    /// Downloads an attached document from an actor conversation message.
    /// </summary>
    [HttpGet]
    [Route("DownloadMessageDocument/{documentId:guid}")]
    public async Task<IActionResult> DownloadMessageDocumentAsync(
        Guid documentId,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(_httpContextAccessor.HttpContext);

        var user = _httpContextAccessor.HttpContext.User;
        var actorNumber = user.GetMarketParticipantNumber();
        var userId = user.GetUserId();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());

        var response = await _actorConversationClient.ApiGetMessageDocumentAsync(documentId, userId.ToString(), actorNumber, MapMarketRoleToActorType(marketRole).ToString());

        if (response.ContentType is null)
        {
            var errorBody = response;
            return StatusCode(500);
        }

        return File(response.FileContents, response.ContentType, response.FileDownloadName);
    }

    private static MarketRole MapMarketRoleToActorType(EicFunctionAuth marketRole)
    {
        return marketRole switch
        {
            EicFunctionAuth.EnergySupplier => MarketRole.EnergySupplier,
            EicFunctionAuth.GridAccessProvider => MarketRole.GridAccessProvider,
            EicFunctionAuth.DataHubAdministrator => MarketRole.Energinet,
            _ => throw new InvalidOperationException($"Unsupported market role: {marketRole}"),
        };
    }
}
