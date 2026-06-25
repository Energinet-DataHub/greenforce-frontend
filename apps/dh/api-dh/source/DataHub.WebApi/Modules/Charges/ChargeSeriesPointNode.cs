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

using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Charges.Types;

[ObjectType<ChargeSeriesPoint>]
public static partial class ChargeSeriesPointNode
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<ChargeSeriesPointId, List<ChargeSeriesPointChange>>>
        GetChargeSeriesPointChangesAsync(
            IReadOnlyList<ChargeSeriesPointId> keys,
            IChargesClient client,
            CancellationToken ct)
            => await keys
                .Select(k => k.ChargeId)
                .Distinct()
                .ToAsyncEnumerable()
                .SelectMany(async (chargeId, ct) => await client.GetHistoricalChargeSeriesAsync(chargeId, ct))
                .GroupBy(s => s.ChargeSeriesPointId)
                .Select(g => KeyValuePair.Create(g.Key, g.ToList()))
                .ToDictionaryAsync(cancellationToken: ct);

    public static async Task<bool> GetHasChangedAsync(
        [Parent] ChargeSeriesPoint parent,
        ChargeSeriesPointChangesDataLoader dataLoader)
        => await dataLoader
            .LoadAsync(parent.Id)
            .Then(history => history?.Any(change => !change.IsCurrent) ?? false);

    public static async Task<IEnumerable<ChargeSeriesPointChange>> GetHistoryAsync(
        [Parent] ChargeSeriesPoint parent,
        ChargeSeriesPointChangesDataLoader dataLoader)
        => await dataLoader
            .LoadAsync(parent.Id)
            .Then(history => history ?? []);

    static partial void Configure(IObjectTypeDescriptor<ChargeSeriesPoint> descriptor)
    {
        descriptor.Name("ChargeSeriesPoint");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Price);
        descriptor.Field(f => f.Interval);
    }
}
