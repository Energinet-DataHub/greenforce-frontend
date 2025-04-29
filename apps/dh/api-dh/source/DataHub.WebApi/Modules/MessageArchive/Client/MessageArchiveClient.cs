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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using IEdiB2CWebAppClient_V3 = Energinet.DataHub.Edi.B2CWebApp.Clients.v3.IEdiB2CWebAppClient_V3;
using SortDirection = Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public partial class MessageArchiveClient(
    IEdiB2CWebAppClient_V1 clientV1,
    IEdiB2CWebAppClient_V3 clientV3,
    IMarketParticipantClient_V1 marketParticipantClient)
    : IMessageArchiveClient
{
    private async Task<Actor?> GetActorByIdAsync(Guid? id)
    {
        if (id is null)
        {
            return null;
        }

        var actor = await marketParticipantClient.ActorGetAsync(id.Value);
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
            FieldToSortBy.SenderNumber => message.SenderNumber,
            FieldToSortBy.ReceiverNumber => message.ReceiverNumber,
            FieldToSortBy.CreatedAt => message.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss.fff"),
        };

        return new Edge<ArchivedMessage>(message, $"{message.CursorValue}+{sortCursor}");
    }

    private Connection<ArchivedMessage> MakeConnection(
        int totalCount,
        List<Edge<ArchivedMessage>> edges,
        bool forward,
        bool cursorIsNull,
        int pageSize)
    {
        // This logic is not completely sound, since it may be inaccurate when the
        // TotalCount is divisible with PageSize. Given that this is already an edge
        // case AND at worst results in an empty page AND the frontend does not use
        // these values at all (it has its own logic for determining these), it is
        // an acceptable compromise over having to include these in the client API.
        var exhausted = edges.Count < pageSize;
        var isFirstPage = (cursorIsNull && forward) || (exhausted && !forward);
        var isLastPage = (cursorIsNull && !forward) || (exhausted && forward);
        var pageInfo = new ConnectionPageInfo(
            !isFirstPage,
            !isLastPage,
            edges.FirstOrDefault()?.Cursor,
            edges.LastOrDefault()?.Cursor);

        return new Connection<ArchivedMessage>(edges, pageInfo, totalCount);
    }
}
