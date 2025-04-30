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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using Microsoft.IdentityModel.Tokens;
using NodaTime;
using SearchDocumentType = Energinet.DataHub.Edi.B2CWebApp.Clients.v3.DocumentType;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public partial class MessageArchiveClient
{
    public async Task<Connection<ArchivedMessage>> GetArchivedMessagesAsync(
        Interval created,
        Guid? senderId,
        Guid? receiverId,
        SearchDocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order)
    {
        var (field, direction) = GetSorting(order);
        var (cursor, pageSize, forward) = GetPaging(first, after, last, before);
        var (sender, receiver) = await Common.Extensions.TaskExtensions
            .WhenAll(GetActorByIdAsync(senderId), GetActorByIdAsync(receiverId));

        var request = new SearchArchivedMessagesRequestV3
        {
            SearchCriteria = new()
            {
                CreatedDuringPeriod = new()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
                SenderNumber = sender?.ActorNumber,
                SenderRole = (ActorRole?)sender?.ActorRole,
                ReceiverNumber = receiver?.ActorNumber,
                ReceiverRole = (ActorRole?)receiver?.ActorRole,
                DocumentTypes = documentTypes,
                BusinessReasons = businessReasons.IsNullOrEmpty()
                    ? null
                    : businessReasons?.Select(x => x.ToString()).ToArray(),
            },
            Pagination = new()
            {
                Cursor = cursor switch
                {
                    null => null,
                    _ => new()
                    {
                        FieldToSortByValue = cursor.FieldToSortByValue,
                        RecordId = cursor.RecordId,
                    },
                },
                PageSize = pageSize,
                NavigationForward = forward,
                SortBy = (FieldToSortBy)field,
                DirectionToSortBy = (DirectionToSortBy?)direction,
            },
        };

        var result = await clientV3.ArchivedMessageSearchAsync("3.0", request, CancellationToken.None);
        var edges = result.Messages
            .Select(MapToArchivedMessage)
            .Select(message => MakeEdge(message, field))
            .ToList();

        return MakeConnection(result.TotalCount, edges, request.Pagination);
    }

    public async Task<Connection<ArchivedMessage>> GetArchivedMessagesByIdAsync(
        string id,
        bool includeRelated,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order)
    {
        var (field, direction) = GetSorting(order);
        var (cursor, pageSize, forward) = GetPaging(first, after, last, before);
        var request = new SearchArchivedMessagesRequestV3
        {
            SearchCriteria = new()
            {
                MessageId = id,
                IncludeRelatedMessages = includeRelated,
            },
            Pagination = new()
            {
                Cursor = cursor switch
                {
                    null => null,
                    _ => new()
                    {
                        FieldToSortByValue = cursor.FieldToSortByValue,
                        RecordId = cursor.RecordId,
                    },
                },
                PageSize = pageSize,
                NavigationForward = forward,
                SortBy = (FieldToSortBy)field,
                DirectionToSortBy = (DirectionToSortBy?)direction,
            },
        };

        var result = await clientV3.ArchivedMessageSearchAsync("3.0", request, CancellationToken.None);
        var edges = result.Messages
            .Select(MapToArchivedMessage)
            .Select(message => MakeEdge(message, field))
            .ToList();

        return MakeConnection(result.TotalCount, edges, request.Pagination);
    }

    private ArchivedMessage MapToArchivedMessage(ArchivedMessageResultV3 message) =>
        new ArchivedMessage(
            message.Id,
            message.MessageId ?? message.Id,
            message.RecordId,
            message.DocumentType.ToDocumentType(),
            message.CreatedAt,
            message.SenderNumber,
            message.SenderRole.ToString(),
            message.ReceiverNumber,
            message.ReceiverRole.ToString());

    private Connection<ArchivedMessage> MakeConnection(
        int totalCount,
        List<Edge<ArchivedMessage>> edges,
        SearchArchivedMessagesPagination pagination) =>
        MakeConnection(
            totalCount,
            edges,
            pagination.NavigationForward,
            pagination.Cursor is null,
            pagination.PageSize);
}
