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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.Import;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public sealed class ElectricityMarketController : ControllerBase
{
    private readonly IElectricityMarketImportClient _client;

    public ElectricityMarketController(IElectricityMarketImportClient client)
    {
        _client = client;
    }

    [HttpPost]
    [Route("ImportTransactions")]
    [RequestSizeLimit(10485760)]
    public async Task<ActionResult> ImportTransactionsAsync(IFormFile csvFile)
    {
        try
        {
            await using var openReadStream = csvFile.OpenReadStream();
            await _client.ImportTransactionsAsync(openReadStream, default);
            return Ok();
        }
        catch (ApiException ex)
        {
            return StatusCode(ex.StatusCode, ex.Response);
        }
    }
}
