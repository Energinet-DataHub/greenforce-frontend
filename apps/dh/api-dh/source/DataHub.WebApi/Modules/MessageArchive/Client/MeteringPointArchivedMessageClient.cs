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
using Energinet.DataHub.EDI.B2CClient.Abstractions.MeteringPointArchivedMessages.V1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;
using SearchDocumentType = Energinet.DataHub.WebApi.Model.MeteringPointArchivedMessages.MeteringPointDocumentType;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public class MeteringPointArchivedMessageClient(
    IB2CClient ediB2CClient,
    IMarketParticipantClient_V1 marketParticipantClient) : IMeteringPointArchivedMessageClient
{
    private readonly IB2CClient _ediB2CClient = ediB2CClient;
    private readonly IMarketParticipantClient_V1 _marketParticipantClient = marketParticipantClient;

    public async Task<Connection<ArchivedMessage>> GetMeteringPointArchivedMessagesAsync(
        Interval created,
        string meteringPointId,
        Guid? senderId,
        Guid? receiverId,
        SearchDocumentType? documentType,
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

        var archivedMessageSearchCommand = new SearchMeteringPointArchivedMessageCommandV1(
            new SearchMeteringPointArchivedMessageDtoV1(
                new SearchMeteringPointArchivedMessagesCriteriaDtoV1(
                    MeteringPointId: meteringPointId,
                    CreatedDuringPeriod:
                    new MessageCreationPeriodDtoV1(created.Start.ToDateTimeOffset(), created.End.ToDateTimeOffset()),
                    Sender: sender,
                    Receiver: receiver,
                    DocumentTypes: documentType != null ? [MapDocumentType(documentType)] : Enum.GetValues<MeteringPointDocumentTypeDtoV1>()),
                new SearchMeteringPointArchivedMessagesPaginationDtoV1(
                    Cursor: cursor,
                    PageSize: pageSize,
                    NavigationForward: forward,
                    SortBy: field,
                    DirectionToSortBy: (DirectionToSortByDtoV1?)direction)));

        var searchResult = await _ediB2CClient.SendAsync(archivedMessageSearchCommand, cancellationToken)
            .ConfigureAwait(false);

        if (searchResult.IsSuccess)
        {
            var edges = searchResult.Data.Messages
                .Select(message => new ArchivedMessage(
                    message.Id.ToString(),
                    message.MessageId.ToString(),
                    message.CursorValue,
                    message.DocumentType.ToDocumentType(),
                    message.CreatedAt,
                    message.Sender.ActorNumber,
                    message.Sender.ActorRole.ToString(),
                    message.Receiver.ActorNumber,
                    message.Receiver.ActorRole.ToString()))
                .Select(message => MakeSearchEdge(message, field))
                .ToList();

            return MakeConnection(
                searchResult.Data.TotalCount,
                edges,
                archivedMessageSearchCommand.SearchArchivedMessage.Pagination.NavigationForward,
                archivedMessageSearchCommand.SearchArchivedMessage.Pagination.Cursor is null,
                archivedMessageSearchCommand.SearchArchivedMessage.Pagination.PageSize);
        }

        return MakeConnection(
            0,
            new List<Edge<ArchivedMessage>>(),
            archivedMessageSearchCommand.SearchArchivedMessage.Pagination.NavigationForward,
            archivedMessageSearchCommand.SearchArchivedMessage.Pagination.Cursor is null,
            archivedMessageSearchCommand.SearchArchivedMessage.Pagination.PageSize);
    }

    private MeteringPointDocumentTypeDtoV1 MapDocumentType(SearchDocumentType? searchDocumentType) =>
        searchDocumentType switch
        {
            SearchDocumentType.Acknowledgement => MeteringPointDocumentTypeDtoV1.Acknowledgement,
            SearchDocumentType.SendMeasurements => MeteringPointDocumentTypeDtoV1.SendMeasurements,
            SearchDocumentType.RequestMeasurements => MeteringPointDocumentTypeDtoV1.RequestMeasurements,
            SearchDocumentType.RejectRequestMeasurements => MeteringPointDocumentTypeDtoV1.RejectRequestMeasurements,
            SearchDocumentType.UpdateChargeLinks => MeteringPointDocumentTypeDtoV1.UpdateChargeLinks,
            SearchDocumentType.ConfirmRequestChangeBillingMasterData => MeteringPointDocumentTypeDtoV1
                .ConfirmRequestChangeBillingMasterData,
            SearchDocumentType.RejectRequestChangeBillingMasterData => MeteringPointDocumentTypeDtoV1
                .RejectRequestChangeBillingMasterData,
            SearchDocumentType.NotifyBillingMasterData => MeteringPointDocumentTypeDtoV1
                .NotifyBillingMasterData,
            _ => throw new ArgumentOutOfRangeException(nameof(searchDocumentType), $"Unsupported document type: {searchDocumentType}"),
        };

    private (FieldToSortByDtoV1 Field,
        Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection Direction) GetSorting(
            ArchivedMessageSortInput? order) =>
        order switch
        {
            { MessageId: not null } => (FieldToSortByDtoV1.MessageId, order.MessageId.Value),
            { DocumentType: not null } => (FieldToSortByDtoV1.DocumentType, order.DocumentType.Value),
            { Sender: not null } => (FieldToSortByDtoV1.SenderNumber, order.Sender.Value),
            { Receiver: not null } => (FieldToSortByDtoV1.ReceiverNumber, order.Receiver.Value),
            { CreatedAt: not null } => (FieldToSortByDtoV1.CreatedAt, order.CreatedAt.Value),
            _ => (FieldToSortByDtoV1.CreatedAt, Common.Enums.SortDirection.Desc),
        };

    private (SearchMeteringPointArchivedMessagesCursorDtoV1? Cursor, int PageSize, bool Forward) GetPaging(
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

    private static SearchMeteringPointArchivedMessagesCursorDtoV1? ParseCursor(string? cursor)
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
                : new SearchMeteringPointArchivedMessagesCursorDtoV1(FieldToSortByValue: sub[1], RecordId: recordId);
    }

    private async Task<ActorDtoV1?> GetArchivedMessageActorActorByIdAsync(Guid? id)
    {
        if (id is null)
        {
            return null;
        }

        var actor = await _marketParticipantClient.ActorGetAsync(id.Value);
        var actorNumber = actor.ActorNumber.Value;
        var isKnownActorRole =
            Enum.TryParse<ActorRoleDtoV1>(actor.MarketRole.EicFunction.ToString(), out var actorRole);

        return isKnownActorRole
            ? new(ActorNumber: actorNumber, ActorRole: actorRole)
            : null;
    }

    private static Edge<ArchivedMessage> MakeSearchEdge(
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
