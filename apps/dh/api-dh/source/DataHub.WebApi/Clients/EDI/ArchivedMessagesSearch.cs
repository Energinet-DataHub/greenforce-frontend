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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Clients.EDI
{
    public class ArchivedMessagesSearch
    {
        private readonly IEdiB2CWebAppClient_V1 _b2CWebAppClient;

        public ArchivedMessagesSearch(IEdiB2CWebAppClient_V1 b2CWebAppClient)
        {
            _b2CWebAppClient = b2CWebAppClient;
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

        public async Task<string> GetDocumentAsync(string id, CancellationToken cancellationToken)
        {
           return await _b2CWebAppClient.ArchivedMessageGetDocumentAsync(id, cancellationToken).ConfigureAwait(false);
        }

        private async Task<ICollection<ArchivedMessageResult>?> GetSearchResultResponseMessagesAsync(
            ArchivedMessageSearchCriteria archivedMessageSearch,
            CancellationToken cancellationToken)
        {
            var period = new MessageCreationPeriod()
            {
                Start = DateTimeOffset.Parse(archivedMessageSearch.DateTimeFrom),
                End = DateTimeOffset.Parse(archivedMessageSearch.DateTimeTo),
            };

            var criteria = new SearchArchivedMessagesCriteria()
            {
                CreatedDuringPeriod = period,
                MessageId = archivedMessageSearch.MessageId,
                SenderNumber = archivedMessageSearch.SenderNumber,
                ReceiverNumber = archivedMessageSearch.ReceiverNumber,
                DocumentTypes = archivedMessageSearch.DocumentTypes,
                BusinessReasons = archivedMessageSearch.BusinessReasons,
            };

            return await _b2CWebAppClient.ArchivedMessageSearchAsync(criteria, cancellationToken);
        }

        private static SearchResult MapResult(ICollection<ArchivedMessageResult> searchResultResponseMessages)
        {
            var result = new List<ArchivedMessage>();

            foreach (var archivedMessageDto in searchResultResponseMessages)
            {
                result.Add(new ArchivedMessage(
                    archivedMessageDto.Id,
                    archivedMessageDto.MessageId,
                    archivedMessageDto.DocumentType,
                    archivedMessageDto.CreatedAt,
                    archivedMessageDto.SenderNumber,
                    archivedMessageDto.ReceiverNumber));
            }

            return new SearchResult(result);
        }
    }
}
