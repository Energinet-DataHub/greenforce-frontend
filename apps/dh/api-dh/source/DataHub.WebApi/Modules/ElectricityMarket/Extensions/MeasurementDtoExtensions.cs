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
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;

public static class MeasurementDtoExtensions
{
    private static readonly DateTimeZone TimeZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

    public static IEnumerable<MeasurementPositionDto> EnsureCompletePositions(this IEnumerable<MeasurementPositionDto> measurementPositions)
    {
        var resolution = DetermineResolution(measurementPositions);
        int intervalMinutes = GetIntervalMinutes(resolution);

        var existingPositionsByObservationTime = measurementPositions
            .ToDictionary(p => p.ObservationTime.ToInstant(), p => p);

        var result = new List<MeasurementPositionDto>();

        var firstPosition = measurementPositions.OrderBy(p => p.ObservationTime).First();

        int numberOfPositions = GetNumberOfPositions(resolution, firstPosition.ObservationTime);

        var startDate = firstPosition.ObservationTime.ToInstant().InZone(TimeZone);
        var startDateUtc = firstPosition.ObservationTime.ToInstant();

        var index = 1;

        do
        {
            if (existingPositionsByObservationTime.TryGetValue(startDateUtc, out var existingPosition))
            {
                result.Add(new MeasurementPositionDto(index, existingPosition.ObservationTime, existingPosition.MeasurementPoints));
            }
            else
            {
                var newPosition = new MeasurementPositionDto(
                    index,
                    startDateUtc.InZone(TimeZone).ToDateTimeOffset(),
                    Enumerable.Empty<MeasurementPointDto>());
                result.Add(newPosition);
            }

            index++;
            startDateUtc = startDateUtc.Plus(Duration.FromMinutes(intervalMinutes));
        }
        while (startDateUtc.InZone(TimeZone).Day == startDate.Day);

        return result.OrderBy(p => p.ObservationTime).ToList();
    }

    private static Resolution DetermineResolution(IEnumerable<MeasurementPositionDto> measurementPositions)
    {
        if (!measurementPositions.Any())
        {
            return Resolution.Hourly;
        }

        return measurementPositions.First().MeasurementPoints.First().Resolution;
    }

    private static int GetIntervalMinutes(Resolution resolution)
    {
        return resolution switch
        {
            Resolution.Hourly => 60,
            Resolution.QuarterHourly => 15,
            _ => 60,
        };
    }

    private static int GetNumberOfPositions(Resolution resolution, DateTimeOffset date)
    {
        // Check request dato og return data
        var localDate = new LocalDate(date.Year, date.Month, date.Day);
        var startOfDay = localDate.AtStartOfDayInZone(TimeZone).ToInstant();
        var endOfDay = localDate.PlusDays(1).AtStartOfDayInZone(TimeZone).ToInstant();

        var dayLengthMinutes = (int)(endOfDay - startOfDay).TotalMinutes;
        var intervalMinutes = GetIntervalMinutes(resolution);

        return dayLengthMinutes / intervalMinutes;
    }
}
