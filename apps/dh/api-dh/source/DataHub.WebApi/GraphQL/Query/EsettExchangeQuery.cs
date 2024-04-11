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
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL;

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

    public async Task<ExchangeEventSearchResponse> GetEsettExchangeEventsAsync(
        int pageNumber,
        int pageSize,
        Interval? periodInterval,
        Interval? createdInterval,
        string? gridAreaCode,
        Clients.ESettExchange.v1.CalculationType? calculationType,
        DocumentStatus? documentStatus,
        TimeSeriesType? timeSeriesType,
        string? documentId,
        ExchangeEventSortProperty sortProperty,
        SortDirection sortDirection,
        string? actorNumber,
        [Service] IESettExchangeClient_V1 client) =>
        await client.SearchAsync(new ExchangeEventSearchFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Filter = new ExchangeEventFilter
            {
                PeriodFrom = periodInterval?.Start.ToDateTimeOffset(),
                PeriodTo = periodInterval?.End.ToDateTimeOffset(),
                GridAreaCode = gridAreaCode,
                CalculationType = calculationType,
                DocumentStatus = documentStatus,
                TimeSeriesType = timeSeriesType,
                DocumentId = documentId,
                CreatedFrom = createdInterval?.Start.ToDateTimeOffset(),
                CreatedTo = createdInterval?.End.ToDateTimeOffset(),
                ActorNumber = actorNumber,
            },
            Sorting = new ExchangeEventSortPropertySorting
            {
                Direction = sortDirection,
                SortProperty = sortProperty,
            },
        });

    public async Task<string> DownloadEsettExchangeEventsAsync(
        string locale,
        Interval? periodInterval,
        Interval? createdInterval,
        string? gridAreaCode,
        Clients.ESettExchange.v1.CalculationType? calculationType,
        DocumentStatus? documentStatus,
        TimeSeriesType? timeSeriesType,
        string? documentId,
        ExchangeEventSortProperty sortProperty,
        SortDirection sortDirection,
        string? actorNumber,
        [Service] IESettExchangeClient_V1 client)
    {
        var file = await client.DownloadPOSTAsync(locale, new ExchangeEventDownloadFilter
        {
            Filter = new ExchangeEventFilter
            {
                PeriodFrom = periodInterval?.Start.ToDateTimeOffset(),
                PeriodTo = periodInterval?.End.ToDateTimeOffset(),
                GridAreaCode = gridAreaCode,
                CalculationType = calculationType,
                DocumentStatus = documentStatus,
                TimeSeriesType = timeSeriesType,
                DocumentId = documentId,
                CreatedFrom = createdInterval?.Start.ToDateTimeOffset(),
                CreatedTo = createdInterval?.End.ToDateTimeOffset(),
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
        string? gridAreaCode,
        string? documentId,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        MeteringGridAreaImbalanceSortProperty sortProperty,
        SortDirection sortDirection,
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
                GridAreaCode = gridAreaCode,
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
        string? gridAreaCode,
        string? documentId,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        MeteringGridAreaImbalanceSortProperty sortProperty,
        SortDirection sortDirection,
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
                GridAreaCode = gridAreaCode,
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
        SortDirection sortDirection,
        [Service] IESettExchangeClient_V1 client) =>
        await client.BalanceResponsibleAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection);

    public async Task<string> DownloadBalanceResponsiblesAsync(
        string locale,
        BalanceResponsibleSortProperty sortProperty,
        SortDirection sortDirection,
        [Service] IESettExchangeClient_V1 client)
    {
        var file = await client.DownloadGETAsync(locale, sortProperty, sortDirection);
        using var streamReader = new StreamReader(file.Stream);
        return await streamReader.ReadToEndAsync();
    }
}
