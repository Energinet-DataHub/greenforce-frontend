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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;

namespace Energinet.DataHub.WebApi.Modules.Esett;

public static partial class EsettOperations
{
    [Mutation]
    public static async Task<bool> ResendWaitingEsettExchangeMessagesAsync([Service] IESettExchangeClient_V1 client)
    {
        await client.ResendMessagesWithoutResponseAsync();
        return true;
    }

    [Mutation]
    public static async Task<bool> ManuallyHandleOutgoingMessageAsync([Service] IESettExchangeClient_V1 client, string documentId, string comment)
    {
        await client.HandleManuallyAsync(documentId, new Comment
        {
            Value = comment,
        });
        return true;
    }
}
