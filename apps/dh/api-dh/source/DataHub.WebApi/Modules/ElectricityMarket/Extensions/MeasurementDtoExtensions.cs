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
using Energinet.DataHub.Measurements.Client.Extensions;
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;

public static class MeasurementDtoExtensions
{
    private static readonly DateTimeZone TimeZone = DateTimeZoneProviders.Tzdb["Europe/Copenhagen"];

    public static IEnumerable<MeasurementPositionDto> EnsureCompletePositions(this IEnumerable<MeasurementPositionDto> measurementPositions, LocalDate requestDate)
    {
        var resolution = DetermineResolution(measurementPositions);
        int intervalMinutes = GetIntervalMinutes(resolution);

        var existingPositionsByObservationTime = measurementPositions
            .ToDictionary(p => p.ObservationTime, p => p);

        var result = new List<MeasurementPositionDto>();

        var startDateUtc = requestDate.ToUtcDateTimeOffset();

        var index = 1;

        do
        {
            if (existingPositionsByObservationTime.TryGetValue(startDateUtc, out var position))
            {
                result.Add(new MeasurementPositionDto(index, startDateUtc, position.MeasurementPoints));
            }
            else
            {
                result.Add(new MeasurementPositionDto(index, startDateUtc, Enumerable.Empty<MeasurementPointDto>()));
            }

            startDateUtc = startDateUtc.AddMinutes(intervalMinutes);
            index++;
        }
        while (startDateUtc.ToInstant().InZone(TimeZone).Day == requestDate.Day);

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
}
