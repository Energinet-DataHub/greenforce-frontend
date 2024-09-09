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
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Microsoft.IdentityModel.Tokens;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    public async Task<IEnumerable<ArchivedMessageResult>> GetArchivedMessagesAsync(
        Interval created,
        string? messageId,
        string? senderNumber,
        string? receiverNumber,
        DocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        bool? includeRelatedMessages,
        [Service] IEdiB2CWebAppClient_V1 client) =>
            await client.ArchivedMessageSearchAsync("1.0", new SearchArchivedMessagesCriteria()
            {
                CreatedDuringPeriod = new MessageCreationPeriod()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
                MessageId = string.IsNullOrEmpty(messageId) ? null : messageId,
                SenderNumber = string.IsNullOrEmpty(senderNumber) ? null : messageId,
                ReceiverNumber = string.IsNullOrEmpty(receiverNumber) ? null : messageId,
                DocumentTypes = documentTypes.IsNullOrEmpty()
                    ? null
                    : documentTypes?.Select(x => x.ToString()).ToArray(),
                BusinessReasons = businessReasons.IsNullOrEmpty()
                    ? null
                    : businessReasons?.Select(x => x.ToString()).ToArray(),
                IncludeRelatedMessages = includeRelatedMessages ?? false,
            });
}
