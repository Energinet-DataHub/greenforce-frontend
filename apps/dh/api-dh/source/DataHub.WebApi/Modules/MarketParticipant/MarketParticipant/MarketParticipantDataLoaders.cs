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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant;

public static partial class MarketParticipantDataLoaders
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorConsolidationDto>> GetConsolidationByMarketParticipantFromIdAsync(
        IReadOnlyList<Guid> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken cancellationToken)
    {
        var consolidations = (await client.ActorConsolidationsAsync(cancellationToken)).ActorConsolidations;

        return consolidations
            .Select(c => new KeyValuePair<Guid, ActorConsolidationDto>(c.ActorFromId, c))
            .DistinctBy(c => c.Key)
            .ToDictionary();
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, AuditIdentityDto>> GetAuditIdentitiesByUserIdAsync(
        IReadOnlyList<Guid> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken cancellationToken)
    {
        var auditIdentities = await client.AuditIdentityPostAsync(keys, cancellationToken).ConfigureAwait(false);

        return auditIdentities
            .Where(x => keys.Contains(x.AuditIdentityId))
            .ToDictionary(x => x.AuditIdentityId, y => y);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorContactDto>> GetMarketParticipantPublicContactByActorIdAsync(
        IReadOnlyList<Guid> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken cancellationToken)
    {
        var publicContacts = await client.ActorContactsPublicAsync(cancellationToken);
        return publicContacts
            .Where(contact => keys.Contains(contact.ActorId))
            .ToDictionary(contact => contact.ActorId);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorDto>> GetMarketParticipantByIdAsync(
            IReadOnlyList<Guid> keys,
            [Service] IMarketParticipantClient_V1 client,
            CancellationToken ct)
    {
        return (await client
            .ActorGetAsync(ct).ConfigureAwait(false))
            .Where(x => keys.Contains(x.ActorId))
            .ToDictionary(x => x.ActorId);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, List<ActorDto>>> GetMarketParticipantByOrganizationAsync(
        IReadOnlyList<string> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        return (await client
            .ActorGetAsync(ct).ConfigureAwait(false))
            .Where(x => keys.Contains(x.OrganizationId.ToString()))
            .GroupBy(x => x.OrganizationId)
            .ToDictionary(x => x.Key.ToString(), y => y.ToList());
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<(string ActorNumber, EicFunction Function), ActorDto>> GetMarketParticipantByNumberAndRoleAsync(
        IReadOnlyList<(string ActorNumber, EicFunction Function)> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        return (await client
            .ActorGetAsync(ct).ConfigureAwait(false))
            .Where(x => keys.Contains((x.ActorNumber.Value, x.MarketRole.EicFunction)))
            .ToDictionary(x => (x.ActorNumber.Value, x.MarketRole.EicFunction));
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, MarketParticipantNameWithId?>> GetMarketParticipantNameByIdBatchAsync(
        IReadOnlyList<Guid> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        var result = new Dictionary<Guid, MarketParticipantNameWithId?>();
        var marketParticipants = await client.ActorGetAsync(ct).ConfigureAwait(false);
        foreach (var marketParticipant in marketParticipants.Where(x => keys.Contains(x.ActorId)))
        {
            result.Add(marketParticipant.ActorId, new MarketParticipantNameWithId(marketParticipant.ActorId, marketParticipant.Name));
        }

        return result;
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<(string ActorNumber, EicFunction EicFunction), ActorNameDto?>> GetMarketParticipantNameByMarketRoleAsync(
        IReadOnlyList<(string ActorNumber, EicFunction EicFunction)> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        var marketParticipantNumbers = keys.Select(x => x.ActorNumber).ToHashSet();

        var marketParticipants = await client.ActorGetAsync(ct).ConfigureAwait(false);
        var dictionary = new Dictionary<(string, EicFunction), ActorNameDto?>();

        foreach (var marketParticipant in marketParticipants.Where(x => marketParticipantNumbers.Contains(x.ActorNumber.Value)))
        {
            dictionary.TryAdd((marketParticipant.ActorNumber.Value, marketParticipant.MarketRole.EicFunction), marketParticipant.Name);
        }

        return dictionary;
    }
}
