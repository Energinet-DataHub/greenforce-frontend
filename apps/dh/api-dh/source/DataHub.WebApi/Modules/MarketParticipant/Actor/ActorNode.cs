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

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;

public static partial class ActorNode
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, ActorDto>> GetActorByIdAsync(
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
    public static async Task<IReadOnlyDictionary<string, List<ActorDto>>> GetActorByOrganizationAsync(
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
    public static async Task<IReadOnlyDictionary<(string ActorNumber, EicFunction Function), ActorDto>> GetActorByNumberAndRoleAsync(
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
    public static async Task<IReadOnlyDictionary<Guid, ActorNameWithId?>> GetActorNameByIdBatchAsync(
        IReadOnlyList<Guid> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        var result = new Dictionary<Guid, ActorNameWithId?>();
        var actors = await client.ActorGetAsync(ct).ConfigureAwait(false);
        foreach (var actor in actors.Where(x => keys.Contains(x.ActorId)))
        {
            result.Add(actor.ActorId, new ActorNameWithId(actor.ActorId, actor.Name));
        }

        return result;
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<(string ActorNumber, EicFunction EicFunction), ActorNameDto?>> GetActorNameByMarketRoleAsync(
        IReadOnlyList<(string ActorNumber, EicFunction EicFunction)> keys,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        var actorNumbers = keys.Select(x => x.ActorNumber).ToHashSet();

        var actors = await client.ActorGetAsync(ct).ConfigureAwait(false);
        var dictionary = new Dictionary<(string, EicFunction), ActorNameDto?>();

        foreach (var actor in actors.Where(x => actorNumbers.Contains(x.ActorNumber.Value)))
        {
            dictionary.TryAdd((actor.ActorNumber.Value, actor.MarketRole.EicFunction), actor.Name);
        }

        return dictionary;
    }
}
