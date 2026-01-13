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
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeSeries;
using Energinet.DataHub.Charges.Abstractions.Api.SearchCriteria;
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime;
using ChargeIdentifierDto = Energinet.DataHub.Charges.Abstractions.Shared.ChargeIdentifierDto;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;
using Resolution = Energinet.DataHub.WebApi.Modules.Common.Models.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

public class ChargesClient(
    DataHub.Charges.Client.IChargesClient client,
    IB2CClient ediClient,
    IHttpContextAccessor httpContext) : IChargesClient
{
    public async Task<IEnumerable<Charge>> GetChargesAsync(
        string? filter,
        string[]? owners,
        ChargeType[]? types,
        ChargeStatus[]? status,
        Resolution[]? resolution,
        bool? vatInclusive,
        bool? transparentInvoicing,
        bool? predictablePrice,
        bool? missingPriceSeries,
        CancellationToken ct = default)
    {
        var filterDto = new ChargeInformationFilterDto(string.Empty, owners ?? [], types?.Select(c => c.Type) ?? []);
        var result = await client.GetChargeInformationAsync(
            new(0, 10000, filterDto, ChargeInformationSortProperty.Type, true),
            ct);

        if (!result.IsSuccess)
        {
            throw new GraphQLException(result.DiagnosticMessage);
        }

        // Map and apply filters
        var data = result.Data ?? [];
        var charges = data
            .Select(MapChargeInformationDtoToCharge)
            .Where(c => owners?.Contains(c.Id.Owner) ?? true)
            .Where(c => types?.Contains(c.Type) ?? true)
            .Where(c => status?.Contains(c.Status) ?? true)
            .Where(c => resolution?.Contains(c.Resolution) ?? true)
            .Where(c => vatInclusive.GetValueOrDefault(c.VatInclusive) == c.VatInclusive)
            .Where(c => transparentInvoicing.GetValueOrDefault(c.TransparentInvoicing) == c.TransparentInvoicing)
            .Where(c => predictablePrice.GetValueOrDefault(c.PredictablePrice) == c.PredictablePrice)
            .Where(c => c.FilterText.Contains(filter ?? string.Empty, StringComparison.InvariantCultureIgnoreCase));

        // This filter is expensive since it has to fetch series for each charge,
        // which is why it is deferred until after applying all other filters.
        if (missingPriceSeries.HasValue)
        {
            // Cancelled charges does not have price series, but they are also not missing.
            // This means they can just be removed from the result before fetching series.
            return await charges
                .ToAsyncEnumerable()
                .Where(charge => charge.Status != ChargeStatus.Cancelled)
                .Select(async (charge, ct) => (charge, series: await GetChargeSeriesAsync(charge, ct)))
                .Where(result => result.series.Any() != missingPriceSeries.Value)
                .Select(c => c.charge)
                .ToListAsync(ct);
        }

        return charges;
    }

    public async Task<Charge?> GetChargeByIdAsync(ChargeIdentifierDto id, CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new(0, 1, new(id.Code, [id.Owner], [id.TypeDto]), ChargeInformationSortProperty.Type, false),
            ct);

        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data?.Select(MapChargeInformationDtoToCharge).SingleOrDefault(defaultValue: null);
    }

    public async Task<IEnumerable<Charge>> GetChargesByTypeAsync(ChargeType type, CancellationToken ct = default)
    {
        var owner = httpContext?.HttpContext?.User?.GetMarketParticipantNumber();
        ArgumentNullException.ThrowIfNull(owner);

        var result = await client.GetChargeInformationAsync(
            new(0, 10_000, new(string.Empty, [owner], [type.Type]), ChargeInformationSortProperty.Type, false),
            ct);

        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data?.Select(MapChargeInformationDtoToCharge) ?? [];
    }

    public async Task<IEnumerable<ChargeSeriesPointDto>> GetChargeSeriesAsync(
        Charge charge,
        CancellationToken ct = default)
        => await GetChargeSeriesAsync(
            charge.Id,
            charge.Resolution,
            new Interval(charge.Periods.First().StartDate, charge.Periods.First().EndDate),
            ct);

    public async Task<IEnumerable<ChargeSeriesPointDto>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval period,
        CancellationToken ct = default)
    {
        var result = await client.GetChargeSeriesAsync(new(id, period.Start, period.End), ct);
        return !result.IsSuccess
            ? throw new GraphQLException(result.DiagnosticMessage)
            : result.Data is null
            ? []
            : result.Data.Where(p => period.Contains(p.From)).OrderBy(p => p.From); // TODO: Remove `Where`
    }

    public async Task<bool> CreateChargeAsync(CreateChargeInput input, CancellationToken ct = default)
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

    public async Task<bool> UpdateChargeAsync(UpdateChargeInput input, CancellationToken ct = default)
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
                TerminationDate: terminationDate,
                ChargeOwnerId: id.Owner,
                ChargeName: charge.Name,
                ChargeDescription: charge.Description,
                Resolution: charge.Resolution.CastFromDuration<ResolutionV1>(),
                VatPayer: charge.VatInclusive ? VatPayerV1.D02 : VatPayerV1.D01,
                TransparentInvoicing: charge.TransparentInvoicing,
                TaxIndicator: charge.TaxIndicator,
                LocalPricingCategoryType: string.Empty)),
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

    private static Charge MapChargeInformationDtoToCharge(ChargeInformationDto charge)
        => new(
            Id: charge.ChargeIdentifierDto,
            Resolution: Resolution.FromName(charge.ResolutionDto.ToString()),
            TaxIndicator: charge.TaxIndicator,
            Periods: [.. charge.Periods.Where(x => x.StartDate <= x.EndDate).OrderByDescending(x => x.StartDate)]);
}
