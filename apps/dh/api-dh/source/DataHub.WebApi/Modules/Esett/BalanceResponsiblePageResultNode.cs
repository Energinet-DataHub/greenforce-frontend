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
using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<BalanceResponsiblePageResult>]
public static partial class BalanceResponsiblePageResultNode
{
    [Query]
    [UseOffsetPaging]
    public static async Task<CollectionSegment<BalanceResponsibleResult>> BalanceResponsibleAsync(
        int skip,
        int? take,
        BalanceResponsibleSortInput? order,
        [Service] IESettExchangeClient_V1 client)
    {
        var pageSize = take ?? 50;
        var pageNumber = (skip / pageSize) + 1;

        var (sortProperty, sortDirection) = order switch
        {
            { ReceivedDate: not null } => (BalanceResponsibleSortProperty.ReceivedDate, order.ReceivedDate),
            { ValidFrom: not null } => (BalanceResponsibleSortProperty.ValidFrom, order.ValidFrom),
            { ValidTo: not null } => (BalanceResponsibleSortProperty.ValidTo, order.ValidTo),
            _ => (BalanceResponsibleSortProperty.ReceivedDate, SortDirection.Desc),
        };

        var response = await client.BalanceResponsibleAsync(
            pageNumber,
            pageSize,
            sortProperty,
            sortDirection.FromNullableSortingToEsettSorting());

        var totalCount = response.TotalCount;
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = totalCount > pageNumber * pageSize;
        var pageInfo = new CollectionSegmentInfo(hasPreviousPage, hasNextPage);

        return new CollectionSegment<BalanceResponsibleResult>(
            response.Page.ToList(),
            pageInfo,
            totalCount);
    }

    [Query]
    public static async Task<BalanceResponsibleResult> GetBalanceResponsibleByIdAsync(
        string documentId,
        CancellationToken ct,
        [Service] IESettExchangeClient_V1 client)
    {
        return await client.ByDocumentIdAsync(documentId, ct).ConfigureAwait(false);
    }
}
