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

using System;
using System.Collections.Generic;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Application.Mappers
{
    public static class MarketRoleMapper
    {
        public static IEnumerable<ActorMarketRole> Map(IEnumerable<ActorMarketRoleDto> marketRoleDtos)
        {
            ArgumentNullException.ThrowIfNull(marketRoleDtos);

            foreach (var marketRoleDto in marketRoleDtos)
            {
                var aggregatedGrids = marketRoleDto.GridAreas
                    .GroupBy(x => x.Id)
                    .Select(x => new ActorGridArea(x.Key, x.SelectMany(x => x.MeteringPointTypes)
                    .Select(x => Enum.Parse<MeteringPointType>(x, true)).Distinct()));

                yield return new ActorMarketRole(
                    Enum.Parse<EicFunction>(marketRoleDto.EicFunction, true),
                    aggregatedGrids,
                    marketRoleDto.Comment);
            }
        }
    }
}
