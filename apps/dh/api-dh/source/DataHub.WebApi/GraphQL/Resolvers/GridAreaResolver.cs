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
using Energinet.DataHub.WebApi.GraphQL.Enums;

namespace Energinet.DataHub.WebApi.GraphQL.Resolvers;

public class GridAreaResolvers
{
    public GridAreaStatus CalculateGridAreaStatus([Parent] IGridArea gridarea)
    {
        var validFrom = gridarea.ValidFrom;
        var validTo = gridarea.ValidTo;

        if (validFrom > DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Created;
        }

        if (validTo < DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Expired;
        }

        if (validFrom <= DateTimeOffset.UtcNow && validTo >= DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.Active;
        }

        if (validFrom <= DateTimeOffset.UtcNow && validTo == null)
        {
            return GridAreaStatus.Active;
        }

        return GridAreaStatus.Archived;
    }

    public PriceAreaCode ParsePriceAreaCode([Parent] IGridArea gridarea)
    {
        return Enum.Parse<PriceAreaCode>(gridarea.PriceAreaCode);
    }

    public string DisplayName([Parent] IGridArea gridarea) =>
        gridarea switch
        {
            null => string.Empty,
            var gridArea when string.IsNullOrWhiteSpace(gridArea.Name) => gridArea.Code,
            var gridArea => $"{gridArea.Code} • {gridArea.Name}",
        };
}
