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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Services.Rules;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Services;

[UnitTest]
public sealed class AllowedGridAreasRuleServiceTests
{
    [Theory]
    [InlineData(EicFunction.GridAccessProvider)]
    [InlineData(EicFunction.MeterAdministrator)]
    [InlineData(EicFunction.MeterOperator)]
    [InlineData(EicFunction.MeteredDataCollector)]
    [InlineData(EicFunction.PartyConnectedToTheGrid)]
    public void ValidateGridAreas_LimitGridAreas_ThrowException(EicFunction eicFunction)
    {
        // Arrange
        var target = new AllowedGridAreasRuleService();

        var gridAreas = new[]
        {
            new GridAreaId(Guid.NewGuid()),
            new GridAreaId(Guid.NewGuid())
        };

        // Act + Assert
        Assert.Throws<ValidationException>(() =>
            target.ValidateGridAreas(new[] { new ActorMarketRole(eicFunction, gridAreas.Select(e => new ActorGridArea(e.Value, Enumerable.Empty<MeteringPointType>()))) }));
    }

    [Theory]
    [InlineData(EicFunction.GridAccessProvider)]
    [InlineData(EicFunction.MeterAdministrator)]
    [InlineData(EicFunction.MeterOperator)]
    [InlineData(EicFunction.MeteredDataCollector)]
    [InlineData(EicFunction.PartyConnectedToTheGrid)]
    public void ValidateGridAreas_OneGridArea_DoesNothing(EicFunction eicFunction)
    {
        // Arrange
        var target = new AllowedGridAreasRuleService();

        var gridAreas = new[]
        {
            new GridAreaId(Guid.NewGuid())
        };

        // Act + Assert
        target.ValidateGridAreas(new[] { new ActorMarketRole(eicFunction, gridAreas.Select(e => new ActorGridArea(e.Value, Enumerable.Empty<MeteringPointType>()))) });
    }

    [Theory]
    [InlineData(EicFunction.Agent)]
    public void ValidateGridAreas_NoLimitGridAreas_DoesNothing(EicFunction eicFunction)
    {
        // Arrange
        var target = new AllowedGridAreasRuleService();

        var gridAreas = new[]
        {
            new GridAreaId(Guid.NewGuid()),
            new GridAreaId(Guid.NewGuid())
        };

        // Act + Assert
        target.ValidateGridAreas(new[] { new ActorMarketRole(eicFunction, gridAreas.Select(e => new ActorGridArea(e.Value, Enumerable.Empty<MeteringPointType>()))) });
    }
}
