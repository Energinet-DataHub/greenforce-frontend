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
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using HotChocolate.Subscriptions;
using Microsoft.FeatureManagement;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<Guid> CreateCalculationAsync(
        CalculationExecutionType executionType,
        Interval period,
        string[] gridAreaCodes,
        CalculationType calculationType,
        DateTimeOffset? scheduledAt,
        [Service] IFeatureManager featureManager,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IWholesaleOrchestrationsClient client,
        [Service] ITopicEventSender sender,
        CancellationToken cancellationToken)
    {
        if (!period.HasEnd || !period.HasStart)
        {
            throw new Exception("Period cannot be open-ended");
        }

        Guid calculationId;
        var useProcessManager = await featureManager.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager));
        if (useProcessManager)
        {
            var userIdentity = httpContextAccessor.CreateUserIdentity();

            var command = new ScheduleCalculationCommandV1(
                userIdentity,
                runAt: scheduledAt ?? DateTimeOffset.UtcNow,
                inputParameter: new NotifyAggregatedMeasureDataInputV1(
                    CalculationType: calculationType.MapToCalculationType(),
                    GridAreaCodes: gridAreaCodes,
                    PeriodStartDate: period.Start.ToDateTimeOffset(),
                    PeriodEndDate: period.End.ToDateTimeOffset(),
                    IsInternalCalculation: executionType == CalculationExecutionType.Internal));

            calculationId = await processManagerClient.ScheduleNewOrchestrationInstanceAsync(command, cancellationToken);
        }
        else
        {
            var requestDto = new StartCalculationRequestDto(
                StartDate: period.Start.ToDateTimeOffset(),
                EndDate: period.End.ToDateTimeOffset(),
                ScheduledAt: scheduledAt ?? DateTimeOffset.UtcNow,
                GridAreaCodes: gridAreaCodes,
                CalculationType: calculationType,
                IsInternalCalculation: executionType == CalculationExecutionType.Internal);

            calculationId = await client.StartCalculationAsync(requestDto, cancellationToken);
        }

        await sender.SendAsync(nameof(CreateCalculationAsync), calculationId, cancellationToken);

        return calculationId;
    }

    public async Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        [Service] IFeatureManager featureManager,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IProcessManagerClient processManagerClient,
        [Service] IWholesaleOrchestrationsClient client,
        CancellationToken cancellationToken)
    {
        var useProcessManager = await featureManager.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager));
        if (useProcessManager)
        {
            var userIdentity = httpContextAccessor.CreateUserIdentity();

            var command = new CancelScheduledOrchestrationInstanceCommand(
                userIdentity,
                id: calculationId);
            await processManagerClient.CancelScheduledOrchestrationInstanceAsync(command, cancellationToken);
        }
        else
        {
            var requestDto = new CancelScheduledCalculationRequestDto(calculationId);
            await client.CancelScheduledCalculationAsync(requestDto, cancellationToken);
        }

        return true;
    }
}
