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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class MarketParticipantUserController : MarketParticipantControllerBase
{
    private readonly IMarketParticipantClient_V1 _client;

    public MarketParticipantUserController(IMarketParticipantClient_V1 client)
    {
        _client = client;
    }

    /// <summary>
    ///     Retrieves actors associated with the users external actor token.
    /// </summary>
    [HttpGet]
    [Route("GetUserActors")]
    [AllowAnonymous]
    public Task<ActionResult<GetActorsAssociatedWithExternalUserIdResponse>> GetUserActorsAsync()
    {
        var externalToken = HttpContext.Request.Headers["Authorization"].ToString();
        externalToken = externalToken.Replace("Bearer ", string.Empty);
        return HandleExceptionAsync(() => _client.UserActorsGetAsync(externalToken));
    }

    /// <summary>
    /// Initiates MitID signup
    /// </summary>
    [HttpPost]
    [Route("InitiateMitIdSignup")]
    public Task InitiateMitIdSignupAsync()
    {
        return HandleExceptionAsync(() => _client.UserInitiateMitidSignupAsync());
    }

    [HttpPost]
    [Route("ResetMitId")]
    public Task ResetMitIdAsync()
    {
        return HandleExceptionAsync(() => _client.UserResetMitidAsync());
    }
}
