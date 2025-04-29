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
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;
using IMarketParticipantClient_V1 = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.IMarketParticipantClient_V1;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public class MessageArchiveClient(
    IEdiB2CWebAppClient_V1 client,
    IMarketParticipantClient_V1 marketParticipantClient) : IMessageArchiveClient
{
    public async Task<Connection<ArchivedMessage>> GetMeteringPointArchivedMessagesAsync(
        Interval created,
        string meteringPointId,
        Guid? senderId,
        Guid? receiverId,
        MeteringPointDocumentType? documentType,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order)
    {
        var (field, direction) = GetSorting(order);
        var (cursor, pageSize, forward) = GetPaging(first, after, last, before);
        var criteria = new MeteringPointArchivedMessageSearchCriteria()
        {
            Pagination = new()
            {
                Cursor = cursor,
                PageSize = pageSize,
                NavigationForward = forward,
                SortBy = field,
                DirectionToSortBy = (DirectionToSortBy?)direction,
            },
            MeteringPointId = meteringPointId,
            MeasureDataDocumentTypes = documentType is not null ? [documentType.Value] : null,
            Receiver = receiverId is not null ? await GetActorByIdAsync(receiverId.Value) : null,
            Sender = senderId is not null ? await GetActorByIdAsync(senderId.Value) : null,
            CreatedDuringPeriod = new()
            {
                Start = created.Start.ToDateTimeOffset(),
                End = created.End.ToDateTimeOffset(),
            },
        };

        var result = await client.SearchAsync(body: criteria);
        var edges = result.Messages
            .Select(message => new ArchivedMessage(
                message.Id,
                message.CursorValue,
                message.DocumentType.ToDocumentType(),
                message.CreatedAt,
                message.Sender,
                message.Receiver))
            .Select(message => MakeEdge(message, field))
            .ToList();

        return MakeConnection(result.TotalCount, edges, criteria.Pagination);
    }

    private async Task<Actor?> GetActorByIdAsync(Guid id)
    {
        var actor = await marketParticipantClient.ActorGetAsync(id);
        var actorNumber = actor.ActorNumber.Value;
        var isKnownActorRole = Enum.TryParse<ActorRole>(
            actor.MarketRole.EicFunction.ToString(),
            out var actorRole);

        return isKnownActorRole
            ? new() { ActorNumber = actorNumber, ActorRole = actorRole }
            : null;
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

    private (FieldToSortBy Field, SortDirection Direction) GetSorting(ArchivedMessageSortInput? order) =>
        order switch
        {
            { MessageId: not null } => (FieldToSortBy.MessageId, order.MessageId.Value),
            { DocumentType: not null } => (FieldToSortBy.DocumentType, order.DocumentType.Value),
            { Sender: not null } => (FieldToSortBy.SenderNumber, order.Sender.Value),
            { Receiver: not null } => (FieldToSortBy.ReceiverNumber, order.Receiver.Value),
            { CreatedAt: not null } => (FieldToSortBy.CreatedAt, order.CreatedAt.Value),
            _ => (FieldToSortBy.CreatedAt, SortDirection.Desc),
        };

    private (SearchArchivedMessagesCursor? Cursor, int PageSize, bool Forward) GetPaging(
        int? first,
        string? after,
        int? last,
        string? before)
    {
        var cursor = ParseCursor(after ?? before);
        var pageSize = first ?? last ?? 50;
        var forward = !last.HasValue;
        return (cursor, pageSize, forward);
    }

    private static Edge<ArchivedMessage> MakeEdge(
        ArchivedMessage message,
        FieldToSortBy field)
    {
        var sortCursor = field switch
        {
            FieldToSortBy.MessageId => message.Id.ToString(),
            FieldToSortBy.DocumentType => message.DocumentType.ToString(),
            FieldToSortBy.SenderNumber => message.Sender.ActorNumber,
            FieldToSortBy.ReceiverNumber => message.Receiver.ActorNumber,
            FieldToSortBy.CreatedAt => message.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss.fff"),
        };

        return new Edge<ArchivedMessage>(message, $"{message.CursorValue}+{sortCursor}");
    }

    private static Connection<ArchivedMessage> MakeConnection(
        int totalCount,
        List<Edge<ArchivedMessage>> edges,
        SearchArchivedMessagesPagination pagination)
    {
        var forward = pagination.NavigationForward;
        var cursor = pagination.Cursor;
        var pageSize = pagination.PageSize;

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

        return new Connection<ArchivedMessage>(edges, pageInfo, totalCount);
    }
}
