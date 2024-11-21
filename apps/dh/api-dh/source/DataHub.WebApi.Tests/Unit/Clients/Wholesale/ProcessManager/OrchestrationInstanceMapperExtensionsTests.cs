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
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using FluentAssertions.Execution;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Unit.Clients.Wholesale.ProcessManager;

public class OrchestrationInstanceMapperExtensionsTests
{
    [Fact]
    public void When_MapToV3CalculationDto_Then_CalculationDtoContainsExpectedValues()
    {
        // Arrange
        var fixture = new Fixture();
        var parameterValue = OrchestrationInstanceDtoFactory.CreateParameterValue(["003", "001", "002"], fixture);
        var lifecycle = OrchestrationInstanceDtoFactory.CreatePendingLifecycle(fixture);
        var steps = new List<StepInstanceDto>
        {
            OrchestrationInstanceDtoFactory.CreateStepAsPending(fixture, "Beregning", 1),
            OrchestrationInstanceDtoFactory.CreateStepAsPending(fixture, "Besked dannelse", 2),
        };

        var orchestrationInstanceDto = new OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1>(
            Id: fixture.Create<Guid>(),
            Lifecycle: lifecycle,
            ParameterValue: parameterValue,
            Steps: steps,
            CustomState: string.Empty);

        // Act
        var actualDto = orchestrationInstanceDto.MapToV3CalculationDto();

        // Assert
        using var assertionScope = new AssertionScope();

        actualDto.CalculationId.Should().Be(orchestrationInstanceDto.Id);
        // All calculations start as Scheduled in the "old" version
        actualDto.OrchestrationState.Should().Be(WebApi.Clients.Wholesale.v3.CalculationOrchestrationState.Scheduled);

        // Notice we use mapper
        actualDto.CalculationType.MapToCalculationType().Should().Be(orchestrationInstanceDto.ParameterValue.CalculationType);
        actualDto.GridAreaCodes.Should().BeEquivalentTo(orchestrationInstanceDto.ParameterValue.GridAreaCodes);
        actualDto.PeriodStart.Should().Be(orchestrationInstanceDto.ParameterValue.PeriodStartDate);
        actualDto.PeriodEnd.Should().Be(orchestrationInstanceDto.ParameterValue.PeriodEndDate);
        actualDto.IsInternalCalculation.Should().Be(orchestrationInstanceDto.ParameterValue.IsInternalCalculation);
    }

    [Fact]
    public void Given_CalculationStepIsRunning_When_MapToV3OrchestrationState_Then_StateShouldBeCalculating()
    {
        var fixture = new Fixture();

        var parameterValue = OrchestrationInstanceDtoFactory.CreateParameterValue(["001"], fixture);
        var lifecycle = OrchestrationInstanceDtoFactory.CreateRunningLifecycle(fixture);
        var steps = new List<StepInstanceDto>
        {
            OrchestrationInstanceDtoFactory.CreateStepAsRunning(fixture, "Beregning", 1),
            OrchestrationInstanceDtoFactory.CreateStepAsPending(fixture, "Besked dannelse", 2),
        };

        var orchestrationInstanceDto = new OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1>(
            Id: fixture.Create<Guid>(),
            Lifecycle: lifecycle,
            ParameterValue: parameterValue,
            Steps: steps,
            CustomState: string.Empty);

        // Act
        var actualState = orchestrationInstanceDto.MapToV3OrchestrationState();

        // Assert
        actualState.Should().Be(CalculationOrchestrationState.Calculating);
    }

    [Fact]
    public void Given_EnqueueMessagesStepIsRunning_When_MapToV3OrchestrationState_Then_StateShouldBeActorMessagesEnqueuing()
    {
        var fixture = new Fixture();

        var parameterValue = OrchestrationInstanceDtoFactory.CreateParameterValue(["001"], fixture);
        var lifecycle = OrchestrationInstanceDtoFactory.CreateRunningLifecycle(fixture);
        var steps = new List<StepInstanceDto>
        {
            OrchestrationInstanceDtoFactory.CreateStepAsRunning(fixture, "Beregning", 1),
            OrchestrationInstanceDtoFactory.CreateStepAsRunning(fixture, "Besked dannelse", 2),
        };

        var orchestrationInstanceDto = new OrchestrationInstanceTypedDto<NotifyAggregatedMeasureDataInputV1>(
            Id: fixture.Create<Guid>(),
            Lifecycle: lifecycle,
            ParameterValue: parameterValue,
            Steps: steps,
            CustomState: string.Empty);

        // Act
        var actualState = orchestrationInstanceDto.MapToV3OrchestrationState();

        // Assert
        actualState.Should().Be(CalculationOrchestrationState.Calculating);
    }
}
