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
using Energinet.DataHub.ProcessManager.Orchestrations.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;

/// <summary>
/// Extension methods to help us map to and from "old" and "new" Calculation types.
/// </summary>
public static class OrchestrationInstanceMapperExtensions
{
    /// <summary>
    /// Map from "old" Calculation types to "new" types.
    /// </summary>
    public static (OrchestrationInstanceLifecycleStates? LifecycleState, OrchestrationInstanceTerminationStates? TerminationState)
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

    /// <summary>
    /// Map from "old" Calculation types to "new" types.
    /// </summary>
    public static CalculationTypes MapToCalculationType(
        this v3.CalculationType calculationType)
    {
        return Enum
            .TryParse<CalculationTypes>(
                calculationType.ToString(),
                ignoreCase: true,
                out var calculationTypeResult)
            ? calculationTypeResult
            : throw new InvalidOperationException($"Invalid CalculationType '{calculationType}'; cannot be mapped.");
    }

    /// <summary>
    /// Map from "new" Calculation types to "old" types.
    /// </summary>
    public static CalculationDto MapToV3CalculationDto(
        this OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1> instanceDto)
    {
        return new CalculationDto
        {
            RunId = null, // Deprecated
            Resolution = null, // Deprecated
            Unit = null, // Deprecated
            AreSettlementReportsCreated = false, // Deprecated in current context

            CalculationId = instanceDto.Id,
            ScheduledAt = instanceDto.Lifecycle?.ScheduledToRunAt ?? DateTimeOffset.MinValue,

            CalculationType = instanceDto.ParameterValue.CalculationType.MapToV3CalculationType(),
            GridAreaCodes = instanceDto.ParameterValue.GridAreaCodes.ToArray(),
            PeriodStart = instanceDto.ParameterValue.PeriodStartDate,
            PeriodEnd = instanceDto.ParameterValue.PeriodEndDate,
            IsInternalCalculation = instanceDto.ParameterValue.IsInternalCalculation,
            CreatedByUserId = instanceDto.ParameterValue.UserId,

            ExecutionTimeStart = instanceDto.Lifecycle?.StartedAt,
            ExecutionTimeEnd = null, // Not used as far as I can tell; instead 'CompletedTime' is used and mapped to 'executionTimeEnd'
            CompletedTime = instanceDto.Lifecycle?.TerminatedAt,

            OrchestrationState = instanceDto.MapToV3OrchestrationState(),
        };
    }

    /// <summary>
    /// Map from "new" Calculation types to "old" types.
    /// </summary>
    public static v3.CalculationType MapToV3CalculationType(
        this CalculationTypes calculationType)
    {
        return Enum
            .TryParse<v3.CalculationType>(
                calculationType.ToString(),
                ignoreCase: true,
                out var calculationTypeResult)
            ? calculationTypeResult
            : throw new InvalidOperationException($"Invalid CalculationType '{calculationType}'; cannot be mapped.");
    }

#pragma warning disable IDE0011 // Add braces
    /// <summary>
    /// Map from "new" Calculation types to "old" types.
    /// </summary>
    public static CalculationOrchestrationState MapToV3OrchestrationState(
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
