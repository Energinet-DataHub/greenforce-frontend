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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
using NodaTime;
using NodaTime.Extensions;
using ProcessManagerCalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;

public class WholesaleClientAdapter(
    IWholesaleClient_V3 client,
    IWholesaleOrchestrationsClient orchestrationsClient)
    : ICalculationsClient
{
    public async Task<IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken ct = default)
    {
        var state = input.State;
        var isInternal = input.ExecutionType == CalculationExecutionType.Internal;
        var calculationTypes = input.CalculationTypes ?? [];
        var periodStart = input.Period?.Start.ToDateTimeOffset();
        var periodEnd = input.Period?.End.ToDateTimeOffset();
        var calculations = await client.SearchCalculationsAsync(
            input.GridAreaCodes,
            state == null ? null : MapProcessStateToCalculationState(state.Value),
            null,
            null,
            periodStart,
            periodEnd);

        return calculations
            .OrderByDescending(x => x.ScheduledAt)
            .Where(x => state == null || state == GetProcessStateFromCalculation(x))
            .Select(x => MapCalculationDtoToOrchestrationInstance(x))
            .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.ParameterValue.CalculationType))
            .Where(x => input.ExecutionType == null || x.ParameterValue.ExecutionType == input.ExecutionType);
    }

    public async Task<IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>>> GetNonTerminatedCalculationsAsync(
        CancellationToken ct = default)
    {
        var calculations = await client.SearchCalculationsAsync();
        return calculations
            .OrderByDescending(x => x.ScheduledAt)
            .Where(x => !IsTerminated(x.OrchestrationState))
            .Select(x => MapCalculationDtoToOrchestrationInstance(x));
    }

    public async Task<IOrchestrationInstanceTypedDto<ICalculation>> GetCalculationByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        var calculation = await client.GetCalculationAsync(id);
        return MapCalculationDtoToOrchestrationInstance(calculation);
    }

    public async Task<Guid> StartCalculationAsync(
        DateTimeOffset? runAt,
        CalculationInputV1 input,
        CancellationToken ct = default)
    {
        var requestDto = new StartCalculationRequestDto(
            StartDate: input.PeriodStartDate,
            EndDate: input.PeriodEndDate,
            ScheduledAt: runAt ?? DateTimeOffset.UtcNow,
            GridAreaCodes: input.GridAreaCodes,
            CalculationType: MapProcessManagerCalculationTypeToWholesaleAndEnergyCalculationType(input.CalculationType),
            IsInternalCalculation: input.IsInternalCalculation);

        return await orchestrationsClient.StartCalculationAsync(requestDto, ct);
    }

    public async Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        CancellationToken ct = default)
    {
        var requestDto = new CancelScheduledCalculationRequestDto(calculationId);
        await orchestrationsClient.CancelScheduledCalculationAsync(requestDto, ct);
        return true;
    }

    private CalculationState? MapProcessStateToCalculationState(ProcessState processState) =>
        processState switch
        {
            ProcessState.Scheduled => null,
            ProcessState.Pending => CalculationState.Pending,
            ProcessState.Running => CalculationState.Executing,
            ProcessState.Failed => CalculationState.Failed,
            ProcessState.Canceled => null,
            ProcessState.Succeeded => CalculationState.Completed,
        };

    private static ProcessState GetProcessStateFromCalculation(CalculationDto calculation) =>
        calculation.OrchestrationState switch
        {
            CalculationOrchestrationState.Scheduled
                when calculation.ScheduledAt > DateTimeOffset.Now => ProcessState.Scheduled,
            CalculationOrchestrationState.Scheduled => ProcessState.Pending,
            CalculationOrchestrationState.Started => ProcessState.Pending,
            CalculationOrchestrationState.Canceled => ProcessState.Canceled,
            CalculationOrchestrationState.Calculating => ProcessState.Running,
            CalculationOrchestrationState.CalculationFailed => ProcessState.Failed,
            CalculationOrchestrationState.Calculated => ProcessState.Running,
            CalculationOrchestrationState.ActorMessagesEnqueuing => ProcessState.Running,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => ProcessState.Failed,
            CalculationOrchestrationState.ActorMessagesEnqueued => ProcessState.Succeeded,
            CalculationOrchestrationState.Completed => ProcessState.Succeeded,
        };

    private OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation> MapCalculationDtoToOrchestrationInstance(
        CalculationDto c) => new(
        c.CalculationId,
        MapCalculationDtoToOrchestrationInstanceLifecycleDto(c),
        MapCalculationDtoToStepInstanceDtoList(c),
        string.Empty,
        new WholesaleAndEnergyCalculation(
            c.CalculationType.FromWholesaleAndEnergyCalculationType(),
            c.IsInternalCalculation ? CalculationExecutionType.Internal : CalculationExecutionType.External,
            c.GridAreaCodes.ToArray(),
            new Interval(c.PeriodStart.ToInstant(), c.PeriodEnd.ToInstant())));

    private OrchestrationInstanceLifecycleDto MapCalculationDtoToOrchestrationInstanceLifecycleDto(CalculationDto c) =>
        new(
            new UserIdentityDto(c.CreatedByUserId, null!, null!), // Actor number/role is not used
            MapCalculationOrchestrationStateToOrchestrationInstanceLifecycleState(c.OrchestrationState),
            MapCalculationOrchestrationStateToOrchestrationInstanceTerminationState(c.OrchestrationState),
            c.OrchestrationState == CalculationOrchestrationState.Canceled ? new UserIdentityDto(c.CreatedByUserId, null!, null!) : null, // Actor number/role is not used
            c.ScheduledAt,
            c.ScheduledAt,
            c.ExecutionTimeStart,
            c.ExecutionTimeStart,
            c.ExecutionTimeEnd);

    private OrchestrationInstanceLifecycleState MapCalculationOrchestrationStateToOrchestrationInstanceLifecycleState(
        CalculationOrchestrationState orchestrationState) =>
        orchestrationState switch
        {
            CalculationOrchestrationState.Scheduled => OrchestrationInstanceLifecycleState.Pending,
            CalculationOrchestrationState.Started => OrchestrationInstanceLifecycleState.Queued,
            CalculationOrchestrationState.Canceled => OrchestrationInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.Calculating => OrchestrationInstanceLifecycleState.Running,
            CalculationOrchestrationState.CalculationFailed => OrchestrationInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.Calculated => OrchestrationInstanceLifecycleState.Running,
            CalculationOrchestrationState.ActorMessagesEnqueuing => OrchestrationInstanceLifecycleState.Running,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => OrchestrationInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.ActorMessagesEnqueued => OrchestrationInstanceLifecycleState.Running,
            CalculationOrchestrationState.Completed => OrchestrationInstanceLifecycleState.Terminated,
        };

    private OrchestrationInstanceTerminationState? MapCalculationOrchestrationStateToOrchestrationInstanceTerminationState(
        CalculationOrchestrationState orchestrationState) =>
        orchestrationState switch
        {
            CalculationOrchestrationState.Scheduled => null,
            CalculationOrchestrationState.Started => null,
            CalculationOrchestrationState.Canceled => OrchestrationInstanceTerminationState.UserCanceled,
            CalculationOrchestrationState.Calculating => null,
            CalculationOrchestrationState.CalculationFailed => OrchestrationInstanceTerminationState.Failed,
            CalculationOrchestrationState.Calculated => null,
            CalculationOrchestrationState.ActorMessagesEnqueuing => null,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => OrchestrationInstanceTerminationState.Failed,
            CalculationOrchestrationState.ActorMessagesEnqueued => null,
            CalculationOrchestrationState.Completed => OrchestrationInstanceTerminationState.Succeeded,
        };

    private StepInstanceDto[] MapCalculationDtoToStepInstanceDtoList(
        CalculationDto c) =>
        [
            new(
                Guid.Empty,
                new StepInstanceLifecycleDto(
                    MapCalculationOrchestrationStateToCalculationStepInstanceLifecycleState(c.OrchestrationState),
                    MapCalculationOrchestrationStateToCalculationStepInstanceTerminationState(c.OrchestrationState),
                    c.ExecutionTimeStart,
                    null), // data not available
                string.Empty,
                1,
                string.Empty),
            new(
                Guid.Empty,
                new StepInstanceLifecycleDto(
                    MapCalculationDtoToEnqueueStepInstanceLifecycleState(c),
                    MapCalculationDtoToEnqueueStepInstanceTerminationState(c),
                    null, // data not available
                    c.ExecutionTimeEnd),
                string.Empty,
                2,
                string.Empty),
        ];

    private StepInstanceLifecycleState MapCalculationOrchestrationStateToCalculationStepInstanceLifecycleState(
        CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => StepInstanceLifecycleState.Pending,
            CalculationOrchestrationState.Started => StepInstanceLifecycleState.Pending,
            CalculationOrchestrationState.Canceled => StepInstanceLifecycleState.Pending,
            CalculationOrchestrationState.Calculating => StepInstanceLifecycleState.Running,
            CalculationOrchestrationState.CalculationFailed => StepInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.Calculated => StepInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.ActorMessagesEnqueuing => StepInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => StepInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.ActorMessagesEnqueued => StepInstanceLifecycleState.Terminated,
            CalculationOrchestrationState.Completed => StepInstanceLifecycleState.Terminated,
        };

    private OrchestrationStepTerminationState? MapCalculationOrchestrationStateToCalculationStepInstanceTerminationState(
        CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => null,
            CalculationOrchestrationState.Started => null,
            CalculationOrchestrationState.Canceled => null,
            CalculationOrchestrationState.Calculating => null,
            CalculationOrchestrationState.CalculationFailed => OrchestrationStepTerminationState.Failed,
            CalculationOrchestrationState.Calculated => OrchestrationStepTerminationState.Succeeded,
            CalculationOrchestrationState.ActorMessagesEnqueuing => OrchestrationStepTerminationState.Succeeded,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => OrchestrationStepTerminationState.Succeeded,
            CalculationOrchestrationState.ActorMessagesEnqueued => OrchestrationStepTerminationState.Succeeded,
            CalculationOrchestrationState.Completed => OrchestrationStepTerminationState.Succeeded,
        };

    private StepInstanceLifecycleState MapCalculationDtoToEnqueueStepInstanceLifecycleState(
        CalculationDto calculation) =>
        calculation.IsInternalCalculation switch
        {
            true => StepInstanceLifecycleState.Terminated,
            false => calculation.OrchestrationState switch
            {
                CalculationOrchestrationState.Scheduled => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.Started => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.Canceled => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.Calculating => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.CalculationFailed => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.Calculated => StepInstanceLifecycleState.Pending,
                CalculationOrchestrationState.ActorMessagesEnqueuing => StepInstanceLifecycleState.Running,
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => StepInstanceLifecycleState.Terminated,
                CalculationOrchestrationState.ActorMessagesEnqueued => StepInstanceLifecycleState.Terminated,
                CalculationOrchestrationState.Completed => StepInstanceLifecycleState.Terminated,
            },
        };

    private OrchestrationStepTerminationState? MapCalculationDtoToEnqueueStepInstanceTerminationState(
        CalculationDto calculation) =>
        calculation.IsInternalCalculation switch
        {
            true => OrchestrationStepTerminationState.Skipped,
            false => calculation.OrchestrationState switch
            {
                CalculationOrchestrationState.Scheduled => null,
                CalculationOrchestrationState.Started => null,
                CalculationOrchestrationState.Canceled => null,
                CalculationOrchestrationState.Calculating => null,
                CalculationOrchestrationState.CalculationFailed => null,
                CalculationOrchestrationState.Calculated => null,
                CalculationOrchestrationState.ActorMessagesEnqueuing => null,
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => OrchestrationStepTerminationState.Failed,
                CalculationOrchestrationState.ActorMessagesEnqueued => OrchestrationStepTerminationState.Succeeded,
                CalculationOrchestrationState.Completed => OrchestrationStepTerminationState.Succeeded,
            },
        };

    private WholesaleAndEnergyCalculationType MapProcessManagerCalculationTypeToWholesaleAndEnergyCalculationType(
        ProcessManagerCalculationType wholesaleCalculationType) => wholesaleCalculationType switch
        {
            ProcessManagerCalculationType.Aggregation => WholesaleAndEnergyCalculationType.Aggregation,
            ProcessManagerCalculationType.BalanceFixing => WholesaleAndEnergyCalculationType.BalanceFixing,
            ProcessManagerCalculationType.WholesaleFixing => WholesaleAndEnergyCalculationType.WholesaleFixing,
            ProcessManagerCalculationType.FirstCorrectionSettlement => WholesaleAndEnergyCalculationType.FirstCorrectionSettlement,
            ProcessManagerCalculationType.SecondCorrectionSettlement => WholesaleAndEnergyCalculationType.SecondCorrectionSettlement,
            ProcessManagerCalculationType.ThirdCorrectionSettlement => WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement,
        };

    private bool IsTerminated(CalculationOrchestrationState state) => state switch
    {
        CalculationOrchestrationState.Scheduled => false,
        CalculationOrchestrationState.Started => false,
        CalculationOrchestrationState.Canceled => true,
        CalculationOrchestrationState.Calculating => false,
        CalculationOrchestrationState.CalculationFailed => true,
        CalculationOrchestrationState.Calculated => false,
        CalculationOrchestrationState.ActorMessagesEnqueuing => false,
        CalculationOrchestrationState.ActorMessagesEnqueuingFailed => true,
        CalculationOrchestrationState.ActorMessagesEnqueued => false,
        CalculationOrchestrationState.Completed => true,
    };
}
