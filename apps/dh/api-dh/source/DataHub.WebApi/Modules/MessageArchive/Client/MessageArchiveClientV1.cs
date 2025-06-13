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
using Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

public partial class MessageArchiveClient
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
        var (sender, receiver) = await Common.Extensions.TaskExtensions
            .WhenAll(GetActorByIdAsync(senderId), GetActorByIdAsync(receiverId));

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
            Sender = sender,
            Receiver = receiver,
            CreatedDuringPeriod = new()
            {
                Start = created.Start.ToDateTimeOffset(),
                End = created.End.ToDateTimeOffset(),
            },
        };

        var result = await clientV1.SearchAsync(body: criteria);
        var edges = result.Messages
            .Select(message => new ArchivedMessage(
                message.Id.ToString(),
                message.Id.ToString(),
                message.CursorValue,
                message.DocumentType.ToDocumentType(),
                message.CreatedAt,
                message.Sender.ActorNumber,
                message.Sender.ActorRole.ToString(),
                message.Receiver.ActorNumber,
                message.Receiver.ActorRole.ToString()))
            .Select(message => MakeEdge(message, field))
            .ToList();

        return MakeConnection(
            result.TotalCount,
            edges,
            criteria.Pagination.NavigationForward,
            criteria.Pagination.Cursor is null,
            criteria.Pagination.PageSize);
    }
}
