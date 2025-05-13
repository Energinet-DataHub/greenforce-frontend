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
using System.Linq;
using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Client.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Extensions;

public class MeasurementDtoExtensionsTests
{
    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_StandardDay_Returns96Positions()
    {
        // Arrange
        // A standard day
        var date = new LocalDate(2025, 5, 1);
        var positions = CreateQuarterHourlyPositions(date.ToUtcDateTimeOffset(), 2);

        // Act
        var result = positions.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(96, result.Count());
        Assert.All(result, position =>
        {
            Assert.NotNull(position);
            Assert.NotNull(position.MeasurementPoints);
        });
    }

    [Fact]
    public void EnsureCompletePositions_HourlyData_DSTSpringForward_Returns23Positions()
    {
        // Arrange
        // DST Spring Forward
        var date = new LocalDate(2025, 3, 30);
        var positions = CreateHourlyPositions(date.ToUtcDateTimeOffset(), 2);

        // Act
        var result = positions.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(23, result.Count());
    }

    [Fact]
    public void EnsureCompletePositions_HourlyData_DSTFallBack_Returns25Positions()
    {
        // Arrange
        var date = new LocalDate(2025, 10, 26); // DST Fall Back
        var positions = CreateHourlyPositions(date.ToUtcDateTimeOffset(), 2);

        // Act
        var result = positions.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(25, result.Count());
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_MissingPositions_FillsGaps()
    {
        // Arrange
        var date = new LocalDate(2025, 5, 1); // A standard day
        var positions = new List<MeasurementPositionDto>
            {
                new MeasurementPositionDto(1, date.ToUtcDateTimeOffset(), new List<MeasurementPointDto> { new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.QuarterHourly, date.ToUtcDateTimeOffset().AddMinutes(60), date.ToUtcDateTimeOffset().AddMinutes(60)) }),
                new MeasurementPositionDto(4, date.ToUtcDateTimeOffset().AddMinutes(60), new List<MeasurementPointDto> { new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.QuarterHourly, date.ToUtcDateTimeOffset().AddMinutes(60), date.ToUtcDateTimeOffset().AddMinutes(60)) }),
            };

        // Act
        var result = positions.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(96, result.Count());
        // Verify original positions are preserved
        var position0 = result.FirstOrDefault(p => p.Index == 1);
        var position4 = result.FirstOrDefault(p => p.Index == 4);
        Assert.NotNull(position0);
        Assert.NotNull(position4);
        Assert.Equal(date.ToUtcDateTimeOffset(), position0.ObservationTime);
        Assert.Equal(date.ToUtcDateTimeOffset().AddMinutes(45), position4.ObservationTime);

        // Verify filled gaps have correct observation times
        var position2 = result.FirstOrDefault(p => p.Index == 2);
        var position3 = result.FirstOrDefault(p => p.Index == 3);
        Assert.NotNull(position2);
        Assert.NotNull(position3);
        Assert.Equal(date.ToUtcDateTimeOffset().AddMinutes(15), position2.ObservationTime);
        Assert.Equal(date.ToUtcDateTimeOffset().AddMinutes(30), position3.ObservationTime);
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_DSTSpringForward_Returns92Positions()
    {
        // Arrange
        var date = new LocalDate(2025, 3, 30); // DST Spring Forward
        var positions = CreateQuarterHourlyPositions(date.ToUtcDateTimeOffset(), 2); // Updated to use ToUtcDateTimeOffset()

        // Act
        var result = positions.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(92, result.Count());
        Assert.All(result, position =>
        {
            Assert.NotNull(position);
            Assert.NotNull(position.MeasurementPoints);
        });
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_DSTFallBack_Returns100Positions()
    {
        // Arrange
        var date = new LocalDate(2025, 10, 26); // DST Fall Back
        var position = CreateQuarterHourlyPositions(date.ToUtcDateTimeOffset(), 2); // Updated to use ToUtcDateTimeOffset()

        // Act
        var result = position.EnsureCompletePositions(date).ToList();

        // Assert
        Assert.Equal(100, result.Count());
        Assert.All(result, position =>
        {
            Assert.NotNull(position);
            Assert.NotNull(position.MeasurementPoints);
        });
    }

    #region Helper Methods

    private static List<MeasurementPositionDto> CreateQuarterHourlyPositions(DateTimeOffset date, int count)
    {
        var positions = new List<MeasurementPositionDto>();

        for (int i = 0; i < count; i++)
        {
            positions.Add(new MeasurementPositionDto(
                i,
                date.AddMinutes(i * 15),
                new List<MeasurementPointDto>
                {
                    new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.QuarterHourly, date.AddMinutes(60), date.AddMinutes(60)),
                }));
        }

        return positions;
    }

    private static List<MeasurementPositionDto> CreateHourlyPositions(DateTimeOffset date, int count)
    {
        var positions = new List<MeasurementPositionDto>();

        for (int i = 0; i < count; i++)
        {
            positions.Add(new MeasurementPositionDto(
                i,
                date.AddHours(i),
                new List<MeasurementPointDto>
                {
                    new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.Hourly, date.AddMinutes(60), date.AddMinutes(60)),
                }));
        }

        return positions;
    }

    #endregion
}
