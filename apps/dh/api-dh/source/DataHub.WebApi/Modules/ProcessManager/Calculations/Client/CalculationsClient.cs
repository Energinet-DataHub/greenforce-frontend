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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_021.ElectricalHeatingCalculation;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using Energinet.DataHub.WebApi.Modules.RevisionLog;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Models;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;

public class CalculationsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client,
    IRevisionLogClient revisionLogClient)
    : ICalculationsClient
{
    private readonly IRevisionLogClient _revisionLogClient = revisionLogClient;

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

        var includeWholesaleAndEnergyCalculations = input.CalculationTypes?
            .Any(x => x != CalculationType.ElectricalHeating) ?? true;

        var includeElectricalHeatingCalculations = input switch
        {
            { ExecutionType: CalculationExecutionType.Internal } => false,
            { GridAreaCodes: { Length: > 0 } } => false,
            { Period: not null } => false,
            { CalculationTypes: { Length: > 0 } } => input.CalculationTypes.Contains(CalculationType.ElectricalHeating),
            _ => true,
        };

        var result = new List<IOrchestrationInstanceTypedDto<ICalculation>>();

        if (includeWholesaleAndEnergyCalculations)
        {
            var calculationTypes = input.CalculationTypes?.Where(x => x != CalculationType.ElectricalHeating);
            var query = new CalculationQuery(userIdentity)
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

            var calculations = (await client.SearchOrchestrationInstancesByCustomQueryAsync(query, ct))
                .Select(x => MapToOrchestrationInstanceOfWholesaleAndEnergyCalculation(x.OrchestrationInstance))
                .ToList();

            await _revisionLogClient.LogAsync(
                RevisionLogActivity.SearchCalculation,
                GetRequestUrl(),
                query,
                RevisionLogEntityType.Calculation,
                null);

            result.AddRange(calculations);
        }

        if (includeElectricalHeatingCalculations)
        {
            var query = new SearchOrchestrationInstancesByNameQuery(
                userIdentity,
                Brs_021_ElectricalHeatingCalculation.Name,
                null,
                lifecycleStates,
                terminationState,
                null,
                null,
                null);

            var electricalHeatingCalculations = await client.SearchOrchestrationInstancesByNameAsync(query, ct);

            await _revisionLogClient.LogAsync(
                RevisionLogActivity.SearchCalculation,
                GetRequestUrl(),
                query,
                RevisionLogEntityType.Calculation,
                null);

            result.AddRange(electricalHeatingCalculations.Select(MapToOrchestrationInstanceOfElectricalHeating));
        }

        return result;
    }

    public async Task<IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>>> GetNonTerminatedCalculationsAsync(
        CancellationToken ct = default)
    {
        var result = new List<IOrchestrationInstanceTypedDto<ICalculation>>();
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var lifecycleStates = new[]
        {
            OrchestrationInstanceLifecycleState.Pending,
            OrchestrationInstanceLifecycleState.Queued,
            OrchestrationInstanceLifecycleState.Running,
        };

        // Wholesale and energy calculations
        {
            var query = new CalculationQuery(userIdentity) { LifecycleStates = lifecycleStates };
            var calculations = (await client.SearchOrchestrationInstancesByCustomQueryAsync(query, ct))
                .Select(x => MapToOrchestrationInstanceOfWholesaleAndEnergyCalculation(x.OrchestrationInstance));

            await _revisionLogClient.LogAsync(
                RevisionLogActivity.SearchCalculation,
                GetRequestUrl(),
                query,
                RevisionLogEntityType.Calculation,
                null);

            result.AddRange(calculations);
        }

        // Electrical heating calculations
        {
            var query = new SearchOrchestrationInstancesByNameQuery(
                userIdentity,
                Brs_021_ElectricalHeatingCalculation.Name,
                null,
                lifecycleStates,
                null,
                null,
                null,
                null);

            var calculations = (await client.SearchOrchestrationInstancesByNameAsync(query, ct))
                .Select(MapToOrchestrationInstanceOfElectricalHeating);

            await _revisionLogClient.LogAsync(
                RevisionLogActivity.SearchCalculation,
                GetRequestUrl(),
                query,
                RevisionLogEntityType.Calculation,
                null);

            result.AddRange(calculations);
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

        await _revisionLogClient.LogAsync(
            RevisionLogActivity.GetCalculation,
            GetRequestUrl(),
            id,
            RevisionLogEntityType.Calculation,
            null);

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
        Guid orchestrationId;

        if (runAt == null)
        {
            orchestrationId = await client.StartNewOrchestrationInstanceAsync(
                new StartCalculationCommandV1(userIdentity, input),
                ct);
            await _revisionLogClient.LogAsync(
                RevisionLogActivity.StartNewCalculation,
                GetRequestUrl(),
                input,
                RevisionLogEntityType.Calculation,
                orchestrationId);
        }
        else
        {
            orchestrationId = await client.ScheduleNewOrchestrationInstanceAsync(
                new ScheduleCalculationCommandV1(userIdentity, input, runAt.Value),
                ct);
            await _revisionLogClient.LogAsync(
                RevisionLogActivity.ScheduleCalculation,
                GetRequestUrl(),
                input,
                RevisionLogEntityType.Calculation,
                orchestrationId);
        }

        return orchestrationId;
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

        await _revisionLogClient.LogAsync(
            RevisionLogActivity.CancelScheduledCalculation,
            GetRequestUrl(),
            command,
            RevisionLogEntityType.Calculation,
            calculationId);

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

    private string GetRequestUrl()
    {
        var request = httpContextAccessor.HttpContext?.Request;
        if (request == null)
        {
            return "Request is not available";
        }

        return $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
    }
}
