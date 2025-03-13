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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Metering;

[ObjectType<MeteringGridAreaImbalanceSearchResult>]
public static partial class MeteringGridAreaImbalanceSearchResultType
{
    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] MeteringGridAreaImbalanceSearchResult result,
        IGridAreaByCodeDataLoader dataLoader) =>
            await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    public static string? GetMgaImbalanceDocumentUrl(
        [Parent] MeteringGridAreaImbalanceSearchResult result,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) =>
            linkGenerator.GetUriByAction(
                httpContextAccessor.HttpContext!,
                "GetMgaImbalanceDocument",
                "EsettExchange",
                new { documentId = result.Id });

    static partial void Configure(
        IObjectTypeDescriptor<MeteringGridAreaImbalanceSearchResult> descriptor)
    {
        descriptor.Field(x => x.GridAreaCode).Ignore();
        descriptor.Field(x => x.PeriodStart).Ignore();
        descriptor.Field(f => f.PeriodEnd).Ignore();

        descriptor
          .Field("period")
          .Resolve((context, _) =>
          {
              var meteringGridAreaImbalance = context.Parent<MeteringGridAreaImbalanceSearchResult>();
              return new Interval(Instant.FromDateTimeOffset(meteringGridAreaImbalance.PeriodStart), Instant.FromDateTimeOffset(meteringGridAreaImbalance.PeriodEnd));
          });
    }
}
