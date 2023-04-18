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

        public async Task<SearchResult> SearchAsync(CancellationToken cancellationToken)
        {
            var url = "/api/messages";
            var response = await _httpClient.GetAsync(url, cancellationToken);
            response.EnsureSuccessStatusCode();

            var searchResultResponse =
                await response.Content.ReadFromJsonAsync<SearchResultResponse>().ConfigureAwait(false);

            if (searchResultResponse == null)
            {
                throw new InvalidOperationException("Could not parse response content from EDI.");
            }

            var result = new List<ArchivedMessage>();

            foreach (var archivedMessageDto in searchResultResponse.Messages)
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

    public sealed record SearchResult(IReadOnlyList<ArchivedMessage> Messages);

    public sealed record ArchivedMessage(
        string? MessageId,
        string? MessageType,
        DateTimeOffset? CreatedDate,
        string? SenderGln,
        string? ReceiverGln);

    public sealed record SearchResultResponse(IReadOnlyList<ArchivedMessageDto> Messages);

    public sealed record ArchivedMessageDto(
        string MessageId,
        string DocumentType,
        string CreatedAt,
        string SenderNumber,
        string ReceiverNumber);
}
