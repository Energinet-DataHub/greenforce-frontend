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
using Energinet.DataHub.ProcessManager.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Client.Processes.BRS_023_027.V1;
using Energinet.DataHub.ProcessManager.Orchestrations.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

// TODO: Probably refactor; temporarily location to lay out the code.
internal static class ProcessManagerCalculationClientV1Extensions
{
    public static async Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(
        this INotifyAggregatedMeasureDataClientV1 client,
        CalculationQueryInput input)
    {
        // TODO:
        // We currently only support filtering on one state initially, and only
        // top-level states (orchestration instance states, not steps)
        var states = input.States ?? [];
        var state = states
            .Select(x => x.MapToLifecycleState())
            .FirstOrDefault();

        var calculationTypes = input.CalculationTypes ?? [];
        var processManagerCalculationTypes = calculationTypes
            .Select(x => x.MapToCalculationType())
            .ToList();

        var isInternal = input.ExecutionType == CalculationExecutionType.Internal;
        var minExecutionTime = input.ExecutionTime?.HasStart == true ? input.ExecutionTime?.Start.ToDateTimeOffset() : null;
        var maxExecutionTime = input.ExecutionTime?.HasEnd == true ? input.ExecutionTime?.End.ToDateTimeOffset() : null;
        var periodStart = input.Period?.Start.ToDateTimeOffset();
        var periodEnd = input.Period?.End.ToDateTimeOffset();

        var processManagerCalculations = await client.SearchCalculationsAsync(
            lifecycleState: state.LifecycleState,
            terminationState: state.TerminationState,
            startedAtOrLater: minExecutionTime,
            terminatedAtOrEarlier: maxExecutionTime,
            calculationTypes: processManagerCalculationTypes,
            gridAreaCodes: input.GridAreaCodes,
            periodStartDate: periodStart,
            periodEndDate: periodEnd,
            isInternalCalculation: isInternal,
            CancellationToken.None);

        var calculations = processManagerCalculations
            .Select(x => x.MapToV3CalculationDto());

        return calculations
            .OrderByDescending(x => x.ScheduledAt)
            .Where(x => states.Length == 0 || states.Contains(x.OrchestrationState))
            .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType))
            .Where(x => input.ExecutionType == null || x.IsInternalCalculation == isInternal);
    }

    internal static async Task<CalculationDto> GetCalculationMappedAsync(
        this INotifyAggregatedMeasureDataClientV1 client,
        Guid calculationId)
    {
        var instanceDto = await client.GetCalculationAsync(calculationId, CancellationToken.None);

        return instanceDto.MapToV3CalculationDto();
    }

    internal static (OrchestrationInstanceLifecycleStates? LifecycleState, OrchestrationInstanceTerminationStates? TerminationState)
        MapToLifecycleState(this CalculationOrchestrationState state)
    {
        switch (state)
        {
            case CalculationOrchestrationState.Scheduled:
                return (OrchestrationInstanceLifecycleStates.Pending, null);

            case CalculationOrchestrationState.Started:
            case CalculationOrchestrationState.Calculating:
            case CalculationOrchestrationState.Calculated:
            case CalculationOrchestrationState.ActorMessagesEnqueuing:
            case CalculationOrchestrationState.ActorMessagesEnqueued:
                return (OrchestrationInstanceLifecycleStates.Running, null);

            case CalculationOrchestrationState.CalculationFailed:
            case CalculationOrchestrationState.ActorMessagesEnqueuingFailed:
                return (OrchestrationInstanceLifecycleStates.Terminated, OrchestrationInstanceTerminationStates.Failed);

            case CalculationOrchestrationState.Completed:
                return (OrchestrationInstanceLifecycleStates.Terminated, OrchestrationInstanceTerminationStates.Succeeded);

            case CalculationOrchestrationState.Canceled:
                return (OrchestrationInstanceLifecycleStates.Terminated, OrchestrationInstanceTerminationStates.UserCanceled);

            default:
                throw new InvalidOperationException($"Invalid {nameof(CalculationOrchestrationState)} '{state}'; cannot be mapped.");
        }
    }

    internal static CalculationTypes MapToCalculationType(
        this Clients.Wholesale.v3.CalculationType calculationType)
    {
        return Enum
            .TryParse<CalculationTypes>(
                calculationType.ToString(),
                ignoreCase: true,
                out var calculationTypeResult)
            ? calculationTypeResult
            : throw new InvalidOperationException($"Invalid CalculationType '{calculationType}'; cannot be mapped.");
    }

    internal static CalculationDto MapToV3CalculationDto(
        this OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1> instanceDto)
    {
        // TODO: Can we create a new type to be used in UI so we avoid a tight coupling to external types?
        return new CalculationDto
        {
            RunId = null, // Deprecated
            Resolution = null, // Deprecated
            Unit = null, // Deprecated
            AreSettlementReportsCreated = false, // Deprecated in current context

            CalculationId = instanceDto.Id,
            CreatedByUserId = Guid.Empty, // TODO: Missing in Process Manager
            ScheduledAt = instanceDto.Lifecycle?.ScheduledToRunAt ?? DateTimeOffset.MinValue,

            CalculationType = instanceDto.ParameterValue.CalculationType.MapToV3CalculationType(),
            GridAreaCodes = instanceDto.ParameterValue.GridAreaCodes.ToArray(),
            PeriodStart = instanceDto.ParameterValue.PeriodStartDate,
            PeriodEnd = instanceDto.ParameterValue.PeriodEndDate,
            IsInternalCalculation = instanceDto.ParameterValue.IsInternalCalculation,

            ExecutionTimeStart = instanceDto.Lifecycle?.StartedAt,
            ExecutionTimeEnd = null, // Not used as far as I can tell; instead 'CompletedTime' is used and mapped to 'executionTimeEnd'
            CompletedTime = instanceDto.Lifecycle?.TerminatedAt,

            OrchestrationState = instanceDto.MapToV3OrchestrationState(),
        };
    }

    internal static Clients.Wholesale.v3.CalculationType MapToV3CalculationType(
        this CalculationTypes calculationType)
    {
        return Enum
            .TryParse<Clients.Wholesale.v3.CalculationType>(
                calculationType.ToString(),
                ignoreCase: true,
                out var calculationTypeResult)
            ? calculationTypeResult
            : throw new InvalidOperationException($"Invalid CalculationType '{calculationType}'; cannot be mapped.");
    }

