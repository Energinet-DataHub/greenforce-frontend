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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.GridAreaOverviewAsync();

    public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Service] IMarketParticipantClient_V1 client)
    {
        var actors = await client.ActorGetAsync();
        var gridAreas = await client.GridAreaGetAsync();
        return gridAreas.Select(gridArea =>
        {
            var owner = actors.FirstOrDefault(actor =>
                actor.Status == "Active" &&
                actor.MarketRoles.Any(mr =>
                    mr.EicFunction == EicFunction.GridAccessProvider &&
                    mr.GridAreas.Any(ga => ga.Id == gridArea.Id)));

            return owner == null
                ? gridArea
                : new GridAreaDto
                {
                    Id = gridArea.Id,
                    Code = gridArea.Code,
                    Name = owner.Name.Value,
                    PriceAreaCode = gridArea.PriceAreaCode,
                    ValidFrom = gridArea.ValidFrom,
                    ValidTo = gridArea.ValidTo,
                };
        });
    }
}
