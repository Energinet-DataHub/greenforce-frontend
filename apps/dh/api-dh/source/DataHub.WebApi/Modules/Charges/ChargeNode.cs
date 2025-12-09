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
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using NodaTime;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeInformationDto>]
public static partial class ChargeNode
{
    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<ChargeInformationDto>> GetChargesAsync(
        string? filter,
        GetChargesQuery? query,
        IChargesClient client,
        IHasAnyPricesDataLoader hasAnyPricesDataLoader,
        CancellationToken ct)
    {
        var result = (await client.GetChargesAsync(0, 1000, filter, new ChargeSortInput(Common.Enums.SortDirection.Desc, null), query, ct))?.Value.Charges ?? Enumerable.Empty<ChargeInformationDto>();

        result = result.FilterOnActors(query?.ActorNumbers);
        result = result.FilterOnTypes(query?.ChargeTypes);
        result = result.FilterOnVatClassification(query?.MoreOptions);
        result = result.FilterOnTransparentInvoicing(query?.MoreOptions);
        // TODO: Apply when performance gets better result = await result.FilterOnStatusesAsync(query?.Statuses, hasAnyPricesDataLoader, ct);
        result = result.Where(charge =>
            filter is null ||
            charge.ChargeIdentifierDto.Code.Contains(filter, StringComparison.CurrentCultureIgnoreCase) ||
            charge.Periods.Any(p => p.Name.Contains(filter, StringComparison.CurrentCultureIgnoreCase)));

        return result;
    }

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<ChargeInformationDto?> GetChargeByIdAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        CancellationToken ct) =>
            await client.GetChargeByIdAsync(id, ct);

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<ChargeInformationDto>> GetChargesByTypeAsync(
        IChargesClient client,
        ChargeType type,
        CancellationToken ct) =>
            await client.GetChargesByTypeAsync(type, ct);

    public static async Task<IEnumerable<ChargeSeries>> GetSeriesAsync(
        [Parent] ChargeInformationDto charge,
        Interval interval,
        IChargesClient client,
        CancellationToken ct) =>
            await client.GetChargeSeriesAsync(charge.ChargeIdentifierDto, charge.Resolution, interval, ct);

    public static async Task<ActorDto?> GetOwnerAsync(
        [Parent] ChargeInformationDto charge,
        IMarketParticipantByIdDataLoader dataLoader,
        CancellationToken ct)
    {
        if (Guid.TryParse(charge.ChargeIdentifierDto.Owner, out var guid))
        {
            return await dataLoader.LoadAsync(guid, ct);
        }

        return null;
    }

    public static ChargeInformationPeriodDto? CurrentPeriod([Parent] ChargeInformationDto charge) =>
        charge.GetCurrentPeriod();

    public static async Task<ChargeStatus> GetStatusAsync(
        [Parent] ChargeInformationDto charge,
        IHasAnyPricesDataLoader hasAnyPricesDataLoader,
        CancellationToken ct) => await charge.GetChargeStatusAsync(hasAnyPricesDataLoader, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, bool>> HasAnyPricesAsync(
        IReadOnlyList<ChargeInformationDto> charges,
        IChargesClient client,
        CancellationToken ct)
    {
        var tasks = charges.Select(async charge =>
            {
                var currentPeriod = charge.GetCurrentPeriod();
                if (currentPeriod == null)
                {
                    return (charge, hasAnyPrices: false);
                }

                var series = await client.GetChargeSeriesAsync(
                    charge.ChargeIdentifierDto,
                    charge.Resolution,
                    new Interval(currentPeriod.StartDate, currentPeriod.EndDate),
                    ct);
                return (charge, hasAnyPrices: series.Any());
            });

        var series = await Task.WhenAll(tasks);
        return series.ToDictionary(x => x.charge.ChargeIdentifierDto.ToIdString(), x => x.hasAnyPrices);
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeInformationDto> descriptor)
    {
        descriptor.Name("Charge");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.ChargeIdentifierDto).Name("id");
        descriptor.Field(f => ChargeType.Make(f.ChargeIdentifierDto.Type, f.TaxIndicator)).Name("type");
        descriptor.Field(f => f.ChargeIdentifierDto.Code).Name("code");
        descriptor.Field(f => f.Name()).Name("name");
        descriptor.Field(f => f.DisplayName()).Name("displayName");
        descriptor.Field(f => f.Resolution);
        descriptor.Field(f => f.Periods);
    }
}
