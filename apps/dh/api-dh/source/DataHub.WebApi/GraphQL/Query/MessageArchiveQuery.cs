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

using System.Globalization;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v2;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.MessageArchive;
using HotChocolate.Types.Pagination;
using Microsoft.IdentityModel.Tokens;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    public async Task<Connection<ArchivedMessageResultV2>> GetArchivedMessagesAsync(
        Interval created,
        string? senderNumber,
        string? receiverNumber,
        DocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        bool? includeRelated,
        string? after,
        string? before,
        int? first,
        int? last,
        ArchivedMessageSortInput? order,
        string? filter,
        [Service] IEdiB2CWebAppClient_V2 client)
    {
        var searchCriteria = !string.IsNullOrWhiteSpace(filter)
            ? new SearchArchivedMessagesCriteria()
            {
                MessageId = filter,
                IncludeRelatedMessages = includeRelated ?? false,
            }
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

        var (field, direction) = order switch
        {
            { MessageId: not null } => (FieldToSortBy.MessageId, order.MessageId),
            { DocumentType: not null } => (FieldToSortBy.DocumentType, order.DocumentType),
            { Sender: not null } => (FieldToSortBy.SenderNumber, order.Sender),
            { Receiver: not null } => (FieldToSortBy.ReceiverNumber, order.Receiver),
            { CreatedAt: not null } => (FieldToSortBy.CreatedAt, order.CreatedAt),
            _ => (FieldToSortBy.CreatedAt, SortDirection.Desc),
        };

        var pageSize = first ?? last ?? 50;
        var cursor = ParseCursor(after ?? before);
        var forward = !last.HasValue;
        var pagination = new SearchArchivedMessagesPagination
        {
            Cursor = cursor,
            PageSize = pageSize,
            NavigationForward = forward,
            SortBy = field,
            DirectionToSortBy = (DirectionToSortBy?)direction,
        };

        var searchArchivedMessagesRequest = new SearchArchivedMessagesRequest
        {
            SearchCriteria = searchCriteria,
            Pagination = pagination,
        };

        var response = await client.ArchivedMessageSearchAsync(
            "2.0",
            searchArchivedMessagesRequest,
            CancellationToken.None);

        var edges = response.Messages.Select(message => MakeEdge(message, field)).ToList();

        // This logic is not completely sound, since it may be inaccurate when the
        // TotalCount is divisible with PageSize. Given that this is already an edge
        // case AND at worst results in an empty page AND the frontend does not use
        // these values at all (it has its own logic for determining these), it is
        // an acceptable compromise over having to include these in the client API.
        var exhausted = edges.Count < pageSize;
        var isFirstPage = (cursor is null && forward) || (exhausted && !forward);
        var isLastPage = (cursor is null && !forward) || (exhausted && forward);

        var pageInfo = new ConnectionPageInfo(
            !isFirstPage,
            !isLastPage,
            edges.FirstOrDefault()?.Cursor,
            edges.LastOrDefault()?.Cursor);

        var connection = new Connection<ArchivedMessageResultV2>(
            edges,
            pageInfo,
            response.TotalCount);

        return connection;
    }

    private static SearchArchivedMessagesCursor? ParseCursor(string? cursor)
    {
        if (cursor is null)
        {
            return null;
        }

        var sub = cursor.Split('+', 2);

        return sub.Length != 2
            ? throw new FormatException("The cursor is not in the expected format.")
            : !long.TryParse(sub[0], out var recordId)
            ? throw new FormatException("The record ID is not a valid long.")
            : new SearchArchivedMessagesCursor { FieldToSortByValue = sub[1], RecordId = recordId };
    }

    private static Edge<ArchivedMessageResultV2> MakeEdge(
        ArchivedMessageResultV2 message,
        FieldToSortBy field)
    {
        var sortCursor = field switch
        {
            FieldToSortBy.MessageId => message.MessageId ?? string.Empty,
            FieldToSortBy.DocumentType => message.DocumentType,
            FieldToSortBy.SenderNumber => message.SenderNumber ?? string.Empty,
            FieldToSortBy.ReceiverNumber => message.ReceiverNumber ?? string.Empty,
            FieldToSortBy.CreatedAt => message.CreatedAt.ToString("o"),
        };

        return new Edge<ArchivedMessageResultV2>(message, $"{message.RecordId}+{sortCursor}");
    }
}
