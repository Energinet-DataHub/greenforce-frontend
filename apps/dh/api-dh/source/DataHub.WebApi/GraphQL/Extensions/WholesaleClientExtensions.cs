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
using NodaTime;
using WholesaleCalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;

namespace Energinet.DataHub.WebApi.GraphQL;

public static class WholesaleClientExtensions
{
    internal static async Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(
        this IWholesaleClient_V3 client,
        CalculationQueryInput input)
    {
        var executionStates = input.ExecutionStates ?? [];
        var calculationTypes = input.CalculationTypes ?? [];
        var minExecutionTime = input.ExecutionTime?.Start.ToDateTimeOffset();
        var maxExecutionTime = input.ExecutionTime?.End.ToDateTimeOffset();
        var periodStart = input.Period?.Start.ToDateTimeOffset();
        var periodEnd = input.Period?.End.ToDateTimeOffset();

        // The API only allows for a single execution state to be specified
        CalculationState? executionState = executionStates.Length == 1 ? executionStates[0] : null;

        var calculations = await client.SearchCalculationsAsync(
            input.GridAreaCodes,
            executionState,
            minExecutionTime,
            maxExecutionTime,
            periodStart,
            periodEnd);

        return calculations
            .OrderByDescending(x => x.ExecutionTimeStart)
            .Where(x => executionStates.Length <= 1 || executionStates.Contains(x.ExecutionState))
            .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType));
    }
}
