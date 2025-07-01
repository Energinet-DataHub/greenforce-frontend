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

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;

public static class MeasurementAggregationByDateDtoExtensions
{
    public static IEnumerable<MeasurementAggregationByDateDto> PadWithEmptyPositions(
        this IEnumerable<MeasurementAggregationByDateDto> measurementPositions,
        YearMonth requestDate)
    {
        if (measurementPositions == null || !measurementPositions.Any())
        {
            return Enumerable.Empty<MeasurementAggregationByDateDto>();
        }

        var daysInMonth = requestDate.Calendar
            .GetDaysInMonth(requestDate.Year, requestDate.Month);

        var existingPositionsByDate = measurementPositions
            .ToDictionary(p => p.Date, p => p);

        var result = new List<MeasurementAggregationByDateDto>();

        var day = 1;

        do
        {
            var date = requestDate.OnDayOfMonth(day).ToDateOnly();
            if (existingPositionsByDate.TryGetValue(date, out var position))
            {
                result.Add(position);
            }
            else
            {
                result.Add(new MeasurementAggregationByDateDto(date, Quantity: null, [Quality.Missing], Unit.kWh, IsMissingValues: true, ContainsUpdatedValues: false));
            }

            day++;
        }
        while (day <= daysInMonth);

        return result.OrderBy(p => p.Date).ToList();
    }
}
