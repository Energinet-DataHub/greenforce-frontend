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

using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;
using MeteringPointDocumentType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointDocumentType;
using SearchDocumentType = Energinet.DataHub.Edi.B2CWebApp.Clients.v3.DocumentType;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

/// <summary>
/// Client for getting archived messages.
/// </summary>
public interface IMessageArchiveClient
{
    /// <summary>
    /// Gets archived messages.
    /// </summary>
    Task<Connection<ArchivedMessage>> GetArchivedMessagesAsync(
        Interval created,
        Guid? senderId,
        Guid? receiverId,
        SearchDocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order);

    /// <summary>
    /// Gets archived messages (and optionally related messages) by id.
    /// </summary>
    Task<Connection<ArchivedMessage>> GetArchivedMessagesByIdAsync(
        string id,
        bool includeRelated,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order);

    /// <summary>
    /// Gets archived messages for a metering point.
    /// </summary>
    Task<Connection<ArchivedMessage>> GetMeteringPointArchivedMessagesAsync(
        Interval created,
        string meteringPointId,
        Guid? senderId,
        Guid? receiverId,
        MeteringPointDocumentType? documentType,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order);
}
