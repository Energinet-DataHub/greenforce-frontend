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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Extensions;
using HotChocolate.Authorization;
using Newtonsoft.Json.Linq;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;

public static class MeteringPointManualCorrectionsNode
{
    [Query]
    [Authorize(Roles = ["dh3-skalpellen"])]
    public static async Task<string> GetMeteringPointForManualCorrectionAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContext,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        return IsFas(httpContext)
            ? ((JObject)await electricityMarketClient.MeteringPointManualCorrectionGetAsync(meteringPointId, ct).ConfigureAwait(false)).ToString()
            : string.Empty;
    }

    [Mutation]
    [Authorize(Roles = ["dh3-skalpellen"])]
    public static async Task<string> SimulateMeteringPointManualCorrectionAsync(
        string meteringPointId,
        string json,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContext,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        return IsFas(httpContext)
            ? (await electricityMarketClient.MeteringPointManualCorrectionSimulateAsync(meteringPointId, JObject.Parse(json), ct).ConfigureAwait(false)).Result
            : string.Empty;
    }

    [Mutation]
    [Authorize(Roles = ["dh3-skalpellen"])]
    public static async Task<bool> ExecuteMeteringPointManualCorrectionAsync(
        string meteringPointId,
        string json,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContext,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (IsFas(httpContext))
        {
            await electricityMarketClient.MeteringPointManualCorrectionPostAsync(meteringPointId, JObject.Parse(json), ct).ConfigureAwait(false);
            return true;
        }

        return false;
    }

    private static bool IsFas(IHttpContextAccessor httpContext)
    {
        return httpContext.HttpContext?.User.IsFas() ?? false;
    }
}
