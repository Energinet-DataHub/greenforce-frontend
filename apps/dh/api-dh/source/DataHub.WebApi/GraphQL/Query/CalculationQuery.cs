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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.ProcessManager.Api.Model;
using Energinet.DataHub.ProcessManager.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;
using Energinet.DataHub.WebApi.GraphQL.Types.Request;
using Microsoft.FeatureManagement;
using NodaTime;
using CalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<CalculationDto> GetCalculationByIdAsync(
        Guid id,
        [Service] IFeatureManager featureManager,
        [Service] IProcessManagerClientAdapter processManagerCalculationClient,
        [Service] IWholesaleClient_V3 wholesaleClient)
    {
        var useProcessManager = await featureManager.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager));
        return useProcessManager
            ? await processManagerCalculationClient.GetCalculationAsync(id)
            : await wholesaleClient.GetCalculationAsync(id);
    }

    [UsePaging]
    [UseSorting]
    public async Task<IEnumerable<CalculationDto>> GetCalculationsAsync(
        CalculationQueryInput input,
        string? filter,
        [Service] IFeatureManager featureManager,
        [Service] IProcessManagerClientAdapter processManagerCalculationClient,
        [Service] IWholesaleClient_V3 wholesaleClient)
    {
        var useProcessManager = await featureManager.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager));

        if (string.IsNullOrWhiteSpace(filter))
        {
            return useProcessManager
                ? await processManagerCalculationClient.QueryCalculationsAsync(input)
                : await wholesaleClient.QueryCalculationsAsync(input);
        }

        try
        {
            var calculationId = Guid.Parse(filter);
            var calculation = useProcessManager
                ? await processManagerCalculationClient.GetCalculationAsync(calculationId)
                : await wholesaleClient.GetCalculationAsync(calculationId);

            return [calculation];
        }
        catch (Exception)
        {
            return [];
        }
    }

    [GraphQLDeprecated("Use `latestCalculation` instead")]
    public async Task<CalculationDto?> GetLatestBalanceFixingAsync(
        Interval period,
        [Service] IWholesaleClient_V3 wholesaleClient)
    {
        var input = new CalculationQueryInput
        {
            Period = period,
            CalculationTypes = [Clients.Wholesale.v3.CalculationType.BalanceFixing],
            States = [CalculationOrchestrationState.Completed],
        };

        var calculations = await wholesaleClient.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault();
    }

    public async Task<CalculationDto?> GetLatestCalculationAsync(
        Interval period,
        Clients.Wholesale.v3.CalculationType calculationType,
        [Service] IFeatureManager featureManager,
        [Service] IProcessManagerClientAdapter processManagerCalculationClient,
        [Service] IWholesaleClient_V3 wholesaleClient)
    {
        var useProcessManager = await featureManager.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager));

        var input = new CalculationQueryInput
        {
            Period = period,
            CalculationTypes = [calculationType],
            States = [CalculationOrchestrationState.Completed],
        };

        var calculations = useProcessManager
            ? await processManagerCalculationClient.QueryCalculationsAsync(input)
            : await wholesaleClient.QueryCalculationsAsync(input);

        return calculations.FirstOrDefault();
    }

    [UsePaging]
    [UseSorting]
    public async Task<IEnumerable<IOrchestration<IRequest>>> GetRequestsAsync()
    {
        var result = new OrchestrationInstanceTypedDto<RequestAggregatedMeasureData>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("5ff81160-507e-41e5-4846-08dc53cca56b"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Terminated,
                OrchestrationInstanceTerminationStates.Succeeded,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            new RequestAggregatedMeasureData(
                CalculationType.Aggregation,
                DateTimeOffset.Parse("2024-02-01"),
                DateTimeOffset.Parse("2024-02-29"),
                MeteringPointType.Production),
            [],
            string.Empty);

        var result2 = new OrchestrationInstanceTypedDto<RequestAggregatedMeasureData>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("0aa6f1d2-6294-45d5-2dcc-08dc11e27f05"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Terminated,
                OrchestrationInstanceTerminationStates.Failed,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            new RequestAggregatedMeasureData(
                CalculationType.Aggregation,
                DateTimeOffset.Parse("2024-01-14"),
                DateTimeOffset.Parse("2024-01-15"),
                MeteringPointType.NonProfiledConsumption),
            [],
            string.Empty);

        var result3 = new OrchestrationInstanceTypedDto<RequestWholesaleSettlement>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("0aa6f1d2-6294-45d5-2dcc-08dc11e27f05"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Running,
                null,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            new RequestWholesaleSettlement(
                CalculationType.BalanceFixing,
                DateTimeOffset.Parse("2024-01-14"),
                DateTimeOffset.Parse("2024-01-15"),
                PriceType.MonthlyFee),
            [],
            string.Empty);

        var wrapper = new OrchestrationInstance<RequestAggregatedMeasureData>(
            result.Id,
            result.Lifecycle,
            result.Steps,
            result.ParameterValue);

        var wrapper2 = new OrchestrationInstance<RequestAggregatedMeasureData>(
            result2.Id,
            result2.Lifecycle,
            result2.Steps,
            result2.ParameterValue);

        var wrapper3 = new OrchestrationInstance<RequestWholesaleSettlement>(
            result3.Id,
            result3.Lifecycle,
            result3.Steps,
            result3.ParameterValue);

        var list = new List<IOrchestration<IRequest>> { wrapper, wrapper2, wrapper3 };

        return await Task.FromResult(list);
    }
}
