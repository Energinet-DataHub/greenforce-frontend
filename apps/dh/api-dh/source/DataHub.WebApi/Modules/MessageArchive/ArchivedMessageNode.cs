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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Client;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using HotChocolate.Types.Pagination;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<ArchivedMessage>]
public static partial class ArchivedMessageNode
{
    [Query]
    [UsePaging]
    public static async Task<Connection<ArchivedMessage>> GetArchivedMessagesForMeteringPointAsync(
        Interval created,
        string meteringPointId,
        Guid? senderId,
        Guid? receiverId,
        MeteringPointDocumentType? documentType,
        int? first,
        string? after,
        int? last,
        string? before,
        ArchivedMessageSortInput? order,
        IMessageArchiveClient client)
    {
        return await client.GetMeteringPointArchivedMessagesAsync(
            created,
            meteringPointId,
            senderId,
            receiverId,
            documentType,
            first,
            after,
            last,
            before,
            order);
    }

    public static async Task<ActorDto?> GetSenderAsync(
        [Parent] ArchivedMessage message,
        IActorByNumberAndRoleDataLoader dataLoader) =>
        Enum.TryParse<EicFunction>(message.Sender.ActorRole.ToString(), out var role)
            ? await dataLoader.LoadAsync((message.Sender.ActorNumber, role))
            : null;

    public static async Task<ActorDto?> GetReceiverAsync(
        [Parent] ArchivedMessage message,
        IActorByNumberAndRoleDataLoader dataLoader) =>
        Enum.TryParse<EicFunction>(message.Receiver.ActorRole.ToString(), out var role)
            ? await dataLoader.LoadAsync((message.Receiver.ActorNumber, role))
            : null;

    public static string? GetDocumentUrl(
        [Parent] ArchivedMessage message,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) =>
        linkGenerator.GetUriByAction(
            httpContextAccessor.HttpContext!,
            "GetDocumentById",
            "MessageArchive",
            new { id = message.Id });

    static partial void Configure(IObjectTypeDescriptor<ArchivedMessage> descriptor)
    {
        descriptor.Name("ArchivedMessage2"); // TODO: Fix
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.DocumentType);
        descriptor.Field(f => f.CreatedAt);
    }
}
