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
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;

public class CalculationsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client)
    : ICalculationsClient
{
    public async Task<IEnumerable<IOrchestrationInstanceTypedDto<CalculationInputV1>>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var customQuery = new CalculationQuery(userIdentity)
        {
            LifecycleState = input.State?.ToOrchestrationInstanceLifecycleState(),
            TerminationState = input.State?.ToOrchestrationInstanceTerminationState(),
            CalculationTypes = input.CalculationTypes,
            GridAreaCodes = input.GridAreaCodes,
            PeriodStartDate = input.Period?.Start.ToDateTimeOffset(),
            PeriodEndDate = input.Period?.End.ToDateTimeOffset(),
            IsInternalCalculation = input.ExecutionType == CalculationExecutionType.Internal,
            // TODO: If input.State == ProcessState.Scheduled, then we should also filter
            // by ScheduledToRunAt(OrLater). This is not yet supported in the custom query.
        };

        var x = await client.SearchOrchestrationInstancesByCustomQueryAsync(customQuery, ct);
        return x.Select(x => x.OrchestrationInstance);
    }

    public async Task<IOrchestrationInstanceTypedDto<CalculationInputV1>> GetCalculationByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        return await client.GetOrchestrationInstanceByIdAsync<CalculationInputV1>(
            new GetOrchestrationInstanceByIdQuery(userIdentity, id),
            ct);
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
}
