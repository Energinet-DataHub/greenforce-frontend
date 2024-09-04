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

using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

public static class WholesaleClientExtensions
{
    internal static async Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(
        this IWholesaleClient_V3 client,
        CalculationQueryInput input)
    {
        var states = input.States ?? [];
        var isInternal = input.ExecutionType == CalculationExecutionType.Internal;
        var calculationTypes = input.CalculationTypes ?? [];
        var minExecutionTime = input.ExecutionTime?.HasStart == true ? input.ExecutionTime?.Start.ToDateTimeOffset() : null;
        var maxExecutionTime = input.ExecutionTime?.HasEnd == true ? input.ExecutionTime?.End.ToDateTimeOffset() : null;
        var periodStart = input.Period?.Start.ToDateTimeOffset();
        var periodEnd = input.Period?.End.ToDateTimeOffset();

        var calculations = await client.SearchCalculationsAsync(
            input.GridAreaCodes,
            null,
            minExecutionTime,
            maxExecutionTime,
            periodStart,
            periodEnd);

        return calculations
            .OrderByDescending(x => x.ScheduledAt)
            .Where(x => states.Length == 0 || states.Contains(x.OrchestrationState))
            .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType))
            .Where(x => input.ExecutionType == null || x.IsInternalCalculation == isInternal);
    }
}
