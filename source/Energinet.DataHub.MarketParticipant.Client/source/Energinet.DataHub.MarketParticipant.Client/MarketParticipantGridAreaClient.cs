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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Flurl.Http;

namespace Energinet.DataHub.MarketParticipant.Client
{
    public sealed class MarketParticipantGridAreaClient : IMarketParticipantGridAreaClient
    {
        private const string GridAreasBaseUrl = "gridarea";

        private readonly IFlurlClient _httpClient;

        public MarketParticipantGridAreaClient(IFlurlClient client)
        {
            _httpClient = client;
        }

        public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync()
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(GridAreasBaseUrl).GetAsync())
                .ConfigureAwait(false);

            var gridAreas = await response
                .GetJsonAsync<IEnumerable<GridAreaDto>>()
                .ConfigureAwait(false);

            return gridAreas;
        }

        public async Task<GridAreaDto> GetGridAreaAsync(Guid gridAreaId)
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(GridAreasBaseUrl, gridAreaId).GetAsync())
                .ConfigureAwait(false);

            var gridArea = await response
                .GetJsonAsync<GridAreaDto>()
                .ConfigureAwait(false);

            return gridArea;
        }

        public Task UpdateGridAreaAsync(ChangeGridAreaDto changes)
        {
            return ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(GridAreasBaseUrl).PutJsonAsync(changes));
        }

        public async Task<IEnumerable<GridAreaAuditLogEntryDto>> GetGridAreaAuditLogEntriesAsync(Guid gridAreaId)
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(GridAreasBaseUrl, gridAreaId, "auditlogentry").GetAsync())
                .ConfigureAwait(false);

            var gridAreas = await response
                .GetJsonAsync<IEnumerable<GridAreaAuditLogEntryDto>>()
                .ConfigureAwait(false);

            return gridAreas;
        }
    }
}
