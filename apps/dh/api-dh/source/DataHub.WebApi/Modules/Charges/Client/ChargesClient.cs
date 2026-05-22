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
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeSeries;
using Energinet.DataHub.Charges.Abstractions.Api.V1.HistoricalChargeLinks;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeBillingMasterData.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeBillingMasterData.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Models;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using NodaTime;
using NodaTime.Extensions;
using ChargeIdentifierDto = Energinet.DataHub.Charges.Abstractions.Shared.ChargeIdentifierDto;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;
using Resolution = Energinet.DataHub.WebApi.Modules.Common.Models.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

public class ChargesClient(
    DataHub.Charges.Client.IChargesClient client,
    IB2CClient ediClient,
    IHttpContextAccessor httpContext,
    IMarketParticipantClient_V1 marketParticipantClient) : IChargesClient
{
    public async Task<IEnumerable<ChargeOverviewItem>> GetChargeOverviewAsync(
        string? filter,
        ChargeOverviewQuery? query,
        CancellationToken ct = default)
    {
        var filterTypes = query?.Types?.Select(c => c.Type) ?? [];
        var filterOwners = query?.Owners ?? [];
        var result = await client.GetChargeInformationAsync(
            new(0, 10000, new(string.Empty, filterOwners, filterTypes), ChargeInformationSortProperty.Type, true),
            ct);

        if (!result.IsSuccess)
        {
            throw new GraphQLException(result.DiagnosticMessage);
        }

        // Map to charges and apply charge-level filters
        var data = result.Data ?? [];
        var charges = data
            .Where(c => c.Periods.Count > 0)
            .Select(MapChargeInformationDtoToCharge)
            .Where(c => query?.Owners?.Contains(c.Id.Owner) ?? true)
            .Where(c => query?.Types?.Contains(c.Type) ?? true)
            .Where(c => query?.Resolution?.Contains(c.Resolution) ?? true)
            .Where(c => query?.SpotDependingPrice.GetValueOrDefault(c.SpotDependingPrice) == c.SpotDependingPrice)
            .Where(c => c.FilterText.Contains(filter ?? string.Empty, StringComparison.InvariantCultureIgnoreCase));

        // Flatten charge x period and apply period-level filters
        var activePeriod = new Interval(query?.ActivePeriodStart?.ToInstant(), query?.ActivePeriodEnd?.ToInstant());
        var items = charges.SelectMany(charge => charge.Periods
            .Where(p => query?.VatInclusive.GetValueOrDefault(p.VatInclusive) == p.VatInclusive)
            .Where(p => query?.TransparentInvoicing.GetValueOrDefault(p.TransparentInvoicing) == p.TransparentInvoicing)
            .Where(p => p.Period.Overlaps(activePeriod))
            .Select(p => new ChargeOverviewItem(charge, p)));

        // This filter is expensive since it has to fetch series for each charge,
        // which is why it is deferred until after applying all other filters.
        if (query?.MissingPriceSeries == true)
        {
            var chargesWithSeries = await items
                .Select(x => x.Charge)
                .Distinct()
                .ToAsyncEnumerable()
                .Where(charge => charge.Status != ChargeStatus.Cancelled)
                .Select(async (charge, ct) => (charge, series: await GetChargeSeriesAsync(charge, ct)))
                .Where(r => r.series.Any() != query?.MissingPriceSeries)
                .Select(r => r.charge)
                .ToListAsync(ct);

            return items.Where(x => chargesWithSeries.Contains(x.Charge));
        }

        return items;
    }

    public async Task<IEnumerable<Charge>> GetChargesAsync(CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new(0, 10000, new(string.Empty, [], []), ChargeInformationSortProperty.Type, false),
            ct);

        var charges = result.Data ?? [];
        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : charges
                .Where(c => c.Periods.Count > 0) // Only include charges with at least one period
                .Select(MapChargeInformationDtoToCharge);
    }

    public async Task<Charge?> GetChargeByIdAsync(ChargeIdentifierDto id, CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new(0, 10000, new(id.Code, [id.Owner], [id.TypeDto]), ChargeInformationSortProperty.Type, false),
            ct);

        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data?
                .Where(c => c.Periods.Count > 0) // Only include charges with at least one period
                .Select(MapChargeInformationDtoToCharge)
                .FirstOrDefault(c => c.Code == id.Code);
    }

    public async Task<IEnumerable<Charge>> GetChargesByTypeAsync(ChargeType type, CancellationToken ct = default)
    {
        var owner = httpContext?.HttpContext?.User?.GetMarketParticipantNumber();
        ArgumentNullException.ThrowIfNull(owner);

        var marketRole = Enum.Parse<EicFunction>(
            httpContext?.HttpContext?.User?.GetMarketParticipantMarketRole()
                ?? throw new InvalidOperationException("No market role claim"));

        var owners = marketRole != EicFunction.EnergySupplier
            ? [owner]
            : (await marketParticipantClient.ActorGetAsync(ct))
                .Where(a => a.Status == "Active" && a.MarketRole?.EicFunction == EicFunction.SystemOperator)
                .Select(a => a.ActorNumber.Value);

        var result = await client.GetChargeInformationAsync(
            new(0, 10_000, new(string.Empty, owners, [type.Type]), ChargeInformationSortProperty.Type, false),
            ct);

        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data?
                .Where(c => c.Periods?.Count > 0)
                .Where(c => c.TaxIndicator == type.IsTax)
                .Select(MapChargeInformationDtoToCharge) ?? [];
    }

    public async Task<IEnumerable<ChargeSeriesPointDto>> GetChargeSeriesAsync(
        Charge charge,
        CancellationToken ct = default)
        => await GetChargeSeriesAsync(charge.Id, charge.Resolution, charge.LatestPeriod.Period, ct);

    public async Task<MissingPriceSeriesResult> GetMissingPriceSeriesPointsAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval interval,
        CancellationToken ct = default)
    {
        var series = await GetChargeSeriesAsync(id, resolution, interval, ct);
        var points = series.Select(p => p.From).ToHashSet();
        if (points.Count == 0) return new MissingPriceSeriesResult([], null);

        var firstPoint = points.Min();
        var lastPoint = points.Max();
        var gapHorizon = Instant.Min(lastPoint, DateTimeOffset.UtcNow.AddYears(2).ToInstant());

        var gaps = GenerateExpectedSlots(firstPoint, gapHorizon, resolution)
            .Where(slot => !points.Contains(slot))
            .GroupBy(slot => CollapseKey(slot.InZone(DanishTimeZone), resolution))
            .Select(g => g.Key.AtStartOfDayInZone(DanishTimeZone).ToDateTimeOffset());

        return new MissingPriceSeriesResult(gaps, lastPoint.ToDateTimeOffset());
    }

    public async Task<IEnumerable<ChargeSeriesPointDto>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval period,
        CancellationToken ct = default)
    {
        var end = period.HasEnd ? period.End : Instant.MaxValue;
        var result = await client.GetChargeSeriesAsync(new(id, period.Start, end), ct);
        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data is null
            ? []
            : result.Data.Where(p => period.Contains(p.From)).OrderBy(p => p.From); // TODO: Remove `Where`
    }

    public async Task<bool> CreateChargeAsync(
        string code,
        string name,
        string description,
        ChargeType type,
        Resolution resolution,
        DateTimeOffset validFrom,
        bool vat,
        bool? transparentInvoicing,
        bool? spotDependingPrice,
        CancellationToken ct = default)
    {
        var result = await ediClient.SendAsync(
            new UpsertChargeInformationCommandV2(new(
                ChargeId: code,
                ChargeOwnerId: httpContext.CreateUserIdentity().ActorNumber.Value,
                ChargeType: type.ToRequestChangeOfPriceListChargeType(),
                ChargeName: name,
                ChargeDescription: description,
                Resolution: resolution.CastDurationTo<ResolutionV2>(),
                Start: validFrom,
                End: null,
                VatPayer: vat ? VatPayerV2.D02 : VatPayerV2.D01,
                TransparentInvoicing: transparentInvoicing,
                TaxIndicator: type.IsTax,
                PricingCategory: MapToPricingCategoryV2(spotDependingPrice))),
            ct);

        return result.IsSuccess;
    }

    public async Task<bool> UpdateChargeAsync(
        ChargeIdentifierDto id,
        string name,
        string description,
        DateTimeOffset cutoffDate,
        bool vat,
        bool transparentInvoicing,
        CancellationToken ct = default)
    {
        var charge = await GetChargeByIdAsync(id, ct) ?? throw new GraphQLException("Charge not found");
        var result = await ediClient.SendAsync(
            new UpsertChargeInformationCommandV2(new(
                ChargeId: id.Code,
                ChargeOwnerId: id.Owner,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeName: name,
                ChargeDescription: description,
                Resolution: charge.Resolution.CastDurationTo<ResolutionV2>(),
                Start: cutoffDate,
                End: null,
                VatPayer: vat ? VatPayerV2.D02 : VatPayerV2.D01,
                TransparentInvoicing: transparentInvoicing,
                TaxIndicator: null,
                PricingCategory: MapToPricingCategoryV2(charge.SpotDependingPrice))),
            ct);

        return result.IsSuccess;
    }

    public async Task<bool> StopChargeAsync(
        ChargeIdentifierDto id,
        DateTimeOffset terminationDate,
        CancellationToken ct = default)
    {
        var charge = await GetChargeByIdAsync(id, ct) ?? throw new GraphQLException("Charge not found");
        var result = await ediClient.SendAsync(
            new StopChargeInformationCommandV2(new(
                ChargeId: id.Code,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                TerminationDate: terminationDate,
                ChargeOwnerId: id.Owner,
                ChargeName: charge.Name,
                ChargeDescription: charge.Description,
                Resolution: charge.Resolution.CastDurationTo<ResolutionV2>(),
                VatPayer: charge.VatInclusive ? VatPayerV2.D02 : VatPayerV2.D01,
                TransparentInvoicing: charge.TransparentInvoicing,
                TaxIndicator: charge.TaxIndicator,
                PricingCategory: MapToPricingCategoryV2(charge.SpotDependingPrice))),
            ct);

        return result.IsSuccess;
    }

    public async Task<bool> AddChargeSeriesAsync(
        ChargeIdentifierDto id,
        DateTimeOffset start,
        DateTimeOffset end,
        List<ChargePointV2> points,
        CancellationToken ct = default)
    {
        var charge = await GetChargeByIdAsync(id, ct) ?? throw new GraphQLException("Charge not found");
        var result = await ediClient.SendAsync(
            new UpsertChargeSeriesCommandV2(new(
                ChargeId: id.Code,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeOwnerId: id.Owner,
                Start: start,
                End: end,
                Points:
                [
                    new(
                        Resolution: charge.Resolution.CastDurationTo<ResolutionV2>(),
                        Start: start,
                        End: end,
                        Points: points),
                ])),
            ct);

        return result.IsSuccess;
    }

    public async Task<IEnumerable<ChargeLinkPeriod>> GetChargeLinkPeriodsAsync(
        string meteringPointId,
        CancellationToken ct = default)
    {
        var result = await client.GetChargeLinksAsync(new(meteringPointId), ct);
        if (!result.IsSuccess) throw new GraphQLException(result.DiagnosticMessage);
        var chargeLinks = result.Data ?? [];
        return chargeLinks
            .SelectMany(cl => cl.ChargeLinkPeriods
                .DistinctBy(p => p.From) // From *should* be unique, but some garbage data exists
                .Select(p => new ChargeLinkPeriod(meteringPointId, p, cl.ChargeIdentifier)));
    }

    public async Task<IEnumerable<HistoricalChargeLinkPeriodDto>> GetHistoricalChargeLinkPeriodsByIdAsync(
        ChargeLinkPeriodId id,
        CancellationToken ct = default)
    {
        var result = await client.QueryAsync(
            new GetHistoricalChargeLinksQueryV1(Guid.Empty, new(id.MeteringPointId, id.ChargeId)), ct);

        return result.Periods.Where(p => p.From == id.From.ToInstant());
    }

    public async Task<ChargeLinkPeriod?> GetChargeLinkPeriodByIdAsync(
        ChargeLinkPeriodId id,
        CancellationToken ct = default)
    {
        var items = await GetChargeLinkPeriodsAsync(id.MeteringPointId, ct);
        return items.FirstOrDefault(p =>
            new ChargeLinkPeriodId(p.MeteringPointId, p.ChargeId, p.Period.From.ToDateTimeOffset()) == id);
    }

    public async Task<ChargeLinkPeriod> CreateChargeLinkAsync(
        ChargeIdentifierDto chargeId,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default)
    {
        var result = await ediClient.SendAsync(
            new UpsertChargeLinkCommandV1(new(
                chargeId.Code,
                chargeId.Owner,
                ToChargeLinkChargeType(chargeId.TypeDto),
                meteringPointId,
                newStartDate,
                factor.ToString())),
            ct);

        return result.IsSuccess
            ? new(meteringPointId, new(factor, newStartDate.ToInstant(), null), chargeId)
            : throw new GraphQLException("Failed to create charge link");
    }

    public async Task<IEnumerable<ChargeLinkPeriod>> EditChargeLinkAsync(
        ChargeLinkPeriodId id,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default)
    {
        var chargeLink = await GetChargeLinkPeriodByIdAsync(id, ct)
            ?? throw new GraphQLException("Charge link not found");

        var result = await ediClient.SendAsync(
            new UpsertChargeLinkCommandV1(new(
                id.ChargeId.Code,
                id.ChargeId.Owner,
                ToChargeLinkChargeType(id.ChargeId.TypeDto),
                id.MeteringPointId,
                newStartDate,
                factor.ToString())),
            ct);

        if (!result.IsSuccess)
            throw new GraphQLException("Failed to stop charge link");

        var start = newStartDate.ToInstant();

        if (start == chargeLink.Period.From)
        {
            return [new ChargeLinkPeriod(id.MeteringPointId, chargeLink.Period with { Factor = factor }, id.ChargeId)];
        }

        var updated = new ChargeLinkPeriod(id.MeteringPointId, chargeLink.Period with { To = start }, id.ChargeId);
        var created = new ChargeLinkPeriod(id.MeteringPointId, new(factor, start, chargeLink.Period.To), id.ChargeId);
        return [updated, created];
    }

    public async Task<ChargeLinkPeriod> StopChargeLinkAsync(
        ChargeLinkPeriodId id,
        DateTimeOffset stopDate,
        CancellationToken ct = default)
    {
        var chargeLink = await GetChargeLinkPeriodByIdAsync(id, ct)
            ?? throw new GraphQLException("Charge link not found");

        var result = await ediClient.SendAsync(
            new StopChargeLinkCommandV1(new(
                id.ChargeId.Code,
                id.ChargeId.Owner,
                ToChargeLinkChargeType(id.ChargeId.TypeDto),
                id.MeteringPointId,
                stopDate,
                chargeLink.Period.Factor.ToString())),
            ct);

        return result.IsSuccess
            ? new(id.MeteringPointId, chargeLink.Period with { To = stopDate.ToInstant() }, id.ChargeId)
            : throw new GraphQLException("Failed to stop charge link");
    }

    public async Task<ChargeLinkPeriod> CancelChargeLinkAsync(ChargeLinkPeriodId id, CancellationToken ct = default)
    {
        var chargeLink = await GetChargeLinkPeriodByIdAsync(id, ct)
            ?? throw new GraphQLException("Charge link not found");

        var result = await ediClient.SendAsync(
            new StopChargeLinkCommandV1(new(
                id.ChargeId.Code,
                id.ChargeId.Owner,
                ToChargeLinkChargeType(id.ChargeId.TypeDto),
                id.MeteringPointId,
                id.From,
                chargeLink.Period.Factor.ToString())),
            ct);

        return result.IsSuccess
            ? new(id.MeteringPointId, chargeLink.Period with { To = id.From.ToInstant() }, id.ChargeId)
            : throw new GraphQLException("Failed to cancel charge link");
    }

    private static ChargeTypeV1 ToChargeLinkChargeType(ChargeTypeDto type) => type switch
    {
        ChargeTypeDto.Tariff => ChargeTypeV1.Tariff,
        ChargeTypeDto.Subscription => ChargeTypeV1.Subscription,
        ChargeTypeDto.Fee => ChargeTypeV1.Fee,
    };

    private static DateTimeZone DanishTimeZone => LocalDateExtensions.DanishTimeZone;

    internal static IEnumerable<Instant> GenerateExpectedSlots(Instant from, Instant to, Resolution resolution)
    {
        var current = from;
        while (current < to)
        {
            yield return current;
            current = NextSlot(current, resolution);
        }
    }

    internal static Instant NextSlot(Instant instant, Resolution resolution)
    {
        if (resolution == Resolution.QuarterHourly) return instant.Plus(Duration.FromMinutes(15));
        if (resolution == Resolution.Hourly) return instant.Plus(Duration.FromHours(1));
        var dateTime = instant.InZone(DanishTimeZone).LocalDateTime;
        var next = resolution == Resolution.Daily ? dateTime.PlusDays(1) : dateTime.PlusMonths(1);
        return next.InZoneLeniently(DanishTimeZone).ToInstant();
    }

    internal static LocalDate CollapseKey(ZonedDateTime zdt, Resolution resolution)
    {
        if (resolution == Resolution.Monthly) return new LocalDate(zdt.Year, 1, 1);
        if (resolution == Resolution.Daily) return new LocalDate(zdt.Year, zdt.Month, 1);
        return zdt.Date;
    }

    private Charge MapChargeInformationDtoToCharge(ChargeInformationDto charge)
        => new(
            Id: charge.ChargeIdentifierDto,
            Resolution: Resolution.FromName(charge.ResolutionDto),
            TaxIndicator: charge.TaxIndicator,
            SpotDependingPrice: charge.PricingCategoryDto == PricingCategoryDto.SpotDependingPrice,
            TypeDisplayName: ChargeTypeTranslator.Translate(
                ChargeType.Make(charge.ChargeIdentifierDto.TypeDto, charge.TaxIndicator),
                httpContext),
            PeriodDtos: [.. charge.Periods
                .Where(x => x.StartDate <= x.EndDate)
                .OrderByDescending(x => x.StartDate)
                .ThenByDescending(x => x.EndDate)]);

    private static PricingCategoryV2 MapToPricingCategoryV2(bool? spotDependingPrice)
        => spotDependingPrice.GetValueOrDefault(false)
            ? PricingCategoryV2.D01
            : PricingCategoryV2.D02;
}
