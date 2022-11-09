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

using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Mappers
{
    internal sealed class GridAreaMapper
    {
        public static void MapToEntity(GridArea from, GridAreaEntity to)
        {
            to.Code = from.Code.Value;
            to.Id = from.Id.Value;
            to.Name = from.Name.Value;
            to.PriceAreaCode = from.PriceAreaCode;
        }

        public static GridArea MapFromEntity(GridAreaEntity from)
        {
            return new GridArea(
                new GridAreaId(from.Id),
                new GridAreaName(from.Name),
                new GridAreaCode(from.Code),
                from.PriceAreaCode);
        }
    }
}