#pragma warning disable IDE0011 // Add braces
    internal static Clients.Wholesale.v3.CalculationOrchestrationState MapToV3OrchestrationState(
        this OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1> instanceDto)
    {
        var calculationStep = instanceDto.Steps.Where(step => step.Sequence == 1).Single();
        var messagesEnqueuedStep = instanceDto.Steps.Where(step => step.Sequence == 2).Single();

        switch (instanceDto.Lifecycle.State)
        {
            case OrchestrationInstanceLifecycleStates.Pending:
            case OrchestrationInstanceLifecycleStates.Queued:
                return CalculationOrchestrationState.Scheduled;

            case OrchestrationInstanceLifecycleStates.Running:
                switch (calculationStep.Lifecycle.State)
                {
                    case StepInstanceLifecycleStates.Pending:
                        return CalculationOrchestrationState.Started;

                    case StepInstanceLifecycleStates.Running:
                        return CalculationOrchestrationState.Calculating;
                }

                switch (messagesEnqueuedStep.Lifecycle.State)
                {
                    case StepInstanceLifecycleStates.Pending:
                        return CalculationOrchestrationState.Calculated;

                    case StepInstanceLifecycleStates.Running:
                        return CalculationOrchestrationState.ActorMessagesEnqueuing;
                }

                return CalculationOrchestrationState.ActorMessagesEnqueued;

            case OrchestrationInstanceLifecycleStates.Terminated:
                switch (instanceDto.Lifecycle.TerminationState)
                {
                    case OrchestrationInstanceTerminationStates.Succeeded:
                        return CalculationOrchestrationState.Completed;

                    case OrchestrationInstanceTerminationStates.Failed:
                        if (calculationStep.Lifecycle.TerminationState == OrchestrationStepTerminationStates.Failed)
                            return CalculationOrchestrationState.CalculationFailed;

                        if (messagesEnqueuedStep.Lifecycle.TerminationState == OrchestrationStepTerminationStates.Failed)
                            return CalculationOrchestrationState.ActorMessagesEnqueuingFailed;

                        throw new InvalidOperationException($"Unexpected combination of orchestration instance Lifecycle.TerminationState and steps Lifecycle.TerminationState.");

                    case OrchestrationInstanceTerminationStates.UserCanceled:
                        return CalculationOrchestrationState.Canceled;

                    default:
                        throw new InvalidOperationException($"Invalid Lifecycle.TerminationState '{instanceDto.Lifecycle.TerminationState}'; cannot be mapped.");
                }

            default:
                throw new InvalidOperationException($"Invalid Lifecycle.State '{instanceDto.Lifecycle.State}'; cannot be mapped.");
        }
    }
#pragma warning restore IDE0011 // Add braces
}
