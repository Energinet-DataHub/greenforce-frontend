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
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_021.CapacitySettlementCalculation.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using Brs_021_CalculationInput = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_021.CapacitySettlementCalculation.V1.Model.CalculationInputV1;
using Brs_023_027_CalculationInput = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationInputV1;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;

public class CalculationsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client)
    : ICalculationsClient
{
    public async Task<IEnumerable<ICalculationsQueryResultV1>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var lifecycleStates = input.State?.ToListOfOrchestrationInstanceLifecycleState();
        var terminationState = input.State?.ToOrchestrationInstanceTerminationState();
        bool? isInternalCalculation = input.ExecutionType is null
            ? null
            : input.ExecutionType == CalculationExecutionType.Internal;

        var query = new CalculationsQueryV1(userIdentity)
        {
            LifecycleStates = lifecycleStates,
            TerminationState = terminationState,
            CalculationTypes = input.CalculationTypes,
            GridAreaCodes = input.GridAreaCodes,
            PeriodStartDate = input.Period?.Start.ToDateTimeOffset(),
            PeriodEndDate = input.Period?.End.ToDateTimeOffset(),
            IsInternalCalculation = isInternalCalculation,
            ScheduledAtOrLater = input.State == ProcessState.Scheduled ? DateTime.UtcNow : null,
        };

        return await client.SearchOrchestrationInstancesByCustomQueryAsync(query, ct);
    }

    public async Task<ICalculationsQueryResultV1?> GetLatestCalculationAsync(
        StartCalculationType startCalculationType,
        PeriodInput period,
        CancellationToken ct = default)
    {
        var interval = period.ToIntervalOrThrow();
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var query = new CalculationsQueryV1(userIdentity)
        {
            PeriodStartDate = interval.Start.ToDateTimeOffset(),
            PeriodEndDate = interval.End.ToDateTimeOffset(),
            CalculationTypes = [startCalculationType.ToQueryParameterV1()],
            LifecycleStates = [OrchestrationInstanceLifecycleState.Terminated],
            TerminationState = OrchestrationInstanceTerminationState.Succeeded,
        };

        var calculations = await client.SearchOrchestrationInstancesByCustomQueryAsync(query, ct);
        return calculations.FirstOrDefault();
    }

    public async Task<IEnumerable<ICalculationsQueryResultV1>> GetNonTerminatedCalculationsAsync(
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var lifecycleStates = new[]
        {
            OrchestrationInstanceLifecycleState.Pending,
            OrchestrationInstanceLifecycleState.Queued,
            OrchestrationInstanceLifecycleState.Running,
        };

        var query = new CalculationsQueryV1(userIdentity) { LifecycleStates = lifecycleStates };
        var calculations = await client.SearchOrchestrationInstancesByCustomQueryAsync(query, ct);

        return calculations;
    }

    public async Task<ICalculationsQueryResultV1?> GetCalculationByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var result = await client.SearchOrchestrationInstanceByCustomQueryAsync<ICalculationsQueryResultV1>(
            new CalculationByIdQueryV1(userIdentity, id),
            ct);

        return result;
    }

    public Task<Guid> StartCalculationAsync(
        CreateCalculationInput input,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var calculationType = input.CalculationType.ToNullableBrs_023_027();

        // Brs_023_027 when not null, otherwise Brs_021
        if (calculationType is not null)
        {
            var gridAreaCodes = input.GridAreaCodes switch
            {
                not null and { Length: > 0 } => input.GridAreaCodes,
                _ => throw new ArgumentException("Must provide at least one grid area"),
            };

            var period = input.Period.ToIntervalOrThrow();
            var calculationInput = new Brs_023_027_CalculationInput(
                CalculationType: calculationType.Value,
                GridAreaCodes: gridAreaCodes,
                PeriodStartDate: period.Start.ToDateTimeOffset(),
                PeriodEndDate: period.End.ToDateTimeOffset(),
                IsInternalCalculation: input.ExecutionType == CalculationExecutionType.Internal);

            if (input.ScheduledAt is null)
            {
                return client.StartNewOrchestrationInstanceAsync(
                    new StartCalculationCommandV1(userIdentity, calculationInput),
                    ct);
            }
            else
            {
                return client.ScheduleNewOrchestrationInstanceAsync(
                    new ScheduleCalculationCommandV1(userIdentity, calculationInput, input.ScheduledAt.Value),
                    ct);
            }
        }
        else
        {
            var yearMonth = input.Period.YearMonth ?? throw new ArgumentException("YearMonth required for CapacitySettlement");
            var calculationInput = new Brs_021_CalculationInput((uint)yearMonth.Year, (uint)yearMonth.Month);

            if (input.ScheduledAt is null)
            {
                return client.StartNewOrchestrationInstanceAsync(
                    new StartCapacitySettlementCalculationCommandV1(userIdentity, calculationInput),
                    ct);
            }
            else
            {
                throw new ArgumentException("ScheduledAt is not yet supported for CapacitySettlement");
            }
        }
    }

    public async Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var command = new CancelScheduledOrchestrationInstanceCommand(
            userIdentity,
            id: calculationId);

        await client.CancelScheduledOrchestrationInstanceAsync(command, ct);

        return true;
    }
}
