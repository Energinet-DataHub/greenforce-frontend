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

using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantUserOverviewController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient _client;

        public MarketParticipantUserOverviewController(IMarketParticipantClient client)
        {
            _client = client;
        }

        [HttpGet]
        [Route("GetUserOverview")]
        public Task<ActionResult<UserOverviewResultDto>> GetUserOverviewAsync(
            int pageNumber,
            int pageSize,
            UserOverviewSortProperty sortProperty,
            SortDirection sortDirection,
            string? searchText,
            [FromQuery] IEnumerable<UserStatus> userStatus)
        {
            return HandleExceptionAsync(() => _client.GetUserOverviewAsync(pageNumber, pageSize, sortProperty, sortDirection, searchText, userStatus));
        }

        [HttpPost]
        [Route("SearchUsers")]
        public Task<ActionResult<UserOverviewResultDto>> SearchUsersAsync(
            int pageNumber,
            int pageSize,
            UserOverviewSortProperty sortProperty,
            SortDirection sortDirection,
            [FromBody] UserOverviewFilterDto filter)
        {
            return HandleExceptionAsync(() => _client.SearchUsersAsync(pageNumber, pageSize, sortProperty, sortDirection, filter));
        }
    }
}
