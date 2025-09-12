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
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.Esett.Models;
using HotChocolate.Types.Pagination;
using NodaTime;
using SortDirection = Energinet.DataHub.WebApi.Modules.Common.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<MeteringGridAreaImbalanceSearchResponse>]
public static partial class MeteringGridAreaImbalanceSearchResponseNode
{
    [Query]
    [UseOffsetPaging]
    public static async Task<CollectionSegment<MeteringGridAreaImbalanceSearchResult>> GetMeteringGridAreaImbalanceAsync(
        Interval? created,
        Interval? calculationPeriod,
        ICollection<string>? gridAreaCodes,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        string? filter,
        int skip,
        int? take,
        MeteringGridAreaImbalanceSortInput? order,
        [Service] IESettExchangeClient_V1 client)
    {
        var pageSize = take ?? 50;
        var pageNumber = (skip / pageSize) + 1;

        var (sortProperty, sortDirection) = order switch
        {
            { DocumentDateTime: not null } => (MeteringGridAreaImbalanceSortProperty.DocumentDateTime, order.DocumentDateTime.Value),
            { ReceivedDateTime: not null } => (MeteringGridAreaImbalanceSortProperty.ReceivedDateTime, order.ReceivedDateTime.Value),
            { DocumentId: not null } => (MeteringGridAreaImbalanceSortProperty.DocumentId, order.DocumentId.Value),
            { GridAreaCode: not null } => (MeteringGridAreaImbalanceSortProperty.GridAreaCode, order.GridAreaCode.Value),
            _ => (MeteringGridAreaImbalanceSortProperty.DocumentId, SortDirection.Desc),
        };

        var response = await client.Search2Async(new MeteringGridAreaImbalanceSearchFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Filter = new MeteringGridAreaImbalanceFilter
            {
                CreatedFrom = created?.Start.ToDateTimeOffset(),
                CreatedTo = created?.End.ToDateTimeOffset(),
                CalculationPeriodFrom = calculationPeriod?.Start.ToDateTimeOffset(),
                CalculationPeriodTo = calculationPeriod?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                DocumentId = (filter ?? string.Empty).Trim(),
                SortDirection = sortDirection.FromSortingToEsettSorting(),
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

        var totalCount = response.TotalCount;
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = totalCount > pageNumber * pageSize;
        var pageInfo = new CollectionSegmentInfo(hasPreviousPage, hasNextPage);

        return new CollectionSegment<MeteringGridAreaImbalanceSearchResult>(
            response.Items.ToList(),
            pageInfo,
            totalCount);
    }

    [Query]
    public static async Task<MeteringGridAreaImbalanceSearchResult?> GetMeteringGridAreaImbalanceByIdAsync(
            string id,
            [Service] IESettExchangeClient_V1 client)
    {
        var response = await client.Search2Async(new MeteringGridAreaImbalanceSearchFilter
        {
            PageNumber = 1,
            PageSize = 1,
            Filter = new MeteringGridAreaImbalanceFilter
            {
                DocumentId = id,
            },
        });

        return response.Items.FirstOrDefault(x => x.Id == id);
    }

    [Query]
    public static async Task<string> DownloadMeteringGridAreaImbalanceAsync(
        string locale,
        Interval? created,
        Interval? calculationPeriod,
        ICollection<string>? gridAreaCodes,
        string? documentId,
        MeteringGridImbalanceValuesToInclude valuesToInclude,
        MeteringGridAreaImbalanceSortInput? order,
        [Service] IESettExchangeClient_V1 client)
    {
        var (sortProperty, sortDirection) = order switch
        {
            { DocumentDateTime: not null } => (MeteringGridAreaImbalanceSortProperty.DocumentDateTime, order.DocumentDateTime.Value),
            { ReceivedDateTime: not null } => (MeteringGridAreaImbalanceSortProperty.ReceivedDateTime, order.ReceivedDateTime.Value),
            { DocumentId: not null } => (MeteringGridAreaImbalanceSortProperty.DocumentId, order.DocumentId.Value),
            { GridAreaCode: not null } => (MeteringGridAreaImbalanceSortProperty.GridAreaCode, order.GridAreaCode.Value),
            _ => (MeteringGridAreaImbalanceSortProperty.DocumentId, SortDirection.Desc),
        };

        var file = await client.DownloadPOST2Async(locale, new MeteringGridAreaImbalanceDownloadFilter
        {
            Filter = new MeteringGridAreaImbalanceFilter
            {
                CreatedFrom = created?.Start.ToDateTimeOffset(),
                CreatedTo = created?.End.ToDateTimeOffset(),
                CalculationPeriodFrom = calculationPeriod?.Start.ToDateTimeOffset(),
                CalculationPeriodTo = calculationPeriod?.End.ToDateTimeOffset(),
                GridAreaCodes = gridAreaCodes,
                DocumentId = documentId,
                SortDirection = sortDirection.FromSortingToEsettSorting(),
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

        using var streamReader = new StreamReader(file.Stream);
        var test = await streamReader.ReadToEndAsync();
        return test;
    }
}
