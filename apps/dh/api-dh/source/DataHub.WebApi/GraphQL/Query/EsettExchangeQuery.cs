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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.GraphQL.Types.ExchangeEvent;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;
using NodaTime;

using ESettSortDirection = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.SortDirection;
using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<ReadinessStatusDto>> GetEsettServiceStatusAsync(
        [Service] IESettExchangeClient_V1 client) =>
        await client.StatusAsync();

    public async Task<ExchangeEventStatusReportResponse> GetEsettExchangeStatusReportAsync(
        [Service] IESettExchangeClient_V1 client) =>
        await client.StatusReportAsync();

    public async Task<ExchangeEventTrackingResult> GetEsettOutgoingMessageByIdAsync(
        string documentId,
        [Service] IESettExchangeClient_V1 client) =>
        await client.EsettAsync(documentId);

    [UseOffsetPaging(MaxPageSize = 10_000)]
    public async Task<CollectionSegment<ExchangeEventSearchResult>> GetEsettExchangeEventsAsync(
        Interval? periodInterval,
        Interval? createdInterval,
        Interval? sentInterval,
        ICollection<string>? gridAreaCodes,
        CalculationType? calculationType,
        ICollection<DocumentStatus>? documentStatuses,
        TimeSeriesType? timeSeriesType,
        string? filter,
        string? actorNumber,
        int skip,
        int? take,
        EsettExchangeEventSortInput? order,
        IResolverContext context,
        [Service] IESettExchangeClient_V1 client)
    {
        var pageSize = take ?? 50;
        var pageNumber = (skip / pageSize) + 1;

        var (sortProperty, sortDirection) = order switch
        {
            { CalculationType: not null } => (ExchangeEventSortProperty.CalculationType, order.CalculationType),
            { Created: not null } => (ExchangeEventSortProperty.Created, order.Created),
            { DocumentId: not null } => (ExchangeEventSortProperty.DocumentId, order.DocumentId),
            { DocumentStatus: not null } => (ExchangeEventSortProperty.DocumentStatus, order.DocumentStatus),
            { GridAreaCode: not null } => (ExchangeEventSortProperty.GridAreaCode, order.GridAreaCode),
            _ => (ExchangeEventSortProperty.DocumentId, SortDirection.Desc),
        };

        var response = await client.SearchAsync(new ExchangeEventSearchFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Filter = new ExchangeEventFilter
            {
                PeriodFrom = periodInterval?.Start.ToDateTimeOffset(),
                PeriodTo = periodInterval?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                CalculationType = calculationType,
                DocumentStatuses = documentStatuses,
                TimeSeriesType = timeSeriesType,
                DocumentId = (filter ?? string.Empty).Trim(),
                CreatedFrom = createdInterval?.Start.ToDateTimeOffset(),
                CreatedTo = createdInterval?.End.ToDateTimeOffset(),
                LatestDispatchedFrom = sentInterval?.Start.ToDateTimeOffset(),
                LatestDispatchedTo = sentInterval?.End.ToDateTimeOffset(),
                ActorNumber = actorNumber,
            },
            Sorting = new ExchangeEventSortPropertySorting
            {
                Direction = ToESettSortDirection(sortDirection),
                SortProperty = sortProperty,
            },
        });

        var totalCount = response.TotalCount;
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = totalCount > pageNumber * pageSize;
        var pageInfo = new CollectionSegmentInfo(hasPreviousPage, hasNextPage);

        context.ScopedContextData = context.ScopedContextData.SetItem("gridAreaCount", response.GridAreaCount);

        return new CollectionSegment<ExchangeEventSearchResult>(
            response.Items.ToList(),
            pageInfo,
            totalCount);
    }

    public async Task<string> DownloadEsettExchangeEventsAsync(
        string locale,
        Interval? periodInterval,
        Interval? createdInterval,
        Interval? sentInterval,
        ICollection<string>? gridAreaCodes,
        CalculationType? calculationType,
        ICollection<DocumentStatus>? documentStatuses,
        TimeSeriesType? timeSeriesType,
        string? documentId,
        ExchangeEventSortProperty sortProperty,
        ESettSortDirection sortDirection,
        string? actorNumber,
        [Service] IESettExchangeClient_V1 client)
    {
        var file = await client.DownloadPOSTAsync(locale, new ExchangeEventDownloadFilter
        {
            Filter = new ExchangeEventFilter
            {
                PeriodFrom = periodInterval?.Start.ToDateTimeOffset(),
                PeriodTo = periodInterval?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                CalculationType = calculationType,
                DocumentStatuses = documentStatuses,
                TimeSeriesType = timeSeriesType,
                DocumentId = documentId,
                CreatedFrom = createdInterval?.Start.ToDateTimeOffset(),
                CreatedTo = createdInterval?.End.ToDateTimeOffset(),
                LatestDispatchedFrom = sentInterval?.Start.ToDateTimeOffset(),
                LatestDispatchedTo = sentInterval?.End.ToDateTimeOffset(),
                ActorNumber = actorNumber,
            },
            Sorting = new ExchangeEventSortPropertySorting
            {
                Direction = sortDirection,
                SortProperty = sortProperty,
            },
        });

        using var streamReader = new StreamReader(file.Stream);
        return await streamReader.ReadToEndAsync();
    }

    public async Task<MeteringGridAreaImbalanceSearchResponse> GetMeteringGridAreaImbalanceAsync(
        int pageNumber,
        int pageSize,
        DateTimeOffset? createdFrom,
        DateTimeOffset? createdTo,
        Interval? calculationPeriod,
        ICollection<string>? gridAreaCodes,
        string? documentId,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        MeteringGridAreaImbalanceSortProperty sortProperty,
        ESettSortDirection sortDirection,
        [Service] IESettExchangeClient_V1 client) =>
        await client.Search2Async(new MeteringGridAreaImbalanceSearchFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Filter = new MeteringGridAreaImbalanceFilter
            {
                CreatedFrom = createdFrom,
                CreatedTo = createdTo,
                CalculationPeriodFrom = calculationPeriod?.Start.ToDateTimeOffset(),
                CalculationPeriodTo = calculationPeriod?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                DocumentId = documentId,
                SortDirection = sortDirection,
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

    public async Task<string> DownloadMeteringGridAreaImbalanceAsync(
        string locale,
        DateTimeOffset? createdFrom,
        DateTimeOffset? createdTo,
        Interval? calculationPeriod,
        ICollection<string>? gridAreaCodes,
        string? documentId,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        MeteringGridAreaImbalanceSortProperty sortProperty,
        ESettSortDirection sortDirection,
        [Service] IESettExchangeClient_V1 client)
    {
        var file = await client.DownloadPOST2Async(locale, new MeteringGridAreaImbalanceDownloadFilter
        {
            Filter = new MeteringGridAreaImbalanceFilter
            {
                CreatedFrom = createdFrom,
                CreatedTo = createdTo,
                CalculationPeriodFrom = calculationPeriod?.Start.ToDateTimeOffset(),
                CalculationPeriodTo = calculationPeriod?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                DocumentId = documentId,
                SortDirection = sortDirection,
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

        using var streamReader = new StreamReader(file.Stream);
        return await streamReader.ReadToEndAsync();
    }

    public async Task<BalanceResponsiblePageResult> BalanceResponsibleAsync(
        int pageNumber,
        int pageSize,
        BalanceResponsibleSortProperty sortProperty,
        ESettSortDirection sortDirection,
        [Service] IESettExchangeClient_V1 client) =>
        await client.BalanceResponsibleAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection);

    private static ESettSortDirection ToESettSortDirection(SortDirection? sortDirection) =>
        sortDirection switch
        {
            SortDirection.Asc => ESettSortDirection.Ascending,
            SortDirection.Desc => ESettSortDirection.Descending,
            _ => ESettSortDirection.Descending,
        };
}
