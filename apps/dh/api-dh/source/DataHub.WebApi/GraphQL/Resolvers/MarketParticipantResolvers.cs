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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;

namespace Energinet.DataHub.WebApi.GraphQL.Resolvers;

public class MarketParticipantResolvers
{
    public async Task<GridAreaDto?> GetGridAreaForBalanceResponsibilityRelationAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        IGridAreaByIdDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaId).ConfigureAwait(false);

    public Task<ActorNameWithId?> GetBalanceResponsibleWithNameAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        IActorNameByIdBatchDataLoader dataLoader) =>
        dataLoader.LoadAsync(result.BalanceResponsibleId);

    public Task<ActorNameWithId?> GetEnergySupplierWithNameAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        IActorNameByIdBatchDataLoader dataLoader) =>
        dataLoader.LoadAsync(result.EnergySupplierId);

    public async Task<string> GetIdentityDisplayNameByUserIdAsync(
        [Parent] ManuallyHandledExchangeEventMetaData parent,
        [Service] AuditIdentityCacheDataLoader client) =>
        (await client.LoadRequiredAsync(parent.ManuallyHandledBy)).DisplayName;
}
