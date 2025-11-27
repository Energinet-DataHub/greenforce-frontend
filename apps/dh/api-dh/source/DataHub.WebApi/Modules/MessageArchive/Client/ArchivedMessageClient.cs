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

using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;
using ActorRoleDtoV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1.ActorRoleDtoV1;
using BusinessReason = Energinet.DataHub.WebApi.Modules.MessageArchive.Enums.BusinessReason;
using DirectionToSortByDtoV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1.DirectionToSortByDtoV1;
using FieldToSortByDtoV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1.FieldToSortByDtoV1;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public class ArchivedMessageClient(
    IB2CClient ediB2CClient,
    IMarketParticipantClient_V1 marketParticipantClient)
    : IArchivedMessageClient
{
    private readonly IB2CClient _ediB2CClient = ediB2CClient;
    private readonly IMarketParticipantClient_V1 _marketParticipantClient = marketParticipantClient;

    public async Task<Connection<ArchivedMessage>> GetArchivedMessagesAsync(
        Interval created,
        Guid? senderId,
        Guid? receiverId,
        DocumentTypeDtoV1[]? documentTypes,
        BusinessReason[]? businessReasons,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order,
        CancellationToken cancellationToken)
    {
        var (field, direction) = GetSorting(order);
        var (cursor, pageSize, forward) = GetPaging(first, after, last, before);
        var (sender, receiver) = await Common.Extensions.TaskExtensions
            .WhenAll(GetArchivedMessageActorActorByIdAsync(senderId), GetArchivedMessageActorActorByIdAsync(receiverId));

        var searchCursor = cursor switch
        {
            null => null,
            _ => new SearchArchivedMessagesCursorDtoV1(
                FieldToSortByValue: cursor.FieldToSortByValue,
                RecordId: cursor.RecordId),
        };
        var archivedMessageSearchCommand = new SearchArchivedMessageCommandV1(
            new SearchArchivedMessageDtoV1(
                new SearchArchivedMessagesCriteriaDtoV1(
                    CreatedDuringPeriod: new(created.Start.ToDateTimeOffset(), created.End.ToDateTimeOffset()),
                    MessageId: null,
                    SenderNumber: sender?.ActorNumber,
                    SenderRole: sender?.ActorRole,
                    ReceiverNumber: receiver?.ActorNumber,
                    ReceiverRole: receiver?.ActorRole,
                    DocumentTypes: documentTypes ?? Enum.GetValues<DocumentTypeDtoV1>(),
                    BusinessReasons: businessReasons == null || !businessReasons.Any() ? null : businessReasons.Select(x => x.ToString()).ToArray()),
                new SearchArchivedMessagesPaginationDtoV1(
                    Cursor: searchCursor,
                    PageSize: pageSize,
                    NavigationForward: forward,
                    SortBy: field,
                    DirectionToSortBy: (DirectionToSortByDtoV1?)direction)));

        return await InternalArchivedMessageSearchAsync(archivedMessageSearchCommand, cancellationToken);
    }

    public async Task<Connection<ArchivedMessage>> GetArchivedMessagesByIdAsync(
        string id,
        bool includeRelated,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order,
        CancellationToken cancellationToken)
    {
        var (field, direction) = GetSorting(order);
        var (cursor, pageSize, forward) = GetPaging(first, after, last, before);

        var archivedMessageSearchCommand = new SearchArchivedMessageCommandV1(
            new SearchArchivedMessageDtoV1(
                new SearchArchivedMessagesCriteriaDtoV1(
                    CreatedDuringPeriod: null,
                    MessageId: id,
                    SenderNumber: null,
                    SenderRole: null,
                    ReceiverNumber: null,
                    ReceiverRole: null,
                    DocumentTypes: Enum.GetValues<DocumentTypeDtoV1>(),
                    BusinessReasons: null,
                    IncludeRelatedMessages: includeRelated),
                new SearchArchivedMessagesPaginationDtoV1(
                    Cursor: cursor switch
                    {
                        null => null,
                        _ => new(
                            FieldToSortByValue: cursor.FieldToSortByValue,
                            RecordId: cursor.RecordId),
                    },
                    PageSize: pageSize,
                    NavigationForward: forward,
                    SortBy: field,
                    DirectionToSortBy: (DirectionToSortByDtoV1?)direction)));

        return await InternalArchivedMessageSearchAsync(archivedMessageSearchCommand, cancellationToken);
    }

    private async Task<Connection<ArchivedMessage>> InternalArchivedMessageSearchAsync(
        SearchArchivedMessageCommandV1 archivedMessageSearchCommand,
        CancellationToken cancellationToken)
    {
        var searchResult = await _ediB2CClient.SendAsync(archivedMessageSearchCommand, cancellationToken)
            .ConfigureAwait(false);

        if (searchResult.IsSuccess)
        {
            var edges = searchResult.Data.Messages
                .Select(MapToArchivedMessage)
                .Select(message => MakeEdge(message, archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.SortBy ?? FieldToSortByDtoV1.CreatedAt))
                .ToList();

            return MakeConnection(
                searchResult.Data.TotalCount,
                edges,
                archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.NavigationForward,
                archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.Cursor is null,
                archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.PageSize);
        }

        return MakeConnection(
            0,
            new List<Edge<ArchivedMessage>>(),
            archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.NavigationForward,
            archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.Cursor is null,
            archivedMessageSearchCommand.SearchArchivedMessageDto.Pagination.PageSize);
    }

    private async Task<(string ActorNumber, ActorRoleDtoV1 ActorRole)?> GetArchivedMessageActorActorByIdAsync(Guid? id)
    {
        if (id is null)
        {
            return null;
        }

        var actor = await _marketParticipantClient.ActorGetAsync(id.Value);
        var actorNumber = actor.ActorNumber.Value;
        var isKnownActorRole = Enum.TryParse<ActorRoleDtoV1>(
            actor.MarketRole.EicFunction.ToString(),
            out var actorRole);

        return isKnownActorRole
            ? new() { ActorNumber = actorNumber, ActorRole = actorRole }
            : null;
    }

    private (SearchArchivedMessagesCursorDtoV1? Cursor, int PageSize, bool Forward) GetPaging(
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

    private static SearchArchivedMessagesCursorDtoV1? ParseCursor(string? cursor)
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
                : new SearchArchivedMessagesCursorDtoV1(FieldToSortByValue: sub[1], RecordId: recordId);
    }

    private (FieldToSortByDtoV1 Field, Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection Direction)
        GetSorting(ArchivedMessageSortInput? order) =>
        order switch
        {
            { MessageId: not null } => (FieldToSortByDtoV1.MessageId, order.MessageId.Value),
            { DocumentType: not null } => (FieldToSortByDtoV1.DocumentType, order.DocumentType.Value),
            { Sender: not null } => (FieldToSortByDtoV1.SenderNumber, order.Sender.Value),
            { Receiver: not null } => (FieldToSortByDtoV1.ReceiverNumber, order.Receiver.Value),
            { CreatedAt: not null } => (FieldToSortByDtoV1.CreatedAt, order.CreatedAt.Value),
            _ => (FieldToSortByDtoV1.CreatedAt, Common.Enums.SortDirection.Desc),
        };

    private ArchivedMessage MapToArchivedMessage(ArchivedMessageResultDtoV1 message) =>
        new(
            message.Id,
            message.MessageId ?? message.Id,
            message.RecordId,
            message.DocumentTypeDtoV1.ToDocumentType(),
            message.CreatedAt,
            message.SenderNumber,
            message.SenderRole.ToString(),
            message.ReceiverNumber,
            message.ReceiverRole.ToString());

    private static Edge<ArchivedMessage> MakeEdge(
        ArchivedMessage message,
        FieldToSortByDtoV1 field)
    {
        var sortCursor = field switch
        {
            FieldToSortByDtoV1.MessageId => message.MessageId,
            FieldToSortByDtoV1.DocumentType => message.DocumentType.ToString(),
            FieldToSortByDtoV1.SenderNumber => message.SenderNumber,
            FieldToSortByDtoV1.ReceiverNumber => message.ReceiverNumber,
            FieldToSortByDtoV1.CreatedAt => message.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss.fff"),
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
