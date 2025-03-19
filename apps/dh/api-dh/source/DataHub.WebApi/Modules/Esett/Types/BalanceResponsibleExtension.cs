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
using Energinet.DataHub.WebApi.Modules.Esett.Models;
using HotChocolate.Resolvers;

using SortDirection = Energinet.DataHub.WebApi.GraphQL.Enums.SortDirection;

namespace Energinet.DataHub.WebApi.Modules.Esett.Types;

[ExtendObjectType("BalanceResponsibleCollectionSegment")]
public class BalanceResponsibleExtension
{
    public string? BalanceResponsiblesUrl(
        string locale,
        [Service] IHttpContextAccessor httpContext,
        [Service] LinkGenerator linkGenerator,
        IResolverContext context)
    {
        var order = context.Variables.GetVariable<BalanceResponsibleSortInput>("order");

        var (sortProperty, sortDirection) = order switch
        {
            { ReceivedDate: not null } => (BalanceResponsibleSortProperty.ReceivedDate, order.ReceivedDate),
            { ValidFrom: not null } => (BalanceResponsibleSortProperty.ValidFrom, order.ValidFrom),
            { ValidTo: not null } => (BalanceResponsibleSortProperty.ValidTo, order.ValidTo),
            _ => (BalanceResponsibleSortProperty.ReceivedDate, SortDirection.Desc),
        };

        return linkGenerator.GetUriByAction(
                  httpContext.HttpContext!,
                  "DownloadBalanceResponsibles",
                  "EsettExchange",
                  new { locale, sortProperty, sortDirection });
    }

    public string? BalanceResponsibleImportUrl(
        [Service] IHttpContextAccessor httpContext,
        [Service] LinkGenerator linkGenerator) => linkGenerator.GetUriByAction(
            httpContext.HttpContext!,
            "Import",
            "MarketParticipantBalanceResponsible");
}
