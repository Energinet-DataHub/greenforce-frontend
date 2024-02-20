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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.EDI;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MessageArchiveController : ControllerBase
    {
        private readonly ArchivedMessagesSearch _archivedMessagesSearch;
        private readonly ActorService _actorService;

        public MessageArchiveController(ArchivedMessagesSearch archivedMessagesSearch, ActorService actorService)
        {
            _archivedMessagesSearch =
                archivedMessagesSearch ?? throw new ArgumentNullException(nameof(archivedMessagesSearch));
            _actorService = actorService ?? throw new ArgumentNullException(nameof(actorService));
        }

        /// <summary>
        /// Get saved request and response logs.
        /// </summary>
        /// <returns>Search result.</returns>
        [HttpPost("SearchRequestResponseLogs")]
        public async Task<ActionResult<SearchResult>> SearchRequestResponseLogsAsync(
            ArchivedMessageSearchCriteria archivedMessageSearch, CancellationToken cancellationToken)
        {
            var result = await _archivedMessagesSearch.SearchAsync(archivedMessageSearch, cancellationToken)
                .ConfigureAwait(false);

            return !result.Messages.Any() ? NoContent() : Ok(result);
        }

        [HttpGet("Actors")]
        public async Task<ActionResult<IEnumerable<Actor>>> GetActorsAsync(CancellationToken cancellationToken)
        {
            var result = await _actorService.GetActorsAsync(cancellationToken);

            return !result.Any() ? NoContent() : Ok(result);
        }

        [HttpGet("{id}/Document")]
        [Produces("text/plain")]
        public async Task<ActionResult<string>> GetDocumentAsync(string id, CancellationToken cancellationToken)
        {
            var document = await _archivedMessagesSearch.GetDocumentAsync(Guid.Parse(id), cancellationToken);
            return Ok(document);
        }
    }
}
