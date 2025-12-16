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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.Charges.Abstractions.Api.SearchCriteria;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using NodaTime;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;
using Resolution = Energinet.DataHub.Charges.Abstractions.Shared.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

public class ChargesClient(
    DataHub.Charges.Client.IChargesClient client,
    IHttpContextAccessor httpContext) : IChargesClient
{
    public async Task<IEnumerable<Charge>?> GetChargesAsync(
        int skip,
        int take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        CancellationToken ct = default)
    {
        var (sortColumnName, sortDirection) =
            order switch
            {
                { Code: not null } => (ChargeInformationSortProperty.Code, order.Code.Value),
                { Type: not null } => (ChargeInformationSortProperty.Type, order.Type.Value),
                _ => (ChargeInformationSortProperty.Type, SortDirection.Desc),
            };

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(
                skip,
                take,
                new ChargeInformationFilterDto(
                    filter ?? string.Empty,
                    query?.ActorNumbers ?? [],
                    query?.ChargeTypes?.Select(c => c.Type) ?? []),
                sortColumnName,
                sortDirection == SortDirection.Desc),
            ct);

        if (result.IsFailure || result.Value == null)
        {
            return [];
        }

        return await Task.WhenAll(result.Value.Select(async c => new Charge(c.ChargeIdentifierDto, c.Resolution, c.TaxIndicator, c.Periods, await HasAnyPricesAsync(c, ct))));
    }

    public async Task<Charge?> GetChargeByIdAsync(
        ChargeIdentifierDto id,
        CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 1, new ChargeInformationFilterDto(id.Code, [id.Owner], [id.Type]), ChargeInformationSortProperty.Type, false),
            ct);

        if (result.IsFailure || result.Value == null)
        {
            return null;
        }

        var charge = result.Value.First();

        return new Charge(
                charge.ChargeIdentifierDto,
                charge.Resolution,
                charge.TaxIndicator,
                charge.Periods,
                await HasAnyPricesAsync(charge, ct));
    }

    public async Task<IEnumerable<Charge>> GetChargesByTypeAsync(
       ChargeType type,
       CancellationToken ct = default)
    {
        var user = httpContext?.HttpContext?.User;

        if (user == null)
        {
            return [];
        }

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 10_000, new ChargeInformationFilterDto(string.Empty, [user.GetMarketParticipantNumber()], [type.Type]), ChargeInformationSortProperty.Type, false),
            ct);

        if (result.IsFailure || result.Value == null)
        {
            return [];
        }

        return await Task.WhenAll(result.Value.Select(async c => new Charge(c.ChargeIdentifierDto, c.Resolution, c.TaxIndicator, c.Periods, await HasAnyPricesAsync(c, ct))));
    }

    public async Task<IEnumerable<ChargeSeries>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval period,
        CancellationToken ct = default)
    {
        try
        {
            var result = await client.GetChargeSeriesAsync(
                new ChargeSeriesSearchCriteriaDto(
                    id,
                    From: period.Start,
                    To: period.End),
                ct);

            if (result.IsFailure || result.Value == null)
            {
                return [];
            }

            var chargeSeries = result.Value;
            return chargeSeries == null || !chargeSeries.Any()
                ? []
                : chargeSeries.Select((s, i) =>
            {
                var start = AddResolution(resolution, period, i);
                var end = AddResolution(resolution, period, i + 1);
                var point = new ChargeSeriesPoint(start.ToInstant(), s.Points.First().Price);
                return new ChargeSeries(new(start.ToInstant(), end.ToInstant()), [point]);
            });
        }
        catch
        {
            return [];
        }
    }

    private async Task<bool> HasAnyPricesAsync(
        ChargeInformationDto charge,
        CancellationToken ct)
    {
        var currentPeriod = charge.GetCurrentPeriod();
        if (currentPeriod == null)
        {
            return false;
        }

        var series = await GetChargeSeriesAsync(charge.ChargeIdentifierDto, charge.Resolution, new Interval(currentPeriod.StartDate, currentPeriod.EndDate), ct);
        return series.Any();
    }

    private ZonedDateTime AddResolution(Resolution resolution, Interval period, int index)
    {
        var zone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var start = period.Start.InZone(zone);
        return resolution switch
        {
            Resolution.QuarterHourly => start.PlusMinutes(index * 15),
            Resolution.Hourly => start.PlusHours(index),
            Resolution.Daily => start.LocalDateTime.PlusDays(index).InZoneLeniently(zone),
            Resolution.Monthly => start.LocalDateTime.PlusMonths(index).InZoneLeniently(zone),
        };
    }
}
