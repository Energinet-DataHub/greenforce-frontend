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

using Energinet.DataHub.ProcessManager.Api.Model;
using Energinet.DataHub.ProcessManager.Client.Processes.BRS_023_027.V1;
using Energinet.DataHub.ProcessManager.Orchestrations.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

// TODO: Probably refactor; temporarily location to lay out the code.
public static class ClientV1Extensions
{
    internal static async Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(
        this INotifyAggregatedMeasureDataClientV1 client,
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
            lifecycleState: null,
            terminationState: null,
            startedAtOrLater: minExecutionTime,
            terminatedAtOrEarlier: maxExecutionTime,
            calculationTypes: null,
            gridAreaCodes: input.GridAreaCodes,
            periodStartDate: periodStart,
            periodEndDate: periodEnd,
            isInternalCalculation: isInternal,
            CancellationToken.None);

        return calculations
            .OrderByDescending(x => x?.Lifecycle?.ScheduledToRunAt ?? DateTimeOffset.MinValue)
            ////.Where(x => states.Length == 0 || states.Contains(x.OrchestrationState))
            ////.Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType))
            .Where(x => input.ExecutionType == null || x?.ParameterValue?.IsInternalCalculation == isInternal)
            .Select(x => x.MapToCalculationDto())
            .ToList();
    }

    internal static async Task<CalculationDto> GetCalculationAsync(
        this INotifyAggregatedMeasureDataClientV1 client,
        Guid calculationId)
    {
        var instanceDto = await client.GetCalculationAsync(calculationId, CancellationToken.None);

        return instanceDto.MapToCalculationDto();
    }

    internal static CalculationDto MapToCalculationDto(
        this OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1> instanceDto)
    {
        // TODO: Can we create a new type to be used in UI so we avoid a tight coupling to external types?
        return new CalculationDto
        {
            RunId = null, // Deprecate
            Resolution = null, // Deprecate
            Unit = null, // Deprecate

            CalculationId = instanceDto.Id,
            PeriodStart = instanceDto?.ParameterValue?.PeriodStartDate ?? DateTimeOffset.MinValue,
            PeriodEnd = instanceDto?.ParameterValue?.PeriodEndDate ?? DateTimeOffset.MinValue,
            ScheduledAt = instanceDto?.Lifecycle?.ScheduledToRunAt ?? DateTimeOffset.MinValue,

            ExecutionTimeStart = instanceDto?.Lifecycle?.StartedAt ?? DateTimeOffset.MinValue,
            ExecutionTimeEnd = instanceDto?.Lifecycle?.TerminatedAt,
        };
    }
}
