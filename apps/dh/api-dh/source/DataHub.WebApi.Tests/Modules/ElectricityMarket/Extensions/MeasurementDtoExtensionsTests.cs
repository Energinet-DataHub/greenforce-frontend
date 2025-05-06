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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Extensions;

public class MeasurementDtoExtensionsTests
{
    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_StandardDay_Returns96Positions()
    {
        // Arrange
        // A standard day
        var measurements = new MeasurementDto(CreateQuarterHourlyPositions(new DateTime(2025, 5, 1), 2));

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(96, result.MeasurementPositions.Count());
        Assert.All(result.MeasurementPositions, position =>
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
        var measurements = new MeasurementDto(CreateHourlyPositions(new DateTime(2025, 3, 30), 2));

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(23, result.MeasurementPositions.Count());
    }

    [Fact]
    public void EnsureCompletePositions_HourlyData_DSTFallBack_Returns25Positions()
    {
        // Arrange
        var date = new DateTime(2025, 10, 26); // DST Fall Back
        var measurements = new MeasurementDto(CreateHourlyPositions(date, 2));

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(25, result.MeasurementPositions.Count());
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_MissingPositions_FillsGaps()
    {
        // Arrange
        var date = new DateTime(2025, 5, 1); // A standard day
        var baseTime = date;
        var measurements = new MeasurementDto(new List<MeasurementPositionDto>
            {
                new MeasurementPositionDto(0, baseTime, new List<MeasurementPointDto> { new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.QuarterHourly, baseTime.AddMinutes(60), baseTime.AddMinutes(60)) }),
                new MeasurementPositionDto(4, baseTime.AddMinutes(60), new List<MeasurementPointDto> { new MeasurementPointDto(1, 0, Quality.Calculated, Measurements.Abstractions.Api.Models.Unit.kVArh, Resolution.QuarterHourly, baseTime.AddMinutes(60), baseTime.AddMinutes(60)) }),
            });

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(96, result.MeasurementPositions.Count());
        Assert.NotNull(result.MeasurementPositions.FirstOrDefault(p => p.Index == 1));
        Assert.NotNull(result.MeasurementPositions.FirstOrDefault(p => p.Index == 2));
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_DSTSpringForward_Returns92Positions()
    {
        // Arrange
        var date = new DateTime(2025, 3, 30); // DST Spring Forward
        var measurements = new MeasurementDto(CreateQuarterHourlyPositions(date, 2));

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(92, result.MeasurementPositions.Count());
        Assert.All(result.MeasurementPositions, position =>
        {
            Assert.NotNull(position);
            Assert.NotNull(position.MeasurementPoints);
        });
    }

    [Fact]
    public void EnsureCompletePositions_QuarterHourlyData_DSTFallBack_Returns100Positions()
    {
        // Arrange
        var date = new DateTime(2025, 10, 26); // DST Fall Back
        var measurements = new MeasurementDto(CreateQuarterHourlyPositions(date, 2));

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(100, result.MeasurementPositions.Count());
        Assert.All(result.MeasurementPositions, position =>
        {
            Assert.NotNull(position);
            Assert.NotNull(position.MeasurementPoints);
        });
    }

    [Fact]
    public void EnsureCompletePositions_EmptyMeasurements_DefaultsToHourlyAndReturnsCorrectPositions()
    {
        // Arrange
        var measurements = new MeasurementDto(Enumerable.Empty<MeasurementPositionDto>());

        // Act
        var result = MeasurementDtoExtensions.EnsureCompletePositions(measurements);

        // Assert
        Assert.Equal(24, result.MeasurementPositions.Count());
    }

    [Fact]
    public void DetermineResolution_EmptyMeasurementPositions_ReturnsHourly()
    {
        // Arrange
        var measurementPositions = Enumerable.Empty<MeasurementPositionDto>();

        // Act
        var resolution = MeasurementDtoExtensions.DetermineResolution(measurementPositions);

        // Assert
        Assert.Equal(Resolution.Hourly, resolution);
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
