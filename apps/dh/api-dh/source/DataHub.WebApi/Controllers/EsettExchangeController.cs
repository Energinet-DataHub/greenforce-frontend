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

using System.Globalization;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Microsoft.AspNetCore.Mvc;
using ApiException = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.ApiException;
using SortDirection = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.SortDirection;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public sealed class EsettExchangeController : ControllerBase
{
    private readonly IESettExchangeClient_V1 _client;
    private readonly IMarketParticipantClient_V1 _marketParticipantClientV1;

    public EsettExchangeController(IESettExchangeClient_V1 client, IMarketParticipantClient_V1 marketParticipantClientV1)
    {
        _client = client;
        _marketParticipantClientV1 = marketParticipantClientV1;
    }

    [HttpGet("DispatchDocument")]
    [Produces("application/octet-stream")]
    public async Task<ActionResult<Stream>> GetDispatchDocumentAsync(string documentId)
    {
        try
        {
            var fileResponse = await _client
                .DispatchDocumentAsync(documentId)
                .ConfigureAwait(false);

            return File(fileResponse.Stream, "application/octet-stream");
        }
        catch (ApiException e) when (e.StatusCode == 404)
        {
            return NotFound();
        }
    }

    [HttpGet("ResponseDocument")]
    [Produces("application/octet-stream")]
    public async Task<ActionResult<Stream>> ResponseDocumentAsync(string documentId)
    {
        try
        {
            var fileResponse = await _client
                .ResponseDocumentAsync(documentId)
                .ConfigureAwait(false);

            return File(fileResponse.Stream, "application/octet-stream");
        }
        catch (ApiException e) when (e.StatusCode == 404)
        {
            return NotFound();
        }
    }

    [HttpGet("StorageDocument")]
    [Produces("application/octet-stream")]
    public async Task<ActionResult<Stream>> StorageDocumentAsync(string documentId)
    {
        try
        {
            var fileResponse = await _client
                .StorageDocumentAsync(documentId)
                .ConfigureAwait(false);

            return File(fileResponse.Stream, "application/octet-stream");
        }
        catch (ApiException e) when (e.StatusCode == 404)
        {
            return NotFound();
        }
    }

    [HttpGet("MgaImbalanceDocument")]
    [Produces("application/octet-stream")]
    public async Task<ActionResult<Stream>> GetMgaImbalanceDocumentAsync(string imbalanceId)
    {
        try
        {
            var fileResponse = await _client
                .DocumentAsync(imbalanceId)
                .ConfigureAwait(false);

            return File(fileResponse.Stream, "application/octet-stream");
        }
        catch (ApiException e) when (e.StatusCode == 404)
        {
            return NotFound();
        }
    }

    [HttpGet("DownloadBalanceResponsiblesAsync")]
    [Produces("application/octet-stream")]
    public async Task DownloadBalanceResponsiblesAsync([FromQuery] string locale, [FromQuery] BalanceResponsibleSortProperty sortProperty, [FromQuery] SortDirection sortDirection)
    {
        Response.ContentType = "application/octet-stream";

        var fileResponse = await _client
            .DownloadGETAsync(locale, sortProperty, sortDirection)
            .ConfigureAwait(false);

        using var reader = new StreamReader(fileResponse.Stream);

        var headerLine = await reader.ReadLineAsync().ConfigureAwait(false);
        if (headerLine == null)
        {
            return;
        }

        var actors = await _marketParticipantClientV1.ActorGetAsync().ConfigureAwait(false);
        var energySuppliers = actors.Where(x => x.MarketRoles.Any(y => y.EicFunction == EicFunction.EnergySupplier)).ToDictionary(x => x.ActorNumber.Value, x => x.Name.Value);
        var balanceResponsibles = actors.Where(x => x.MarketRoles.Any(y => y.EicFunction == EicFunction.BalanceResponsibleParty)).ToDictionary(x => x.ActorNumber.Value, x => x.Name.Value);
        var separator = new CultureInfo(locale).TextInfo.ListSeparator;

        headerLine += $"{separator}\"SUPPLIER_NAME\"{separator}\"BALANCE_RESPONSIBLE_NAME\"\n";

        await using var writer = new StreamWriter(Response.Body);

        await Response.WriteAsync(headerLine).ConfigureAwait(false);

        while (true)
        {
            var line = await reader.ReadLineAsync().ConfigureAwait(false);

            if (line == null)
            {
                break;
            }

            var supplierIndex = line.IndexOf(separator, StringComparison.Ordinal) + 1;
            var responsiIndex = line.IndexOf(separator, supplierIndex, StringComparison.Ordinal) + 1;
            var endIndex = line.IndexOf(separator, responsiIndex, StringComparison.Ordinal) + 1;
            var supplier = line.Substring(supplierIndex, responsiIndex - supplierIndex - 1).Trim('"');
            var responsible = line.Substring(responsiIndex, endIndex - responsiIndex - 1).Trim('"');
            var supplierName = energySuppliers.TryGetValue(supplier, out var s) ? s : string.Empty;
            var responsibleName = balanceResponsibles.TryGetValue(responsible, out var r) ? r : string.Empty;

            await Response.WriteAsync(line).ConfigureAwait(false);
            await Response.WriteAsync(separator).ConfigureAwait(false);
            await Response.WriteAsync(supplierName).ConfigureAwait(false);
            await Response.WriteAsync(separator).ConfigureAwait(false);
            await Response.WriteAsync(responsibleName).ConfigureAwait(false);
            await Response.WriteAsync("\n").ConfigureAwait(false);
        }
    }
}
