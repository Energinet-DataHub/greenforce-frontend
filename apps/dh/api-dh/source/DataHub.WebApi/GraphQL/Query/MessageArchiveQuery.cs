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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v2;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Microsoft.IdentityModel.Tokens;
using NodaTime;
using ArchivedMessageResult = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.ArchivedMessageResult;
using MessageCreationPeriod = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.MessageCreationPeriod;
using SearchArchivedMessagesCriteria = Energinet.DataHub.Edi.B2CWebApp.Clients.v2.SearchArchivedMessagesCriteria;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    [UseSorting]
    public async Task<IEnumerable<ArchivedMessageResult>> GetArchivedMessagesAsync(
        Interval created,
        string? senderNumber,
        string? receiverNumber,
        DocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        string? filter,
        [Service] IEdiB2CWebAppClient_V2 client)
    {
        var searchCriteria = !string.IsNullOrWhiteSpace(filter)
            ? new SearchArchivedMessagesCriteria() { MessageId = filter, IncludeRelatedMessages = true }
            : new SearchArchivedMessagesCriteria()
            {
                CreatedDuringPeriod = new MessageCreationPeriod()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
                SenderNumber = string.IsNullOrEmpty(senderNumber) ? null : senderNumber,
                ReceiverNumber = string.IsNullOrEmpty(receiverNumber) ? null : receiverNumber,
                DocumentTypes = documentTypes.IsNullOrEmpty()
                    ? null
                    : documentTypes?.Select(x => x.ToString()).ToArray(),
                BusinessReasons = businessReasons.IsNullOrEmpty()
                    ? null
                    : businessReasons?.Select(x => x.ToString()).ToArray(),
            };

        var pagination = new SearchArchivedMessagesPagination
        {
            // Pointing to the field value to sort by and the record id.
            // When navigating forward, the cursor points to the last record of the current page.
            // and when navigating backward, the cursor points to the first record of the current page.
            // The cursor used is not part of the result set.
            // Cursor = new SearchArchivedMessagesCursor(),
            PageSize = 2000000,
            NavigationForward = true,
            SortBy = FieldToSortBy.CreatedAt,
            DirectionToSortBy = DirectionToSortBy.Descending,
        };

        var searchArchivedMessagesRequest = new SearchArchivedMessagesRequest
        {
            SearchCriteria = searchCriteria,
            Pagination = pagination,
        };

        return await client.ArchivedMessageSearchAsync("1.0", searchArchivedMessagesRequest, CancellationToken.None);
    }
}
