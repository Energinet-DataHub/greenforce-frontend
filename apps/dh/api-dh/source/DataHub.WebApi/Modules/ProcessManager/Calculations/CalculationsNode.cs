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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Common.DataLoaders;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Types;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations;

[ObjectType<OrchestrationInstance<CalculationInputV1>>]
public static partial class CalculationNode
{
    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static Task<IOrchestrationInstance<CalculationInputV1>> GetCalculationByIdAsync(
        Guid id,
        ICalculationsClient client) => client.GetCalculationByIdAsync(id);

    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static Task<IEnumerable<IOrchestrationInstance<CalculationInputV1>>> GetCalculationsAsync(
        CalculationsQueryInput input,
        ICalculationsClient client) => client.QueryCalculationsAsync(input);

    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<IOrchestrationInstance<CalculationInputV1>?> GetLatestCalculationAsync(
        Interval period,
        CalculationType calculationType,
        ICalculationsClient client)
    {
        var input = new CalculationsQueryInput
        {
            Period = period,
            CalculationTypes = [calculationType],
            State = OrchestrationInstanceState.Completed,
        };

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault();
    }

    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] OrchestrationInstance<CalculationInputV1> f,
        GridAreaByCodeBatchDataLoader dataLoader) => (await Task
            .WhenAll(f.ParameterValue.GridAreaCodes.Select(c => dataLoader.LoadRequiredAsync(c))))
            .OrderBy(g => g.Code);

    static partial void Configure(
        IObjectTypeDescriptor<OrchestrationInstance<CalculationInputV1>> descriptor)
    {
        descriptor
            .Name("Calculation")
            .BindFieldsExplicitly()
            .Implements<OrchestrationInstanceType<CalculationInputV1>>();

        descriptor.Field(f => f.ParameterValue.CalculationType.FromBrs_023_027())
            .Name("calculationType");

        descriptor
            .Field(f => new Interval(
                Instant.FromDateTimeOffset(f.ParameterValue.PeriodStartDate),
                Instant.FromDateTimeOffset(f.ParameterValue.PeriodEndDate)))
            .Name("period");

        descriptor
            .Field(f => f.ParameterValue.IsInternalCalculation
                ? CalculationExecutionType.Internal
                : CalculationExecutionType.External)
            .Name("executionType");
    }
}
