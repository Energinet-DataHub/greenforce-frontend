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
using Energinet.DataHub.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using HotChocolate.Types.Pagination;
using NodaTime;
using MarkPart = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeInformationDto>]
public static partial class ChargesNode
{
    public static ChargeStatus Status([Parent] ChargeInformationDto charge) => charge.GetStatus();

    public static string DisplayName([Parent] ChargeInformationDto charge) => $"{charge.Code} • {charge.Name}";

    public static async Task<MarkPart.ActorDto?> GetOwnerAsync(
        [Parent] ChargeInformationDto charge,
        IMarketParticipantByIdDataLoader dataLoader,
        CancellationToken ct) =>
        await dataLoader.LoadAsync(new Guid(charge.Owner), ct).ConfigureAwait(false);

    public static async Task<IEnumerable<ChargeSeriesDto>> GetSeriesAsync(
        [Parent] ChargeInformationDto charge,
        Interval interval,
        [Service] IChargesClient client,
        CancellationToken cancellationToken)
    {
        var series = await client.GetChargeSeriesAsync(
            new ChargeSeriesSearchCriteriaDto(
                ChargeId: Guid.Empty, // TODO: Fix
                FromDateTimeUtc: interval.Start.ToDateTimeOffset(),
                ToDateTimeUtc: interval.End.ToDateTimeOffset()),
            cancellationToken);

        return series.Value ?? [];
    }

    [Query]
    [UseOffsetPaging]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<CollectionSegment<ChargeInformationDto>> GetChargesAsync(
        int skip,
        int take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        [Service] IChargesClient client,
        CancellationToken cancellationToken)
    {
        var (sortColumnName, sortDirection) =
            order switch
            {
                { FromDateTime: not null } => (ChargeSeriesSortColumnName.FromDateTime, order.FromDateTime.Value),
                { Price: not null } => (ChargeSeriesSortColumnName.Price, order.Price.Value),
                _ => (ChargeSeriesSortColumnName.FromDateTime, SortDirection.Desc),
            };

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(
                filter ?? string.Empty,
                query?.ActorNumbers?.ToList() ?? [],
                query?.ChargeTypes?.ToList() ?? [],
                sortDirection == SortDirection.Desc,
                sortColumnName,
                skip,
                take),
            cancellationToken);

        if (result.IsSuccess)
        {
            return new CollectionSegment<ChargeInformationDto>(
                result.Value!.ToList(),
                new(true, true),
                9999);
        }

        return new CollectionSegment<ChargeInformationDto>([], new(false, false), 0);
    }

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<ChargeInformationDto?> GetChargeByIdAsync(
        [Service] IChargesClient client,
        CancellationToken cancellationToken,
        string id)
    {
        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(id, [], [], true, ChargeSeriesSortColumnName.FromDateTime, 0, 1),
            cancellationToken);

        return result.Value?.FirstOrDefault();
    }
}
