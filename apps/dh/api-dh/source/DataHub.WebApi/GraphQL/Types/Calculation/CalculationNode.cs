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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Calculation2;

[ObjectType<OrchestrationInstance<CalculationInputV1>>]
public static partial class CalculationNode
{
    [Query]
    public static async Task<IOrchestrationInstance<CalculationInputV1>> GetCalculationById2Async(
        Guid id,
        IHttpContextAccessor httpContext,
        IProcessManagerClient client,
        CancellationToken ct)
    {
        var userIdentity = httpContext.CreateUserIdentity();
        var result = await client.GetOrchestrationInstanceByIdAsync<CalculationInputV1>(
            new GetOrchestrationInstanceByIdQuery(userIdentity, id),
            ct);

        return result.ToOrchestrationInstance();
    }

    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] OrchestrationInstance<CalculationInputV1> f,
        GridAreaByCodeBatchDataLoader dataLoader,
        CancellationToken ct) => await Task
            .WhenAll(f.ParameterValue.GridAreaCodes.Select(c => dataLoader.LoadRequiredAsync(c)))
            .Then(x => x.OrderBy(g => g.Code));

    static partial void Configure(
        IObjectTypeDescriptor<OrchestrationInstance<CalculationInputV1>> descriptor)
    {
        descriptor
            .Name("Calculation2")
            .BindFieldsExplicitly()
            .Implements<OrchestrationInstanceType<CalculationInputV1>>();

        descriptor.Field(f => f.ParameterValue.CalculationType);

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
