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
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using HotChocolate.Types.Pagination;
using NodaTime;
using MarkPart = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeInformationDto>]
public static partial class ChargeNode
{
    [Query]
    [UseOffsetPaging]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<CollectionSegment<ChargeInformationDto>> GetChargesAsync(
        int skip,
        int? take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        IChargesClient client,
        CancellationToken ct)
    {
        var pageSize = take ?? 50;
        var pageNumber = (skip / pageSize) + 1;

        var result = await client.GetChargesAsync(pageNumber, pageSize, filter, order, query, ct);

        var totalCount = result.Value.TotalCount;
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = totalCount > pageNumber * pageSize;
        var pageInfo = new CollectionSegmentInfo(hasPreviousPage, hasNextPage);

        return new CollectionSegment<ChargeInformationDto>(
            result.Value.Charges.ToList(),
            pageInfo,
            totalCount);
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

    public static async Task<MarkPart.ActorDto?> GetOwnerAsync(
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

    public static string DisplayName([Parent] ChargeInformationDto charge)
    {
        var current = charge.GetCurrentPeriod();
        return $"{charge.ChargeIdentifierDto.Code} - {current?.Name}";
    }

    public static ChargeInformationPeriodDto? CurrentPeriod([Parent] ChargeInformationDto charge) =>
        charge.GetCurrentPeriod();

    public static async Task<ChargeStatus> GetStatusAsync(
        [Parent] ChargeInformationDto charge,
        IHasAnyPricesDataLoader hasAnyPricesDataLoader,
        CancellationToken ct)
    {
        var hasAnyPrices = await hasAnyPricesDataLoader.LoadAsync(charge, ct);
        var currentPeriod = charge.GetCurrentPeriod();

        if (currentPeriod == null)
        {
            return ChargeStatus.Invalid;
        }

        var validFrom = currentPeriod.StartDate.ToDateTimeOffset();
        var validTo = currentPeriod.EndDate?.ToDateTimeOffset();
        return hasAnyPrices switch
        {
            _ when validFrom == validTo => ChargeStatus.Cancelled,
            _ when validTo < DateTimeOffset.Now => ChargeStatus.Closed,
            false when validFrom > DateTimeOffset.Now => ChargeStatus.Awaiting,
            false when validFrom < DateTimeOffset.Now => ChargeStatus.MissingPriceSeries,
            true when validFrom < DateTimeOffset.Now => ChargeStatus.Current,
            _ => ChargeStatus.Invalid,
        };
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<ChargeInformationDto, bool>> HasAnyPricesAsync(
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
        return series.ToDictionary(x => x.charge, x => x.hasAnyPrices);
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeInformationDto> descriptor)
    {
        descriptor.Name("Charge");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.ChargeIdentifierDto).Name("id");
        descriptor.Field(f => f.ChargeIdentifierDto.ChargeType).Name("type");
        descriptor.Field(f => f.ChargeIdentifierDto.Code).Name("code");
        descriptor.Field(f => f.Resolution);
        descriptor.Field(f => f.Periods);
    }
}
