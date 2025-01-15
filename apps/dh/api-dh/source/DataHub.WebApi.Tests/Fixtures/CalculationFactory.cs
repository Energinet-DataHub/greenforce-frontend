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
using System.Collections.Generic;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public static class CalculationFactory
{
    private static CalculationInputV1 calculation =
        new CalculationInputV1(
            CalculationType.Aggregation,
            [],
            new(2024, 12, 3, 23, 0, 0, TimeSpan.Zero),
            new(2024, 12, 20, 23, 0, 0, TimeSpan.Zero),
            false);

    public static OrchestrationInstanceTypedDto<CalculationInputV1> Create(
        OrchestrationInstanceLifecycleState lifecycleState = OrchestrationInstanceLifecycleState.Pending,
        OrchestrationInstanceTerminationState? terminationState = null,
        Guid? id = null,
        string[]? gridAreaCodes = null,
        bool isInternalCalculation = false)
    {
        List<StepInstanceDto> steps = [
            CreateCalculateStep(MapStateToStepLifecycle(lifecycleState, terminationState)),
        ];

        if (!isInternalCalculation)
        {
            steps.Add(CreateEnqueueStep(CreateStepLifecycle(StepInstanceLifecycleState.Pending)));
        }

        return OrchestrationInstanceFactory.CreateOrchestrationInstance(
            calculation with { IsInternalCalculation = isInternalCalculation, GridAreaCodes = gridAreaCodes ?? [] },
            lifecycleState,
            terminationState,
            steps.ToArray(),
            id);
    }

    public static OrchestrationInstanceTypedDto<CalculationInputV1> CreateEnqueuing(
        OrchestrationInstanceLifecycleState lifecycleState = OrchestrationInstanceLifecycleState.Running,
        OrchestrationInstanceTerminationState? terminationState = null,
        string[]? gridAreaCodes = null) =>
            OrchestrationInstanceFactory.CreateOrchestrationInstance(
                calculation with { GridAreaCodes = gridAreaCodes ?? [] },
                lifecycleState,
                terminationState,
                [
                    CreateCalculateStep(
                        CreateStepLifecycle(
                            StepInstanceLifecycleState.Terminated,
                            OrchestrationStepTerminationState.Succeeded)),
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
                            OrchestrationStepTerminationState.Succeeded),
                    OrchestrationInstanceTerminationState.Failed =>
                        CreateStepLifecycle(
                            StepInstanceLifecycleState.Terminated,
                            OrchestrationStepTerminationState.Failed),
                },
            };

    private static StepInstanceLifecycleDto CreateStepLifecycle(
        StepInstanceLifecycleState lifecycleState,
        OrchestrationStepTerminationState? terminationState = null) =>
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
}
