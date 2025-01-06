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
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Extensions;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Types;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Enums;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Calculations;

// TODO: Feature flag here for using the "old" wholesale client
public class CalculationsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client)
    : ICalculationsClient
{
    public async Task<IEnumerable<IOrchestrationInstance<CalculationInputV1>>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken ct = default)
    {
        // TODO: Consider defaulting to empty array in record instead?
        var calculationTypes = input.CalculationTypes ?? [];
        var processManagerCalculationTypes = calculationTypes
            .Select(x => x.ToProcessManagerCalculationType())
            .ToList();

        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var customQuery = new CalculationQuery(userIdentity)
        {
            LifecycleState = input.ProgressStatus?.ToLifecycleState(),
            TerminationState = input.ProgressStatus?.ToTerminationState(),
            CalculationTypes = processManagerCalculationTypes,
            GridAreaCodes = input.GridAreaCodes,
            PeriodStartDate = input.Period?.Start.ToDateTimeOffset(),
            PeriodEndDate = input.Period?.End.ToDateTimeOffset(),
            IsInternalCalculation = input.ExecutionType == CalculationExecutionType.Internal,
        };

        var result = await client.SearchOrchestrationInstancesByNameAsync(customQuery, ct);
        return result.Select(x => x.OrchestrationInstance.ToLocalType());
    }

    public async Task<IOrchestrationInstance<CalculationInputV1>> GetCalculationByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var instance = await client.GetOrchestrationInstanceByIdAsync<CalculationInputV1>(
            new GetOrchestrationInstanceByIdQuery(userIdentity, id),
            ct);

        return instance.ToLocalType();
    }
}
