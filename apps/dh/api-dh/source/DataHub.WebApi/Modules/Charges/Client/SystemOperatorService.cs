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
using Microsoft.Extensions.Caching.Memory;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

/// <summary>
/// Resolves the active SystemOperator actor number, caching the result to avoid
/// fetching the full actor list on every call.
/// </summary>
public class SystemOperatorService(
    IMarketParticipantClient_V1 marketParticipantClient,
    IMemoryCache cache) : ISystemOperatorService
{
    private const string CacheKey = "SystemOperator:ActorNumber";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

    public async Task<string> GetSystemOperatorActorNumberAsync(CancellationToken ct = default)
    {
        if (cache.TryGetValue(CacheKey, out string? actorNumber) && actorNumber is not null)
        {
            return actorNumber;
        }

        var actors = await marketParticipantClient.ActorGetAsync(ct).ConfigureAwait(false);
        var systemOperator = actors.FirstOrDefault(a => a.MarketRole.EicFunction == EicFunction.SystemOperator)
            ?? throw new InvalidOperationException("No active SystemOperator actor found.");

        cache.Set(CacheKey, systemOperator.ActorNumber.Value, CacheDuration);
        return systemOperator.ActorNumber.Value;
    }
}
