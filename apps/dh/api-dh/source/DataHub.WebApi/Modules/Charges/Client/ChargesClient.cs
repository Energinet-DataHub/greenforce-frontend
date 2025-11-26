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
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using NodaTime;
using ChargeApiModels = Energinet.DataHub.Charges.Abstractions.Api.Models;
using Markpart = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

public class ChargesClient(
    DataHub.Charges.Client.IChargesClient client,
    Markpart.IMarketParticipantClient_V1 marketParticipantClient_V1,
    IHttpContextAccessor httpContext) : IChargesClient
{
    public async Task<ChargeApiModels.Result<(IEnumerable<ChargeInformationDto> Charges, int TotalCount)>> GetChargesAsync(
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
                new ChargeInformationFilterDto(filter ?? string.Empty, query?.ActorNumbers ?? [], query?.ChargeTypes ?? []),
                sortColumnName,
                sortDirection == SortDirection.Desc),
            ct);

        if (result.IsFailure)
        {
            throw new GraphQLException(result.Error ?? "Exception in GetChargeInformationAsync");
        }

        return result;
    }

    public async Task<ChargeInformationDto?> GetChargeByIdAsync(
        ChargeIdentifierDto id,
        CancellationToken ct = default)
    {
        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 1, new ChargeInformationFilterDto(id.Code, [id.Owner], [id.ChargeType]), ChargeInformationSortProperty.Type, false),
            ct);

        return result.Value.Charges.FirstOrDefault();
    }

    public async Task<IEnumerable<ChargeInformationDto>> GetChargesByTypeAsync(
       ChargeType type,
       CancellationToken ct = default)
    {
        var currentUser = httpContext.CreateUserIdentity();
        var ownerGln = currentUser.ActorNumber.Value;

        if (currentUser.ActorRole == ActorRole.SystemOperator || currentUser.ActorRole == ActorRole.EnergySupplier)
        {
            ownerGln = (await marketParticipantClient_V1.ActorGetAsync(ct))
            .Where(x => x.MarketRole.EicFunction == DataHub.WebApi.Clients.MarketParticipant.v1.EicFunction.SystemOperator).SingleOrDefault()?.ActorNumber.Value;
        }

        if (string.IsNullOrWhiteSpace(ownerGln))
        {
            return [];
        }

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(0, 10_000, new ChargeInformationFilterDto(string.Empty, [ownerGln], [type]), ChargeInformationSortProperty.Type, false),
            ct);

        return result.Value.Charges;
    }

    public async Task<IEnumerable<ChargeSeries>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval period,
        CancellationToken ct = default)
    {
        try
        {
            var series = await client.GetChargeSeriesAsync(
                new ChargeSeriesSearchCriteriaDto(
                    id,
                    From: period.Start,
                    To: period.End),
                ct);

            if (series.Value is null || series.Value.Count() == 0)
            {
                return [];
            }

            return series.Value.Select((s, i) =>
            {
                var start = AddResolution(resolution, period, i, series.Value.Count());
                var end = AddResolution(resolution, period, i + 1, series.Value.Count());
                return new ChargeSeries(new(start.ToInstant(), end.ToInstant()), s.Points);
            });
        }
        catch
        {
            return [];
        }
    }

    private ZonedDateTime AddResolution(Resolution resolution, Interval period, int index, int totalCount)
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
