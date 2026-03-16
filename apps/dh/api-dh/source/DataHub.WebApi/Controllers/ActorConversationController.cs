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
    private const long MaxRequestSizeBytes = MaxFileSizeBytes + (64 * 1024); // Extra headroom for multipart headers

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
    [RequestSizeLimit(MaxRequestSizeBytes)]
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
        if (!Enum.TryParse<EicFunctionAuth>(user.GetMarketParticipantMarketRole(), out var marketRole))
        {
            return Forbid();
        }

        if (!TryMapMarketRole(marketRole, out var mappedRole))
        {
            return Forbid();
        }

        await using var stream = document.OpenReadStream();
        var fileParameter = new FileParameter(stream, document.FileName, document.ContentType);

        try
        {
            var response = await _actorConversationClient.ApiAddMessageDocumentAsync(userId.ToString(), actorNumber, mappedRole.ToString(), fileParameter, ct);

            if (response.Value != null)
            {
                return Ok(response.Value.DocumentId);
            }

            // The upstream API returns a flat {"documentId": "..."} instead of the ActionResult wrapper
            // {"result": ..., "value": {"documentId": "..."}} that the swagger schema declares.
            // Until the swagger is corrected, the documentId lands in AdditionalProperties.
            if (response.AdditionalProperties.TryGetValue("documentId", out var docId) &&
                docId is string docIdStr &&
                Guid.TryParse(docIdStr, out var documentId))
            {
                return Ok(documentId);
            }

            return BadRequest("Unexpected response format from upstream.");
        }
        catch (ApiException ex)
        {
            return StatusCode(ex.StatusCode, ex.Response);
        }
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
        if (!Enum.TryParse<EicFunctionAuth>(user.GetMarketParticipantMarketRole(), out var marketRole))
        {
            return Forbid();
        }

        if (!TryMapMarketRole(marketRole, out var mappedRole))
        {
            return Forbid();
        }

        try
        {
            using var response = await _actorConversationClient.ApiGetMessageDocumentAsync(documentId, userId.ToString(), actorNumber, mappedRole.ToString(), ct);

            var contentType = response.Headers.TryGetValue("Content-Type", out var contentTypeValues)
                ? contentTypeValues.FirstOrDefault() ?? "application/octet-stream"
                : "application/octet-stream";

            var fileName = (string?)null;
            if (response.Headers.TryGetValue("Content-Disposition", out var dispositionValues))
            {
                var header = dispositionValues.FirstOrDefault();
                if (header != null &&
                    System.Net.Http.Headers.ContentDispositionHeaderValue.TryParse(header, out var disposition))
                {
                    fileName = disposition.FileNameStar ?? disposition.FileName;
                }
            }

            // Read into byte array because the FileResponse is disposed at method exit
            var bytes = await ReadStreamToByteArrayAsync(response.Stream, ct);
            return File(bytes, contentType, fileName);
        }
        catch (ApiException ex)
        {
            return StatusCode(ex.StatusCode, ex.Response);
        }
    }

    private static async Task<byte[]> ReadStreamToByteArrayAsync(Stream stream, CancellationToken ct)
    {
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, ct);
        return memoryStream.ToArray();
    }

    private static bool TryMapMarketRole(EicFunctionAuth marketRole, out MarketRole mapped)
    {
        switch (marketRole)
        {
            case EicFunctionAuth.EnergySupplier:
                mapped = MarketRole.EnergySupplier;
                return true;
            case EicFunctionAuth.GridAccessProvider:
                mapped = MarketRole.GridAccessProvider;
                return true;
            case EicFunctionAuth.DataHubAdministrator:
                mapped = MarketRole.Energinet;
                return true;
            default:
                mapped = default;
                return false;
        }
    }
}
