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
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementsNode
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationDto>> GetAggregatedMeasurementsForMonthAsync(
        GetAggregatedByMonthQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        return await client.GetAggregatedByMonth(query, ct);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementDto> GetMeasurementsAsync(
        bool showOnlyChangedValues,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = await client.GetByDayAsync(query, ct);

        var updatedPositions = measurements.MeasurementPositions.Select(position =>
            new MeasurementPositionDto(
                position.Index,
                position.ObservationTime,
                position.MeasurementPoints
                    .GroupBy(p => p.Quantity)
                    .Select(g => g.First())));

        measurements = new MeasurementDto(updatedPositions);

        if (showOnlyChangedValues)
        {
            var measurementPositions = measurements.MeasurementPositions
                .Where(position => position.MeasurementPoints
                    .Select(p => p.Quantity)
                    .Distinct()
                    .Count() > 1);

            return new MeasurementDto(measurementPositions);
        }

        return measurements;
    }
}
