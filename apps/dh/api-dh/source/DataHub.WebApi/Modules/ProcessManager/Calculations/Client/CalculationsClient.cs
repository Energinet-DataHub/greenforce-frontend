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
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_021.ElectricalHeatingCalculation;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;

public class CalculationsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client)
    : ICalculationsClient
{
    public async Task<IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var lifecycleStates = input.State?.ToListOfOrchestrationInstanceLifecycleState();
        var terminationState = input.State?.ToOrchestrationInstanceTerminationState();
        bool? isInternalCalculation = input.ExecutionType is null
            ? null
            : input.ExecutionType == CalculationExecutionType.Internal;

        var includeCalculations = input.CalculationTypes?.Any(x => x != CalculationType.ElectricalHeating) ?? true;
        var includeElectricalHeatingCalculations = input switch
        {
            { ExecutionType: CalculationExecutionType.Internal } => false,
            { GridAreaCodes: { Length: > 0 } } => false,
            { Period: not null } => false,
            { CalculationTypes: { Length: > 0 } } => input.CalculationTypes.Contains(CalculationType.ElectricalHeating),
            _ => true,
        };

        var result = new List<IOrchestrationInstanceTypedDto<ICalculation>>();

        if (includeCalculations)
        {
            var calculationTypes = input.CalculationTypes?.Where(x => x != CalculationType.ElectricalHeating);
            var calculationQuery = new CalculationQuery(userIdentity)
            {
                LifecycleStates = lifecycleStates,
                TerminationState = terminationState,
                CalculationTypes = calculationTypes?.Select(x => x.Unsafe_ToProcessManagerCalculationType()).ToArray(),
                GridAreaCodes = input.GridAreaCodes,
                PeriodStartDate = input.Period?.Start.ToDateTimeOffset(),
                PeriodEndDate = input.Period?.End.ToDateTimeOffset(),
                IsInternalCalculation = isInternalCalculation,
                ScheduledAtOrLater = input.State == ProcessState.Scheduled ? DateTime.UtcNow : null,
            };

            var calculations = (await client.SearchOrchestrationInstancesByCustomQueryAsync(calculationQuery, ct))
                .Select(x => MapToOrchestrationInstanceOfWholesaleAndEnergyCalculation(x.OrchestrationInstance))
                .ToList();

            result.AddRange(calculations);
        }

        if (includeElectricalHeatingCalculations)
        {
            var electricalHeatingCalculationsQuery = new SearchOrchestrationInstancesByNameQuery(
                userIdentity,
                Brs_021_ElectricalHeatingCalculation.Name,
                null,
                lifecycleStates,
                terminationState,
                null,
                null,
                null);

            var electricalHeatingCalculations = await client.SearchOrchestrationInstancesByNameAsync(
                electricalHeatingCalculationsQuery,
                ct);

            result.AddRange(electricalHeatingCalculations.Select(MapToOrchestrationInstanceOfElectricalHeating));
        }

        return result;
    }

    public async Task<IOrchestrationInstanceTypedDto<ICalculation>> GetCalculationByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var result = await client.GetOrchestrationInstanceByIdAsync<CalculationInputV1>(
            new GetOrchestrationInstanceByIdQuery(userIdentity, id),
            ct);

        // HACK: This is a temporary solution to determine if the calculation is an electrical
        // heating calculation. This should be done using a custom "query" in the future.
        if (result.ParameterValue.GridAreaCodes is null)
        {
            return MapToOrchestrationInstanceOfElectricalHeating(result);
        }

        return MapToOrchestrationInstanceOfWholesaleAndEnergyCalculation(result);
    }

    public async Task<Guid> StartCalculationAsync(
        DateTimeOffset? runAt,
        CalculationInputV1 input,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        return runAt switch
        {
            null => await client.StartNewOrchestrationInstanceAsync(
                new StartCalculationCommandV1(userIdentity, input),
                ct),
            _ => await client.ScheduleNewOrchestrationInstanceAsync(
                new ScheduleCalculationCommandV1(userIdentity, input, runAt.Value),
                ct),
        };
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

    private OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation>
        MapToOrchestrationInstanceOfWholesaleAndEnergyCalculation(
            IOrchestrationInstanceTypedDto<CalculationInputV1> input) =>
            new(
                input.Id,
                input.Lifecycle,
                input.Steps,
                input.CustomState,
                WholesaleAndEnergyCalculation.FromCalculationInputV1(input.ParameterValue));

    private OrchestrationInstanceTypedDto<ElectricalHeatingCalculation> MapToOrchestrationInstanceOfElectricalHeating(
        OrchestrationInstanceTypedDto input) =>
        new(
            input.Id,
            input.Lifecycle,
            input.Steps,
            input.CustomState,
            new ElectricalHeatingCalculation());
}
