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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;

/// <inheritdoc/>
internal class ProcessManagerClientAdapter(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient processManagerClient)
        : IProcessManagerClientAdapter
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IProcessManagerClient _processManagerClient = processManagerClient;

    /// <inheritdoc/>
    public async Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(
        CalculationQueryInput input,
        CancellationToken cancellationToken = default)
    {
        var states = input.States ?? [];
        var calculationTypes = input.CalculationTypes ?? [];
        var processManagerCalculationTypes = calculationTypes
            .Select(x => x.MapToCalculationType())
            .ToList();

        var isInternal = input.ExecutionType == CalculationExecutionType.Internal;
        var minExecutionTime = input.ExecutionTime?.HasStart == true ? input.ExecutionTime?.Start.ToDateTimeOffset() : null;
        var maxExecutionTime = input.ExecutionTime?.HasEnd == true ? input.ExecutionTime?.End.ToDateTimeOffset() : null;
        var periodStart = input.Period?.Start.ToDateTimeOffset();
        var periodEnd = input.Period?.End.ToDateTimeOffset();

        // TODO:
        // In the Process Manager API we currently only support filtering on one state initially,
        // and only top-level states (orchestration instance states, not steps).
        // To ensure filtering works the same as before we therefore set 'lifecycleState' and 'terminationState'
        // to 'null'.
        // In the future we should be able to refactor the UI/BFF to filter at top-level states using
        // the Process Manager API.
        var userIdentity = _httpContextAccessor.CreateUserIdentity();
        var customQuery = new CalculationQuery(userIdentity)
        {
            StartedAtOrLater = minExecutionTime,
            TerminatedAtOrEarlier = maxExecutionTime,
            CalculationTypes = processManagerCalculationTypes,
            GridAreaCodes = input.GridAreaCodes,
            PeriodStartDate = periodStart,
            PeriodEndDate = periodEnd,
            IsInternalCalculation = isInternal,
        };
        var processManagerCalculations = await _processManagerClient.SearchOrchestrationInstancesByNameAsync(
            customQuery,
            cancellationToken);

        var calculations = processManagerCalculations
            .Select(x => x.OrchestrationInstance.MapToV3CalculationDto());

        return calculations
            .OrderByDescending(x => x.ScheduledAt)
            .Where(x => states.Length == 0 || states.Contains(x.OrchestrationState));
    }

    /// <inheritdoc/>
    public async Task<CalculationDto> GetCalculationAsync(
        Guid calculationId,
        CancellationToken cancellationToken = default)
    {
        var userIdentity = _httpContextAccessor.CreateUserIdentity();

        var instanceDto = await _processManagerClient.GetOrchestrationInstanceByIdAsync<CalculationInputV1>(
            new GetOrchestrationInstanceByIdQuery(
                userIdentity,
                id: calculationId),
            cancellationToken);

        return instanceDto.MapToV3CalculationDto();
    }
}
