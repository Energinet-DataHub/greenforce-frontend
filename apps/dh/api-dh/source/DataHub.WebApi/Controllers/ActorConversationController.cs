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

using System.Text.Json;
using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    private readonly IRequestAuthorization _requestAuthorization;
    private readonly AuthorizedHttpClientFactory _authorizedHttpClientFactory;

    public ActorConversationController(
        IHttpContextAccessor httpContextAccessor,
        IRequestAuthorization requestAuthorization,
        AuthorizedHttpClientFactory authorizedHttpClientFactory)
    {
        _httpContextAccessor = httpContextAccessor;
        _requestAuthorization = requestAuthorization;
        _authorizedHttpClientFactory = authorizedHttpClientFactory;
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

        var authRequest = new AddActorConversationMessageRequest
        {
            ActorNumber = actorNumber,
            UserId = userId,
        };

        var signature = await _requestAuthorization.RequestSignatureAsync(authRequest);

        if (signature.Signature == null ||
            (signature.Result != SignatureResult.Valid && signature.Result != SignatureResult.NoContent))
        {
            return Forbid();
        }

        using var httpClient = _authorizedHttpClientFactory.CreateActorConversationHttpClientWithSignature(signature.Signature);

        using var content = new MultipartFormDataContent();
        await using var stream = document.OpenReadStream();
        var streamContent = new StreamContent(stream);
        if (!string.IsNullOrEmpty(document.ContentType))
        {
            streamContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(document.ContentType);
        }

        content.Add(streamContent, "File", document.FileName);

        using var request = new HttpRequestMessage(HttpMethod.Post, "api/AddMessageDocument");
        request.Headers.TryAddWithoutValidation("UserId", userId.ToString());
        request.Headers.TryAddWithoutValidation("ActorNumber", actorNumber);
        request.Content = content;

        var response = await httpClient.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            return StatusCode((int)response.StatusCode, errorBody);
        }

        var responseBody = await response.Content.ReadAsStringAsync(ct);
        var documentId = JsonSerializer.Deserialize<Guid>(responseBody);

        return Ok(documentId);
    }
}
