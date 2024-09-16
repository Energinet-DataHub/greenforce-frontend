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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public sealed class WholesaleSettlementReportController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IMarketParticipantClient_V1 _marketParticipantClient;

    private readonly ISettlementReportsClient _settlementReportsClient;

    public WholesaleSettlementReportController(
        IConfiguration configuration,
        IMarketParticipantClient_V1 marketParticipantClient,
        ISettlementReportsClient settlementReportsClient,
        IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _marketParticipantClient = marketParticipantClient;
        _settlementReportsClient = settlementReportsClient;
    }

    [HttpGet("DownloadReport")]
    [Produces("application/zip")]
    public async Task<ActionResult<Stream>> DownloadReportAsync([FromQuery] string settlementReportId, [FromQuery] Guid token, [FromQuery] string filename)
    {
        var apiClientSettings = _configuration.GetSection("ApiClientSettings").Get<ApiClientSettings>() ?? new ApiClientSettings();
        var baseUri = GetBaseUri(apiClientSettings.WholesaleOrchestrationSettlementReportsBaseUrl);
        var apiClientBaseUri = GetBaseUri(apiClientSettings.SettlementReportsAPIBaseUrl);
        var downloadToken = await _marketParticipantClient.GetAndUseDownloadTokenAsync(token);

        if (string.IsNullOrWhiteSpace(downloadToken.AccessToken))
        {
            return Forbid();
        }

        var authorizedHttpClientFactory = new AuthorizedHttpClientFactory(_httpClientFactory, () => "dummy");

        var apiClient = authorizedHttpClientFactory.CreateClient(apiClientBaseUri);
        var client = authorizedHttpClientFactory.CreateClient(baseUri);

        client.DefaultRequestHeaders.Remove("Authorization");
        client.DefaultRequestHeaders.Add("Authorization", downloadToken.AccessToken);

        apiClient.DefaultRequestHeaders.Remove("Authorization");
        apiClient.DefaultRequestHeaders.Add("Authorization", downloadToken.AccessToken);

        var settlementReportsClient = new SettlementReportsClient(baseUri.ToString(), client, apiClient);
        var reportStream = await settlementReportsClient.DownloadAsync(new SettlementReportRequestId(settlementReportId), default);

        // Response...
        var cd = new ContentDisposition
        {
            FileName = Uri.EscapeDataString(filename),
            Inline = true,  // false = prompt the user for downloading;  true = browser to try to show the file inline
        };
        Response.Headers["Content-Disposition"] = cd.ToString();
        Response.Headers["X-Content-Type-Options"] = "nosniff"; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
        return File(reportStream, MediaTypeNames.Application.Zip);
    }

    private static Uri GetBaseUri(string baseUrl)
    {
        return Uri.TryCreate(baseUrl, UriKind.Absolute, out var url)
            ? url
            : new Uri("https://empty");
    }
}
