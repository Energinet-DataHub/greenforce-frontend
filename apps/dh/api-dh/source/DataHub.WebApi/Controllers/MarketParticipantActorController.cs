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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantActorController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient_V1 _client;

        public MarketParticipantActorController(IMarketParticipantClient_V1 client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieves currently configured credentials for an actor, or returns 404.
        /// </summary>
        [HttpGet]
        [Route("GetActorCredentials")]
        public async Task<ActionResult<ActorCredentialsDto>> GetActorCredentialsAsync(Guid actorId)
        {
            try
            {
                return Ok(await _client.CredentialsGETAsync(actorId).ConfigureAwait(false));
            }
            catch (ApiException ex) when (ex.StatusCode == 404)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// Assigns the given certificate credentials to the actor.
        /// </summary>
        [HttpPost]
        [Route("AssignCertificateCredentials")]
        [RequestSizeLimit(10485760)]
        public Task<ActionResult> AssignCertificateCredentialsAsync(Guid actorId, IFormFile certificate)
        {
            return HandleExceptionAsync(async () =>
            {
                await using var openReadStream = certificate.OpenReadStream();
                await _client.CertificateAsync(actorId, new FileParameter(openReadStream)).ConfigureAwait(false);
            });
        }

        /// <summary>
        /// Request ClientSecret credentials to the actor.
        /// </summary>
        [HttpPost]
        [Route("RequestClientSecretCredentials")]
        public Task<ActionResult<ActorClientSecretDto>> RequestClientSecretCredentialsAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.SecretAsync(actorId));
        }

        /// <summary>
        /// Removes the current credentials from the actor.
        /// </summary>
        [HttpDelete("RemoveActorCredentials")]
        public Task RemoveActorCredentialsAsync(Guid actorId)
        {
            return HandleExceptionAsync(() => _client.CredentialsDELETEAsync(actorId));
        }
    }
}
