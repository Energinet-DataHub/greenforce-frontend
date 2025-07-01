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

public static class MeasurementAggregationByMonthDtoExtensions
{
    public static IEnumerable<MeasurementAggregationByMonthDto> PadWithEmptyPositions(
        this IEnumerable<MeasurementAggregationByMonthDto> measurementPositions,
        int requestYear)
    {
        if (measurementPositions == null || !measurementPositions.Any())
        {
            return Enumerable.Empty<MeasurementAggregationByMonthDto>();
        }

        var existingPositionsByDate = measurementPositions
            .ToDictionary(p => p.YearMonth, p => p);

        var result = new List<MeasurementAggregationByMonthDto>();

        var month = 1;

        do
        {
            var date = new YearMonth(requestYear, month);
            if (existingPositionsByDate.TryGetValue(date, out var position))
            {
                result.Add(position);
            }
            else
            {
                result.Add(new MeasurementAggregationByMonthDto(date, Quantity: null, Unit.kWh));
            }

            month++;
        }
        while ((month <= DateTimeOffset.Now.Month && requestYear == DateTimeOffset.Now.Year) || (requestYear < DateTimeOffset.Now.Year && month <= 12));

        return result.OrderBy(p => p.YearMonth).ToList();
    }
}
