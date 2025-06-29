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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.Esett.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;
using NodaTime;

using ExchangeCalculationTypeExchange = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.CalculationType;
using SortDirection = Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<ExchangeEventSearchResult>]
public static partial class ExchangeEventSearchResultNode
{
    [Query]
    [UseOffsetPaging(MaxPageSize = 10_000)]
    public static async Task<CollectionSegment<ExchangeEventSearchResult>> GetEsettExchangeEventsAsync(
        Interval? periodInterval,
        Interval? createdInterval,
        Interval? sentInterval,
        ICollection<string>? gridAreaCodes,
        ExchangeCalculationTypeExchange? calculationType,
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
            { LatestDispatched: not null } => (ExchangeEventSortProperty.LatestDispatched, order.LatestDispatched.Value),
            { TimeSeriesType: not null } => (ExchangeEventSortProperty.TimeSeriesType, order.TimeSeriesType.Value),
            { CalculationType: not null } => (ExchangeEventSortProperty.CalculationType, order.CalculationType.Value),
            { Created: not null } => (ExchangeEventSortProperty.Created, order.Created.Value),
            { DocumentId: not null } => (ExchangeEventSortProperty.DocumentId, order.DocumentId.Value),
            { DocumentStatus: not null } => (ExchangeEventSortProperty.DocumentStatus, order.DocumentStatus.Value),
            { GridAreaCode: not null } => (ExchangeEventSortProperty.GridAreaCode, order.GridAreaCode.Value),
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
                Direction = sortDirection.FromSortingToEsettSorting(),
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

    [Query]
    public static async Task<string> DownloadEsettExchangeEventsAsync(
        string locale,
        Interval? periodInterval,
        Interval? createdInterval,
        Interval? sentInterval,
        ICollection<string>? gridAreaCodes,
        ExchangeCalculationTypeExchange? calculationType,
        ICollection<DocumentStatus>? documentStatuses,
        TimeSeriesType? timeSeriesType,
        string? documentId,
        string? actorNumber,
        EsettExchangeEventSortInput? order,
        [Service] IESettExchangeClient_V1 client)
    {
        var (sortProperty, sortDirection) = order switch
        {
            { LatestDispatched: not null } => (ExchangeEventSortProperty.LatestDispatched, order.LatestDispatched.Value),
            { TimeSeriesType: not null } => (ExchangeEventSortProperty.TimeSeriesType, order.TimeSeriesType.Value),
            { CalculationType: not null } => (ExchangeEventSortProperty.CalculationType, order.CalculationType.Value),
            { Created: not null } => (ExchangeEventSortProperty.Created, order.Created.Value),
            { DocumentId: not null } => (ExchangeEventSortProperty.DocumentId, order.DocumentId.Value),
            { DocumentStatus: not null } => (ExchangeEventSortProperty.DocumentStatus, order.DocumentStatus.Value),
            { GridAreaCode: not null } => (ExchangeEventSortProperty.GridAreaCode, order.GridAreaCode.Value),
            _ => (ExchangeEventSortProperty.DocumentId, SortDirection.Desc),
        };

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
                Direction = sortDirection.FromSortingToEsettSorting(),
                SortProperty = sortProperty,
            },
        });

        using var streamReader = new StreamReader(file.Stream);
        return await streamReader.ReadToEndAsync();
    }

    #region  Computed fields on ExchangeEventSearchResult
    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ExchangeEventSearchResult result,
        IGridAreaByCodeDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    public static Task<ActorNameDto?> GetEnergySupplierAsync(
        [Parent] ExchangeEventSearchResult result,
        IActorNameByMarketRoleDataLoader dataLoader)
    {
        if (string.IsNullOrEmpty(result.ActorNumber))
        {
            return Task.FromResult<ActorNameDto?>(null);
        }

        return dataLoader.LoadAsync((result.ActorNumber, EicFunction.EnergySupplier));
    }
    #endregion

    static partial void Configure(IObjectTypeDescriptor<ExchangeEventSearchResult> descriptor)
    {
        descriptor.Name("ExchangeEventSearchResult");

        descriptor.Ignore(x => x.GridAreaCode);
    }
}
