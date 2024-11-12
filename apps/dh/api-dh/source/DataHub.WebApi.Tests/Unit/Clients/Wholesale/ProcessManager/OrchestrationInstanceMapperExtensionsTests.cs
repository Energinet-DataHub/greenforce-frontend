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
using Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;
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
        var orchestrationInstanceDto = OrchestrationInstanceDtoFactory.CreateTypedDtoMatchingCalculationDto(
            orchestrationInstanceId: Guid.NewGuid(),
            ["003", "001", "002"]);

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
}
