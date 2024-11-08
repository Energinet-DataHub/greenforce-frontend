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
using AutoFixture;
using Energinet.DataHub.ProcessManager.Api.Model;
using Energinet.DataHub.ProcessManager.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Processes.BRS_023_027.V1.Model;

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public static class OrchestrationInstanceDtoFactory
{
    /// <summary>
    /// Initial factory method which exposes what we need at the momemt.
    /// Might have to be refactored into a builder pattern.
    /// </summary>
    public static OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1> CreateTypedDto(
        Guid orchestrationInstanceId,
        IReadOnlyCollection<string>? gridAreaCodes)
    {
        var fixture = new Fixture();

        var lifecycle = new OrchestrationInstanceLifecycleStatesDto(
                State: OrchestrationInstanceLifecycleStates.Pending,
                TerminationState: null,
                CreatedAt: fixture.Create<DateTimeOffset>(),
                ScheduledToRunAt: null,
                QueuedAt: null,
                StartedAt: null,
                TerminatedAt: null);

        var parameterValue = new NotifyAggregatedMeasureDataInputV1(
                CalculationType: fixture.Create<CalculationTypes>(),
                GridAreaCodes: gridAreaCodes ?? [],
                PeriodStartDate: fixture.Create<DateTimeOffset>(),
                PeriodEndDate: fixture.Create<DateTimeOffset>(),
                IsInternalCalculation: fixture.Create<bool>());

        var steps = new List<OrchestrationStepDto>
        {
            new OrchestrationStepDto(
                Id: fixture.Create<Guid>(),
                Lifecycle: new OrchestrationStepLifecycleStateDto(
                    State: OrchestrationStepLifecycleStates.Pending,
                    TerminationState: null,
                    CreatedAt: fixture.Create<DateTimeOffset>(),
                    StartedAt: null,
                    TerminatedAt: null),
                Description: "Beregning",
                Sequence: 0,
                DependsOn: null,
                CustomState: string.Empty),
            new OrchestrationStepDto(
                Id: fixture.Create<Guid>(),
                Lifecycle: new OrchestrationStepLifecycleStateDto(
                    State: OrchestrationStepLifecycleStates.Pending,
                    TerminationState: null,
                    CreatedAt: fixture.Create<DateTimeOffset>(),
                    StartedAt: null,
                    TerminatedAt: null),
                Description: "Besked dannelse",
                Sequence: 1,
                DependsOn: null,
                CustomState: string.Empty),
        };

        return new OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1>(
            Id: orchestrationInstanceId,
            Lifecycle: lifecycle,
            ParameterValue: parameterValue,
            Steps: steps,
            CustomState: string.Empty);
    }
}
