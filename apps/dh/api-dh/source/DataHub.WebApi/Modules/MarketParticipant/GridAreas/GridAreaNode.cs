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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;

[ObjectType<GridAreaDto>]
public static partial class GridAreaNode
{
    [Query]
    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        CancellationToken ct,
        IGridAreasClient client) =>
        await client.GetGridAreasAsync(ct);

    [Query]
    public static async Task<IEnumerable<GridAreaDto>> GetRelevantGridAreasAsync(
        Guid? actorId,
        Interval period,
        CancellationToken ct,
        IGridAreasClient client) =>
        await client.GetRelevantGridAreasAsync(actorId, period, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<string, GridAreaDto>> GetGridAreaByCodeAsync(
        IReadOnlyList<string> keys,
        IGridAreasClient client,
        CancellationToken ct)
    {
        var gridAreas = await client.GetGridAreasAsync(ct);
        return gridAreas
            .Select(g => new KeyValuePair<string, GridAreaDto>(g.Code, g))
            .ToDictionary();
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, GridAreaDto>> GetGridAreaByIdAsync(
        IReadOnlyList<Guid> keys,
        IGridAreasClient client,
        CancellationToken ct)
    {
        var gridAreas = await client.GetGridAreasAsync(ct);
        return gridAreas
            .Select(g => new KeyValuePair<Guid, GridAreaDto>(g.Id, g))
            .ToDictionary();
    }

    public static bool IncludedInCalculation([Parent] IGridArea gridarea) => gridarea.Type switch
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
}
