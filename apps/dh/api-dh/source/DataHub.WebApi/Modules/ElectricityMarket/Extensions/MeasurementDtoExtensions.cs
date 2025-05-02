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

using Energinet.DataHub.Measurements.Abstractions.Api.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;

public static class MeasurementDtoExtensions
{
    public static MeasurementDto EnsureCompletePositions(this MeasurementDto measurements)
    {
        TimeZoneInfo centralEuropeanTimeZone;
        try
        {
            centralEuropeanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");
        }
        catch
        {
            centralEuropeanTimeZone = TimeZoneInfo.Utc;
        }

        var resolution = DetermineResolution(measurements.MeasurementPositions);

        int intervalMinutes = resolution == Resolution.QuarterHourly ? 15 : 60;

        var existingPositionsByIndex = measurements.MeasurementPositions
            .ToDictionary(p => p.Index, p => p);

        var result = new List<MeasurementPositionDto>();

        var firstPosition = measurements.MeasurementPositions.FirstOrDefault();
        var date = firstPosition != null ? firstPosition.ObservationTime.Date : DateTime.UtcNow.Date;

        // Get start and end of day in local time, accounting for DST
        var startOfDay = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Unspecified);
        var startOfDayUtc = TimeZoneInfo.ConvertTimeToUtc(startOfDay, centralEuropeanTimeZone);

        var endOfDay = startOfDay.AddDays(1);
        var endOfDayUtc = TimeZoneInfo.ConvertTimeToUtc(endOfDay, centralEuropeanTimeZone);

        var totalMinutes = (int)(endOfDayUtc - startOfDayUtc).TotalMinutes;
        var expectedPositions = totalMinutes / intervalMinutes;

        DateTime currentTime = startOfDayUtc;
        for (int i = 1; i <= expectedPositions; i++)
        {
            if (existingPositionsByIndex.TryGetValue(i, out var existingPosition))
            {
                result.Add(existingPosition);
            }
            else
            {
                result.Add(new MeasurementPositionDto(
                    i,
                    currentTime,
                    Enumerable.Empty<MeasurementPointDto>()));
            }

            currentTime = currentTime.AddMinutes(intervalMinutes);
        }

        return new MeasurementDto(result.OrderBy(p => p.Index).ToList());
    }

    /// <summary>
    /// Determines the resolution of the measurements based on the ObservationTime intervals.
    /// Defaults to Hourly if MeasurementPositions are empty or there is only one measurement position.
    /// </summary>
    /// <param name="measurementPositions">The collection of MeasurementPositionDto.</param>
    /// <returns>The resolution as a Resolution enum value.</returns>
    public static Resolution DetermineResolution(IEnumerable<MeasurementPositionDto> measurementPositions)
    {
        if (!measurementPositions.Any() || measurementPositions.Count() == 1)
        {
            return Resolution.Hourly;
        }

        var orderedPositions = measurementPositions.OrderBy(p => p.Index).ToList();

        // Check if we can determine resolution from index gaps and time differences
        for (int i = 0; i < orderedPositions.Count - 1; i++)
        {
            var current = orderedPositions[i];
            var next = orderedPositions[i + 1];

            var timeDiffMinutes = (next.ObservationTime - current.ObservationTime).TotalMinutes;

            var indexDiff = next.Index - current.Index;

            if (indexDiff > 0)
            {
                var minutesPerIndex = timeDiffMinutes / indexDiff;

                if (Math.Abs(minutesPerIndex - 15) < 1)
                {
                    return Resolution.QuarterHourly;
                }

                if (Math.Abs(minutesPerIndex - 60) < 1)
                {
                    return Resolution.Hourly;
                }
            }
        }

        return Resolution.Hourly;
    }
}
