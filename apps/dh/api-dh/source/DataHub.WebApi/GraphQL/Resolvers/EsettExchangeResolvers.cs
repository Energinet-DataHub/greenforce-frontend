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
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;

namespace Energinet.DataHub.WebApi.GraphQL.Resolvers;

public class EsettExchangeResolvers
{
    private readonly string _pathBase = "/bff";
    private readonly string _controllerName = "EsettExchange";

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] BalanceResponsibleResult result,
        GridAreaByCodeBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridArea).ConfigureAwait(false);

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ExchangeEventTrackingResult result,
        GridAreaByCodeBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] MeteringGridAreaImbalanceSearchResult result,
        GridAreaByCodeBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ExchangeEventSearchResult result,
        GridAreaByCodeBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    public Task<ActorNameDto?> GetSupplierWithNameAsync(
        [Parent] ExchangeEventSearchResult result,
        ActorNameByMarketRoleDataLoader dataLoader) =>
        dataLoader.LoadAsync((result.ActorNumber ?? string.Empty, EicFunction.EnergySupplier));

    public Task<ActorNameDto?> GetSupplierWithNameAsync(
        [Parent] BalanceResponsibleResult result,
        ActorNameByMarketRoleDataLoader dataLoader) =>
        dataLoader.LoadAsync((result.Supplier, EicFunction.EnergySupplier));

    public Task<ActorNameDto?> GetBalanceResponsibleWithNameAsync(
        [Parent] BalanceResponsibleResult result,
        ActorNameByMarketRoleDataLoader dataLoader) =>
        dataLoader.LoadAsync((result.BalanceResponsible, EicFunction.BalanceResponsibleParty));

    public string? GetDispatchDocument(
        [Parent] ExchangeEventTrackingResult result,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) =>
            linkGenerator.GetUriByAction(
                httpContextAccessor.HttpContext!,
                "GetDispatchDocument",
                _controllerName,
                new { documentId = result.DocumentId },
                pathBase: _pathBase);

    public string? GetResponseDocument(
       [Parent] ExchangeEventTrackingResult result,
       [Service] IHttpContextAccessor httpContextAccessor,
       [Service] LinkGenerator linkGenerator) =>
           linkGenerator.GetUriByAction(
               httpContextAccessor.HttpContext!,
               "ResponseDocument",
               _controllerName,
               new { documentId = result.DocumentId },
               pathBase: _pathBase);
}
