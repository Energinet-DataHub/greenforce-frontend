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

using Energinet.DataHub.Charges.Abstractions.Api.V1.HistoricalChargeLinks;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record ChargeLinkPeriodChange(
    ChargeLinkPeriodChangeType ChangeType,
    HistoricalChargeLinkPeriodDto CurrentPeriod,
    HistoricalChargeLinkPeriodDto? PreviousPeriod)
{
    public HistoricalChargeLinkPeriodDto Period => CurrentPeriod;

    public DateTimeOffset EffectiveDate
        => CurrentPeriod.To is not null && ChangeType == ChargeLinkPeriodChangeType.Stopped
            ? CurrentPeriod.To.Value.ToDateTimeOffset()
            : CurrentPeriod.From.ToDateTimeOffset();

    public static IEnumerable<ChargeLinkPeriodChange> FromPeriods(IEnumerable<HistoricalChargeLinkPeriodDto> periods)
    {
        var sorted = periods.OrderBy(p => p.Created);
        var first = sorted
            .Take(1)
            .Select(p => new ChargeLinkPeriodChange(ChargeLinkPeriodChangeType.Started, p, null));

        return [.. first, .. sorted.Zip(sorted.Skip(1), DeriveChange)];
    }

    private static ChargeLinkPeriodChange DeriveChange(
        HistoricalChargeLinkPeriodDto previous,
        HistoricalChargeLinkPeriodDto current)
        => current.From == current.To
            ? new(ChargeLinkPeriodChangeType.Cancelled, current, previous)
            : current.To is not null && (previous.To is null || current.To < previous.To)
            ? new(ChargeLinkPeriodChangeType.Stopped, current, previous)
            : new(ChargeLinkPeriodChangeType.Edited, current, previous);
}
