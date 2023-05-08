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
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Energinet.DataHub.WebApi.Clients.EDI
{
    public class ArchivedMessagesSearch
    {
        private readonly HttpClient _httpClient;

        public ArchivedMessagesSearch(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<SearchResult> SearchAsync(
            ArchivedMessageSearchCriteria archivedMessageSearch,
            CancellationToken cancellationToken)
        {
            var searchResultResponseMessages =
                await GetSearchResultResponseMessagesAsync(archivedMessageSearch, cancellationToken);

            if (searchResultResponseMessages == null)
            {
                throw new InvalidOperationException("Could not parse response content from EDI.");
            }

            return MapResult(searchResultResponseMessages);
        }

        private async Task<IReadOnlyList<ArchivedMessageDto>?> GetSearchResultResponseMessagesAsync(
            ArchivedMessageSearchCriteria archivedMessageSearch,
            CancellationToken cancellationToken)
        {
            var url = "api/archivedmessages";
            var content = new StringContent(JsonSerializer.Serialize(
                new ArchivedMessageSearchCriteriaDto(
                    new CreatedDuringPeriod(
                archivedMessageSearch.DateTimeFrom,
                archivedMessageSearch.DateTimeTo),
                    archivedMessageSearch.MessageId,
                    archivedMessageSearch.SenderId)));

            var response = await _httpClient.PostAsync(url, content, cancellationToken);

            response.EnsureSuccessStatusCode();

            var searchResultResponseMessages =
                await response.Content.ReadFromJsonAsync<IReadOnlyList<ArchivedMessageDto>>().ConfigureAwait(false);

            return searchResultResponseMessages;
        }

        private static SearchResult MapResult(IReadOnlyList<ArchivedMessageDto> searchResultResponseMessages)
        {
            var result = new List<ArchivedMessage>();

            foreach (var archivedMessageDto in searchResultResponseMessages)
            {
                result.Add(new ArchivedMessage(
                    archivedMessageDto.MessageId,
                    archivedMessageDto.DocumentType,
                    DateTimeOffset.Parse(archivedMessageDto.CreatedAt),
                    archivedMessageDto.SenderNumber,
                    archivedMessageDto.ReceiverNumber));
            }

            return new SearchResult(result);
        }
    }
}
