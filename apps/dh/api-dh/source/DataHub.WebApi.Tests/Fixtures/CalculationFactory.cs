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

using System;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using NodaTime;
using CalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public static class CalculationFactory
{
    private static CalculationInputV1 calculation = new(
        CalculationType.Aggregation,
        [],
        Instant.FromUtc(2024, 12, 3, 23, 0, 0).ToDateTimeUtc(),
        Instant.FromUtc(2024, 12, 20, 23, 0, 0).ToDateTimeUtc();

    public static ICalculationsQueryResultV1 Create(
        OrchestrationInstanceLifecycleState lifecycleState = OrchestrationInstanceLifecycleState.Pending,
        OrchestrationInstanceTerminationState? terminationState = null,
        Guid? id = null,
        string[]? gridAreaCodes = null,
        CalculationExecutionType executionType = CalculationExecutionType.External) =>
        OrchestrationInstanceFactory.CreateOrchestrationInstance(
            calculation with { ExecutionType = executionType, GridAreaCodes = gridAreaCodes ?? [] },
            lifecycleState,
            terminationState,
            [
                CreateCalculateStep(MapStateToStepLifecycle(lifecycleState, terminationState)),
                executionType == CalculationExecutionType.External
                    ? CreateEnqueueStep(CreateStepLifecycle(StepInstanceLifecycleState.Pending))
                    : CreateEnqueueStep(
                        CreateStepLifecycle(
                            StepInstanceLifecycleState.Terminated,
                            StepInstanceTerminationState.Skipped)),
            ],
            id);

    public static ICalculationsQueryResultV1 CreateEnqueuing(
        OrchestrationInstanceLifecycleState lifecycleState = OrchestrationInstanceLifecycleState.Running,
        OrchestrationInstanceTerminationState? terminationState = null,
        string[]? gridAreaCodes = null) =>
        OrchestrationInstanceFactory.CreateOrchestrationInstance(
            CreateCalculation(gridAreaCodes),
            lifecycleState,
            terminationState,
            [
                CreateCalculateStep(
                    CreateStepLifecycle(
                        StepInstanceLifecycleState.Terminated,
                        StepInstanceTerminationState.Succeeded)),
                CreateEnqueueStep(MapStateToStepLifecycle(lifecycleState, terminationState))
            ]);

    private static StepInstanceLifecycleDto MapStateToStepLifecycle(
        OrchestrationInstanceLifecycleState lifecycleState,
        OrchestrationInstanceTerminationState? terminationState) =>
        lifecycleState switch
        {
            OrchestrationInstanceLifecycleState.Pending or
            OrchestrationInstanceLifecycleState.Queued =>
                CreateStepLifecycle(StepInstanceLifecycleState.Pending, null),
            OrchestrationInstanceLifecycleState.Running =>
                CreateStepLifecycle(StepInstanceLifecycleState.Running, null),
            OrchestrationInstanceLifecycleState.Terminated => terminationState switch
            {
                OrchestrationInstanceTerminationState.UserCanceled =>
                    CreateStepLifecycle(StepInstanceLifecycleState.Pending, null),
                OrchestrationInstanceTerminationState.Succeeded =>
                    CreateStepLifecycle(
                        StepInstanceLifecycleState.Terminated,
                        StepInstanceTerminationState.Succeeded),
                OrchestrationInstanceTerminationState.Failed =>
                    CreateStepLifecycle(
                        StepInstanceLifecycleState.Terminated,
                        StepInstanceTerminationState.Failed),
            },
        };

    private static StepInstanceLifecycleDto CreateStepLifecycle(
        StepInstanceLifecycleState lifecycleState,
        StepInstanceTerminationState? terminationState = null) =>
        new StepInstanceLifecycleDto(
            lifecycleState,
            terminationState,
            lifecycleState == StepInstanceLifecycleState.Pending ? null : DateTimeOffset.Now,
            lifecycleState != StepInstanceLifecycleState.Terminated ? null : DateTimeOffset.Now);

    private static StepInstanceDto CreateCalculateStep(StepInstanceLifecycleDto lifecycle) =>
        new StepInstanceDto(
            new("a246b5a3-4a06-42f4-877e-1e1122f092d0"),
            lifecycle,
            "TestCalculationStep",
            1,
            string.Empty);

    private static StepInstanceDto CreateEnqueueStep(StepInstanceLifecycleDto lifecycle) =>
        new StepInstanceDto(
            new("e2d18a00-77d0-4160-bbda-10b6b6f309d2"),
            lifecycle,
            "TestEnqueueStep",
            2,
            string.Empty);

    private static CalculationInputV1 CreateCalculation(string[]? gridAreaCodes = null) =>
        new(
            Guid.NewGuid(),
#pragma warning disable SA1118
            new OrchestrationInstanceLifecycleDto(
                null!,
                OrchestrationInstanceLifecycleState.Terminated,
                OrchestrationInstanceTerminationState.Succeeded,
                null,
                DateTimeOffset.UtcNow,
                null,
                null,
                null,
                null),
#pragma warning restore SA1118
            [],
            string.Empty,
            new CalculationInputV1(
                CalculationType: CalculationType.BalanceFixing,
                IsInternalCalculation: false,
                GridAreaCodes: gridAreaCodes ?? ["003"],
                PeriodStartDate: Instant.FromUtc(2024, 12, 3, 23, 0, 0).ToDateTimeUtc(),
                PeriodEndDate: Instant.FromUtc(2024, 12, 20, 23, 0, 0).ToDateTimeUtc().AddDays(30)));
}
