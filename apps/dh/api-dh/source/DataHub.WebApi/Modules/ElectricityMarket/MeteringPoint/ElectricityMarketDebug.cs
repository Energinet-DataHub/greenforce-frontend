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

using System.Text.Json;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;

public static class ElectricityMarketDebug
{
    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<string> GetDebugViewAsync(
       string meteringPointId,
       CancellationToken ct,
       [Service] IElectricityMarketClient_V1 electricityMarketClient) =>
            (await electricityMarketClient.MeteringPointDebugViewAsync(meteringPointId, ct).ConfigureAwait(false)).Result;

    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<IEnumerable<MeteringPointsGroupByPackageNumber>> GetMeteringPointsByGridAreaCodeAsync(
        string gridAreaCode,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        var response = await electricityMarketClient.MeteringPointDebugAsync(gridAreaCode, ct).ConfigureAwait(false);

        var grouped = response.GroupBy(x => x.Identification.Substring(10, 4));

        return grouped.Select(x => new MeteringPointsGroupByPackageNumber(x.Key, x)).OrderBy(x => x.PackageNumber);
    }

    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<GetMeteringPointResultDtoV1?> GetDebugViewV2Async(
        string meteringPointId,
        CancellationToken ct,
        [Service] IElectricityMarketClient electricityMarketClient)
    {

        var meteringPointResult = await electricityMarketClient
            .SendAsync(new GetMeteringPointQueryV1(meteringPointId), ct)
            .ConfigureAwait(false);

        if (!meteringPointResult.IsSuccess)
        {
            throw new InvalidOperationException($"Failed to get metering point {meteringPointId}: {meteringPointResult.DiagnosticMessage}.");
        }

        if (!meteringPointResult.HasData)
        {
            return null;
        }

        return meteringPointResult.Data;
    }
}
