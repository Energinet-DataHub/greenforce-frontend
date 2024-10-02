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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v2;
using ArchivedMessageResult = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.ArchivedMessageResult;
using MessageCreationPeriod = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.MessageCreationPeriod;
using SearchArchivedMessagesCriteria = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.SearchArchivedMessagesCriteria;

namespace Energinet.DataHub.WebApi.Clients.EDI;

public class ArchivedMessagesSearch
{
    private readonly IEdiB2CWebAppClient_V1 _b2CWebAppClient;
    private readonly IEdiB2CWebAppClient_V2 _b2CWebAppClientV2;

    public ArchivedMessagesSearch(
        IEdiB2CWebAppClient_V1 b2CWebAppClient,
        IEdiB2CWebAppClient_V2 b2CWebAppClientV2)
    {
        _b2CWebAppClient = b2CWebAppClient;
        _b2CWebAppClientV2 = b2CWebAppClientV2;
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

    public async Task<string> GetDocumentAsync(Guid id, CancellationToken cancellationToken)
    {
       return await _b2CWebAppClient.ArchivedMessageGetDocumentAsync(id, "1.0", cancellationToken).ConfigureAwait(false);
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
            IncludeRelatedMessages = archivedMessageSearch.IncludeRelatedMessages,
        };

        var searchRequest = new SearchArchivedMessagesRequest()
        {
            SearchCriteria = criteria,
            Pagination = new SearchArchivedMessagesPagination
            {
                // Pointing to the field value to sort by and the record id.
                // When navigating forward, the cursor points to the last record of the current page.
                // and when navigating backward, the cursor points to the first record of the current page.
                // The cursor used is not part of the result set.
                // Cursor = new SearchArchivedMessagesCursor(),
                PageSize = 1500000,
                NavigationForward = true,
                SortBy = FieldToSortBy.CreatedAt,
                DirectionToSortBy = DirectionToSortBy.Descending,
            },
        };
        return await _b2CWebAppClientV2.ArchivedMessageSearchAsync("1.0", searchRequest, cancellationToken);
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
