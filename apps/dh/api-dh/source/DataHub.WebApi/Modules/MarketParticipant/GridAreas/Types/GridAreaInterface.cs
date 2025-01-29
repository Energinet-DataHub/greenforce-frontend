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
using Energinet.DataHub.WebApi.Modules.Common.Enums;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.DataLoaders;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Enums;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Types;

[InterfaceType<IGridArea>]
public static partial class GridAreaInterface
{
    public static PriceAreaCode GetPriceAreaCode([Parent] IGridArea gridarea) =>
        gridarea.PriceAreaCode.ToUpper() switch
        {
            "DK1" => PriceAreaCode.Dk1,
            "DK2" => PriceAreaCode.Dk2,
            _ => throw new ArgumentException(),
        };

    public static string DisplayName([Parent] IGridArea gridarea) => gridarea switch
    {
        null => string.Empty,
        var gridArea when string.IsNullOrWhiteSpace(gridArea.Name) => gridArea.Code,
        var gridArea => $"{gridArea.Code} • {gridArea.Name}",
    };

    public static async Task<GridAreaStatus> StatusAsync(
        [Parent] IGridArea gridarea,
        ConsolidationByGridAreaIdBatchDataLoader consolidationsLoader)
    {
        var validFrom = gridarea.ValidFrom;
        var validTo = gridarea.ValidTo;
        var consolidation = await consolidationsLoader.LoadAsync(gridarea.Code);

        if (consolidation?.ConsolidateAt > DateTimeOffset.UtcNow)
        {
            return GridAreaStatus.ToBeDiscontinued;
        }

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

    public static bool IncludedInCalculation([Parent] IGridArea gridarea) =>
        gridarea.Type switch
        {
            GridAreaType.Aboard or
            GridAreaType.NotSet or
            GridAreaType.Test => false,
            GridAreaType.Transmission or
            GridAreaType.Distribution or
            GridAreaType.GridLossDK or
            GridAreaType.Other or

            // Og så har vi et for meget - det er net 312, UDGÅET 2.4.2024
            // - Vestjyske Net 60 KV (Må først inaktiveres 1.3.2027) • GLN 5790000375318, som er helt specelt.
            // Det er et net, som er af typen Distribution, og det er aktivt, selvom det kun skal med i vores
            // beregninger frem til 1. januar 2024. Problematikken med dette net er, at det er nedlagt pr.
            // 1. januar 2024, men netvirksomheden skal stadig kunne modtage vores korrektionsafregninger 3 år tilbage
            // i tid fra 1. januar 2024, så derfor kunne det ikke stå som Udløbet, som andre nedlagte net.
            // De kan stå som udløbet, fordi de er fusioneret ind i andre net, og det er 312 ikke.
            GridAreaType.GridLossAbroad => gridarea.Code != "312",
        };

    static partial void Configure(IInterfaceTypeDescriptor<IGridArea> descriptor)
    {
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.Name);
        descriptor.Field(f => f.Code);
        descriptor.Field(f => f.ValidFrom);
        descriptor.Field(f => f.ValidTo);
        descriptor.Field(f => f.Type);
    }
}
