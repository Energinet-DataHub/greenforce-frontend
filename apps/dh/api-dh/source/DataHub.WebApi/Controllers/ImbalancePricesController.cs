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

using System;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public sealed class ImbalancePricesController : ControllerBase
    {
        private readonly IImbalancePricesClient_V1 _client;

        public ImbalancePricesController(IImbalancePricesClient_V1 client)
        {
            _client = client;
        }

        /// <summary>
        /// Uploads a CSV file with imbalancePrices
        /// </summary>
        [HttpPost]
        [Route("UploadImbalanceCSV")]
        [RequestSizeLimit(10485760)]
        public async Task<ActionResult> UploadImbalancePricesAsync(IFormFile csvFile)
        {
            try
            {
                await using var openReadStream = csvFile.OpenReadStream();
                await _client.UploadAsync(new FileParameter(openReadStream));
                return Ok();
            }
            catch (ApiException ex)
            {
                return StatusCode(ex.StatusCode, ex.Response);
            }
        }

        /// <summary>
        /// Download a CSV file with imbalancePrices
        /// </summary>
        [HttpGet]
        [Route("DownloadImbalanceCSV")]
        [Produces(MediaTypeNames.Text.Plain)]
        public async Task<ActionResult<Stream>> DownloadImbalancePricesAsync(int month, int year)
        {
            try
            {
                var f = new DateTime(year, month, 1);
                var t = new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59);
                var tz = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");
                var from = TimeZoneInfo.ConvertTime(new DateTimeOffset(f, tz.GetUtcOffset(f)), tz);
                var to = TimeZoneInfo.ConvertTime(new DateTimeOffset(t, tz.GetUtcOffset(t)), tz);
                await _client.DownloadAsync(from, to);
                return File(Response.Body, MediaTypeNames.Text.Plain);
            }
            catch (ApiException ex)
            {
                return StatusCode(ex.StatusCode, ex.Response);
            }
        }
    }
}
