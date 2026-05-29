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

using System.Collections.Concurrent;
using Energinet.DataHub.ElectricityMarket.Abstractions.Processes.BRS_011.IncorrectMoveIn.V1;
using Energinet.DataHub.ElectricityMarket.Client;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

/// <summary>
/// Request-scoped (per-request) cache around the Electricity Market
/// <see cref="GetMoveInsByEnergySupplierIdQueryV1"/> lookup. The Task itself
/// is memoized so concurrent callers awaiting the same key share a single
/// in-flight HTTP call.
/// </summary>
public sealed class IncorrectMoveInEligibilityService(
    IElectricityMarketClient electricityMarketClient) : IIncorrectMoveInEligibilityService
{
    private const int LookbackDays = 60;

    private readonly IElectricityMarketClient _electricityMarketClient = electricityMarketClient;
    private readonly ConcurrentDictionary<(string MeteringPointId, string EnergySupplierId), Task<bool>> _cache = new();

    public Task<bool> IsEligibleAsync(
        string meteringPointId,
        string energySupplierId,
        CancellationToken cancellationToken) =>
        _cache.GetOrAdd(
            (meteringPointId, energySupplierId),
            key => QueryEligibilityAsync(key.MeteringPointId, key.EnergySupplierId, cancellationToken));

    private async Task<bool> QueryEligibilityAsync(
        string meteringPointId,
        string energySupplierId,
        CancellationToken cancellationToken)
    {
        var query = new GetMoveInsByEnergySupplierIdQueryV1(
            MeteringPointId: meteringPointId,
            EnergySupplierId: energySupplierId,
            From: DateTimeOffset.UtcNow.AddDays(-LookbackDays));

        var result = await _electricityMarketClient.SendAsync(query, cancellationToken).ConfigureAwait(false);

        if (!result.IsSuccess || result.Data is null)
        {
            return false;
        }

        // EM does not yet expose a per-process key; presence-of-any-move-in is the only correct match today.
        return result.Data.MoveIns.Any();
    }
}
