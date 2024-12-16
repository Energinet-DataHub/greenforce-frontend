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

using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using HotChocolate.Authorization;
using Microsoft.FeatureManagement;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
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
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
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

    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
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
}
