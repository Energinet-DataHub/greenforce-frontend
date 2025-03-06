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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Types;

[ObjectType<ActorDto>]
public static partial class ActorPublicContactType
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorContactDto>> GetActorPublicContactByActorIdAsync(
           IReadOnlyList<Guid> keys,
           [Service] IMarketParticipantClient_V1 client,
           CancellationToken cancellationToken)
    {
        var publicContacts = await client.ActorContactsPublicAsync(cancellationToken);
        return publicContacts
            .Where(contact => keys.Contains(contact.ActorId))
            .ToDictionary(contact => contact.ActorId);
    }

    public static async Task<ActorPublicMail?> GetPublicMailAsync(
        [Parent] ActorDto actor,
        IActorPublicContactByActorIdDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var contact = await dataLoader.LoadAsync(actor.ActorId, cancellationToken);
        return contact != null ? new ActorPublicMail(contact.Email) : null;
    }

    public static Task<ActorContactDto?> GetContactAsync(
        [Parent] ActorDto actor,
        IActorPublicContactByActorIdDataLoader dataLoader) => dataLoader.LoadAsync(actor.ActorId);
}
