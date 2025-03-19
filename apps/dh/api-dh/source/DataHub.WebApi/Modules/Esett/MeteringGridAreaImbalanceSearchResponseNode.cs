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
using NodaTime;
using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<MeteringGridAreaImbalanceSearchResponse>]
public static partial class MeteringGridAreaImbalanceSearchResponseNode
{
    [Query]
    public static async Task<MeteringGridAreaImbalanceSearchResponse> GetMeteringGridAreaImbalanceAsync(
        int pageNumber,
        int pageSize,
        DateTimeOffset? createdFrom,
        DateTimeOffset? createdTo,
        Interval? calculationPeriod,
        ICollection<string>? gridAreaCodes,
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
                GridAreaCodes = gridAreaCodes,
                DocumentId = documentId,
                SortDirection = sortDirection.FromSortingToEsettSorting(),
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

    [Query]
    public static async Task<string> DownloadMeteringGridAreaImbalanceAsync(
           string locale,
           DateTimeOffset? createdFrom,
           DateTimeOffset? createdTo,
           Interval? calculationPeriod,
           ICollection<string>? gridAreaCodes,
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
                GridAreaCodes = gridAreaCodes,
                DocumentId = documentId,
                SortDirection = sortDirection.FromSortingToEsettSorting(),
                SortProperty = sortProperty,
                MeteringGridImbalanceValuesToInclude = valuesToInclude,
            },
        });

        using var streamReader = new StreamReader(file.Stream);
        return await streamReader.ReadToEndAsync();
    }
}
