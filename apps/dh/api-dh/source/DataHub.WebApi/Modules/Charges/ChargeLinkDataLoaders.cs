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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Api.SearchCriteria;
using Energinet.DataHub.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Charges;

public static partial class ChargeLinkDataLoaders
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<ChargeLinkPeriodId, List<ChargeLinkPeriodDto>>> GetChargeLinkPeriodHistoryByIdAsync(
        IReadOnlyList<ChargeLinkPeriodId> keys,
        IChargesClient client,
        CancellationToken ct)
    {
        var result = new Dictionary<ChargeLinkPeriodId, List<ChargeLinkPeriodDto>>();

        foreach (var group in keys.GroupBy(k => k.MeteringPointId))
        {
            var response = await client.GetChargeLinksAsync(
                new ChargeLinksSearchCriteriaDto(group.Key, IncludeHistorical: true), ct);

            if (!response.IsSuccess || response.Data is null)
                continue;

            foreach (var chargeLink in response.Data)
            {
                var periodsByFrom = chargeLink.ChargeLinkPeriods
                    .GroupBy(p => p.From)
                    .ToDictionary(g => g.Key, g => g.OrderBy(p => p.Created).ToList());

                foreach (var key in group)
                {
                    if (chargeLink.ChargeIdentifier == key.ChargeId &&
                        periodsByFrom.TryGetValue(key.From.ToInstant(), out var periods))
                    {
                        result[key] = periods;
                    }
                }
            }
        }

        return result;
    }
}
