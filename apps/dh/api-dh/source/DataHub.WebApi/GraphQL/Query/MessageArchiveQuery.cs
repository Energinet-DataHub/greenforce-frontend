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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.MessageArchive;
using HotChocolate.Types.Pagination;
using Microsoft.IdentityModel.Tokens;
using NodaTime;
using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    public async Task<Connection<ArchivedMessageResultV3>> GetArchivedMessagesAsync(
        Interval created,
        string? meteringPointId,
        Guid? senderId,
        Guid? receiverId,
        DocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        bool? includeRelated,
        string? filter,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order,
        [Service] IMarketParticipantClient_V1 markPartClient,
        [Service] Energinet.DataHub.Edi.B2CWebApp.Clients.v1.IEdiB2CWebAppClient_V1 ediClient1,
        [Service] IEdiB2CWebAppClient_V3 ediClient)
    {
        async Task<ActorDto?> GetActorAsync(Guid? id)
        {
            return id.HasValue
                ? await markPartClient.ActorGetAsync(id.Value)
                : null;
        }

        var sender = GetActorAsync(senderId);
        var receiver = GetActorAsync(receiverId);

        var searchCriteria = !string.IsNullOrWhiteSpace(filter)
            ? new SearchArchivedMessagesCriteriaV3()
            {
                MessageId = filter,
                IncludeRelatedMessages = includeRelated ?? false,
            }
            : new SearchArchivedMessagesCriteriaV3()
            {
                CreatedDuringPeriod = new MessageCreationPeriod()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
                SenderNumber = (await sender)?.ActorNumber.Value,
                SenderRole = (await sender)?.MarketRole.EicFunction.ToActorRoleV3(),
                ReceiverNumber = (await receiver)?.ActorNumber.Value,
                ReceiverRole = (await receiver)?.MarketRole.EicFunction.ToActorRoleV3(),
                DocumentTypes = documentTypes,
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

        var searchArchivedMessagesRequest = new SearchArchivedMessagesRequestV3
        {
            SearchCriteria = searchCriteria,
            Pagination = pagination,
        };

        ArchivedMessageSearchResponseV3? response = null;

        if (meteringPointId is null)
        {
            response = await ediClient.ArchivedMessageSearchAsync(
                "3.0",
                searchArchivedMessagesRequest,
                CancellationToken.None);
        }
        else
        {
            var criteria = new Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointArchivedMessageSearchCriteria()
            {
                MeteringPointId = meteringPointId,
                Pagination = new()
                {
                    PageSize = 10000,
                },
                // TODO: MeasureDataDocumentTypes = documentTypes
                Receiver = (await receiver) switch
                {
                    null => null,
                    var actor => actor.MarketRole.EicFunction.ToActorRoleV1() switch
                    {
                        null => null,
                        var role => new()
                        {
                            ActorNumber = actor.ActorNumber.Value,
                            ActorRole = role.Value,
                        },
                    },
                },
                // TODO: Dry
                Sender = (await sender) switch
                {
                    null => null,
                    var actor => actor.MarketRole.EicFunction.ToActorRoleV1() switch
                    {
                        null => null,
                        var role => new()
                        {
                            ActorNumber = actor.ActorNumber.Value,
                            ActorRole = role.Value,
                        },
                    },
                },
                CreatedDuringPeriod = new()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
            };

            var result = await ediClient1.SearchAsync(body: criteria);
            response = new ArchivedMessageSearchResponseV3()
            {
                Messages = result.Messages.Select(message => new ArchivedMessageResultV3()
                {
                    CreatedAt = message.CreatedAt,
                    DocumentType = DocumentType.Acknowledgement, // TODO: Fix
                    Id = message.Id.ToString(), // TODO: Test
                    // TODO: Fix
                    // ReceiverNumber = message.Receiver.ActorNumber,
                    // ReceiverRole = message.Receiver.ActorRole.ToEicFunction(),
                    // SenderNumber = message.Sender.ActorNumber,
                    // SenderRole = message.Sender.ActorRole.ToEicFunction(),
                }).ToList(),
                TotalCount = result.TotalCount,
            };
        }

        if (response is null)
        {
            throw new InvalidOperationException("Response is null");
        }

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

        var connection = new Connection<ArchivedMessageResultV3>(
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

    private static Edge<ArchivedMessageResultV3> MakeEdge(
        ArchivedMessageResultV3 message,
        FieldToSortBy field)
    {
        var sortCursor = field switch
        {
            FieldToSortBy.MessageId => message.MessageId ?? string.Empty,
            FieldToSortBy.DocumentType => message.DocumentType.ToString(),
            FieldToSortBy.SenderNumber => message.SenderNumber,
            FieldToSortBy.ReceiverNumber => message.ReceiverNumber,
            FieldToSortBy.CreatedAt => message.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss.fff"),
            _ => throw new ArgumentOutOfRangeException(nameof(field), field, "Unexpected FieldToSortBy value"),
        };

        return new Edge<ArchivedMessageResultV3>(message, $"{message.RecordId}+{sortCursor}");
    }
}
