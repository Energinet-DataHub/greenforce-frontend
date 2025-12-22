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
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using NodaTime;
using ChargeIdentifierDto = Energinet.DataHub.Charges.Abstractions.Shared.ChargeIdentifierDto;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;
using EicFunction = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.EicFunction;
using Resolution = Energinet.DataHub.WebApi.Modules.Common.Models.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

public class ChargesClient(
    DataHub.Charges.Client.IChargesClient client,
    Clients.MarketParticipant.v1.IMarketParticipantClient_V1 markpartClient,
    IB2CClient ediClient,
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

        if (!result.IsSuccess || result.Data == null)
        {
            return [];
        }

        return await Task.WhenAll(result.Data.Select(c => MapChargeInformationDtoToChargeAsync(c, ct)));
    }

    public async Task<Charge?> GetChargeByIdAsync(
        ChargeIdentifierDto id,
        CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 1, new ChargeInformationFilterDto(id.Code, [id.Owner], [id.TypeDto]), ChargeInformationSortProperty.Type, false),
            ct);

        return !result.IsSuccess || result.Data == null
            ? null
            : await MapChargeInformationDtoToChargeAsync(result.Data.First(), ct);
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

        var marketRole = user.GetMarketParticipantMarketRole();

        var ownerGln = user.GetMarketParticipantNumber() ?? string.Empty;

        // If the user is an Energy Supplier, we need to get the System Operator GLN to fetch charges they own
        if (Enum.Parse<EicFunction>(marketRole) == EicFunction.EnergySupplier)
        {
            ownerGln = (await markpartClient.ActorGetAsync(ct))
                .Single(x => x.MarketRole.EicFunction == EicFunction.SystemOperator)?.ActorNumber.Value ?? string.Empty;
        }

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 10_000, new ChargeInformationFilterDto(string.Empty, [ownerGln], [type.Type]), ChargeInformationSortProperty.Type, false),
            ct);

        if (!result.IsSuccess || result.Data == null)
        {
            return [];
        }

        return await Task.WhenAll(result.Data.Select(c => MapChargeInformationDtoToChargeAsync(c, ct)));
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

            if (!result.IsSuccess || result.Data == null)
            {
                return [];
            }

            var chargeSeries = result.Data;
            return chargeSeries == null || !chargeSeries.Any()
                ? []
                : chargeSeries.Select((s, i) =>
            {
                var start = PlusResolution(resolution, period, i);
                var end = PlusResolution(resolution, period, i + 1);
                return new ChargeSeries(new(start.ToInstant(), end.ToInstant()), s.Points);
            });
        }
        catch
        {
            return [];
        }
    }

    public async Task<bool> CreateChargeAsync(
        CreateChargeInput input,
        CancellationToken ct = default)
    {
        var result = await ediClient.SendAsync(
            new UpsertChargeInformationCommandV1(new(
                ChargeId: input.Code,
                ChargeOwnerId: httpContext.CreateUserIdentity().ActorNumber.Value,
                ChargeType: input.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeName: input.Name,
                ChargeDescription: input.Description,
                Resolution: input.Resolution.CastFromDuration<ResolutionV1>(),
                Start: input.ValidFrom,
                End: null,
                VatPayer: input.Vat ? VatPayerV1.D02 : VatPayerV1.D01,
                TransparentInvoicing: input.TransparentInvoicing,
                TaxIndicator: input.Type.IsTax,
                LocalPricingCategoryType: null)),
            ct);

        return result.IsSuccess;
    }

    public async Task<bool> UpdateChargeAsync(
        UpdateChargeInput input,
        CancellationToken ct = default)
    {
        var charge = await GetChargeByIdAsync(input.Id, ct) ?? throw new GraphQLException("Charge not found");

        var result = await ediClient.SendAsync(
            new UpsertChargeInformationCommandV1(new(
                ChargeId: input.Id.Code,
                ChargeOwnerId: input.Id.Owner,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeName: input.Name,
                ChargeDescription: input.Description,
                Resolution: charge.Resolution.CastFromDuration<ResolutionV1>(),
                Start: input.CutoffDate,
                End: null,
                VatPayer: input.Vat ? VatPayerV1.D02 : VatPayerV1.D01,
                TransparentInvoicing: input.TransparentInvoicing,
                TaxIndicator: null,
                LocalPricingCategoryType: null)),
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
            new StopChargeInformationCommandV1(new(
                ChargeId: id.Code,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeOwnerId: id.Owner,
                TerminationDate: terminationDate)),
            ct);

        return result.IsSuccess;
    }

    public async Task<bool> AddChargeSeriesAsync(
        ChargeIdentifierDto id,
        DateTimeOffset start,
        DateTimeOffset end,
        List<ChargePointV1> points,
        CancellationToken ct = default)
    {
        var charge = await GetChargeByIdAsync(id, ct) ?? throw new GraphQLException("Charge not found");

        var result = await ediClient.SendAsync(
            new UpsertChargeSeriesCommandV1(new(
                ChargeId: id.Code,
                ChargeType: charge.Type.ToRequestChangeOfPriceListChargeType(),
                ChargeOwnerId: id.Owner,
                Start: start,
                End: end,
                Points:
                [
                    new(
                        Resolution: charge.Resolution.CastFromDuration<ResolutionV1>(),
                        Start: start,
                        End: end,
                        Points: points),
                ])),
            ct);

        return result.IsSuccess;
    }

    private ZonedDateTime PlusResolution(Resolution resolution, Interval interval, int count)
    {
        var zone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];
        var start = interval.Start.InZone(zone);
        var period = resolution.ToPeriod();
        return Enumerable.Range(0, count).Aggregate(start, (acc, _) =>
            period.HasDateComponent
                ? start.LocalDateTime.Plus(period).InZoneLeniently(zone)
                : start.Plus(period.ToDuration()));
    }

    private async Task<bool> HasAnyPricesAsync(
        ChargeInformationDto charge,
        CancellationToken ct)
    {
        // TODO: Fix ChargeExtensions usage here, perhaps by adding CurrentPeriod to Charge record
        var currentPeriod = ChargeExtensions.GetCurrentPeriod(charge.Periods);
        if (currentPeriod == null)
        {
            return false;
        }

        var resolution = Resolution.FromName(charge.ResolutionDto.ToString());
        var series = await GetChargeSeriesAsync(charge.ChargeIdentifierDto, resolution, new Interval(currentPeriod.StartDate, currentPeriod.EndDate), ct);
        return series.Any();
    }

    private async Task<Charge> MapChargeInformationDtoToChargeAsync(
        ChargeInformationDto c,
        CancellationToken ct) =>
        new(
            ChargeIdentifierDto: c.ChargeIdentifierDto,
            Type: ChargeType.Make(c.ChargeIdentifierDto.TypeDto, c.TaxIndicator),
            Resolution: Resolution.FromName(c.ResolutionDto.ToString()),
            TaxIndicator: c.TaxIndicator,
            Periods: c.Periods,
            HasAnyPrices: await HasAnyPricesAsync(c, ct));
}
