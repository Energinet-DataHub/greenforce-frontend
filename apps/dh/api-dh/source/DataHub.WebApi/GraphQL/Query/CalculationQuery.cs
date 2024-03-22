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

public partial class Query
{
    public async Task<CalculationDto> GetCalculationByIdAsync(
        Guid id,
        [Service] IWholesaleClient_V3 client) =>
        await client.GetCalculationAsync(id);

    public async Task<IEnumerable<CalculationDto>> GetCalculationsAsync(
        Interval? executionTime,
        CalculationState[]? executionStates,
        WholesaleCalculationType[]? calculationTypes,
        string[]? gridAreaCodes,
        Interval? period,
        int? first,
        [Service] IWholesaleClient_V3 client)
    {
        executionStates ??= [];
        calculationTypes ??= [];
        var minExecutionTime = executionTime?.Start.ToDateTimeOffset();
        var maxExecutionTime = executionTime?.End.ToDateTimeOffset();
        var periodStart = period?.Start.ToDateTimeOffset();
        var periodEnd = period?.End.ToDateTimeOffset();

        // The API only allows for a single execution state to be specified
        CalculationState? executionState = executionStates.Length == 1 ? executionStates[0] : null;

        var calculations = (await client.SearchCalculationsAsync(gridAreaCodes, executionState, minExecutionTime, maxExecutionTime, periodStart, periodEnd))
            .OrderByDescending(x => x.ExecutionTimeStart)
            .Where(x => executionStates.Length <= 1 || executionStates.Contains(x.ExecutionState))
            .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType));

        return first is not null ? calculations.Take(first.Value) : calculations;
    }
}
