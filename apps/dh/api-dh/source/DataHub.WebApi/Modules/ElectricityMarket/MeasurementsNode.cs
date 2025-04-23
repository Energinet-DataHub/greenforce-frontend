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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Models;
using HotChocolate.Authorization;
using NodaTime;
using Model = Energinet.DataHub.WebApi.Modules.ElectricityMarket.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementsNode
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationDto>> GetAggregatedMeasurementsForMonthAsync(
        GetAggregatedMeasurementsForMonthQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        return await client.GetAggregatedMeasurementsForMonth(query, ct);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementsDto> GetMeasurementsWithHistoryAsync(
        bool showOnlyChangedValues,
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var firstMeasurement = Instant.FromDateTimeOffset(DateTimeOffset.Parse("2022-12-31T23:00:59Z"));
        if (query.MeteringPointId == "570714700010001014")
        {
            var measurementPositions = new List<MeasurementPositionDto>
            {
                new MeasurementPositionDto(
                    1,
                    firstMeasurement.ToDateTimeOffset(),
                    [
                        new Model.MeasurementPointDto(1, 23.5m, Quality.Estimated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(2, 23.5m, Quality.Estimated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(3, 23.5m, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(4, 23.5m, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                    ]),
                new MeasurementPositionDto(
                    2,
                    firstMeasurement.Plus(Duration.FromHours(1)).ToDateTimeOffset(),
                    [
                        new Model.MeasurementPointDto(1, 43, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(2, 32, Quality.Estimated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                    ]),
                new MeasurementPositionDto(
                    3,
                    firstMeasurement.Plus(Duration.FromHours(2)).ToDateTimeOffset(),
                    [
                        new Model.MeasurementPointDto(1, 3, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(2, 32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                    ]),
                new MeasurementPositionDto(
                    4,
                    firstMeasurement.Plus(Duration.FromHours(3)).ToDateTimeOffset(),
                    [
                        new Model.MeasurementPointDto(1, 43, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(2, 23, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(3, 12, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(4, 32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(5, 54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(6, 32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                        new Model.MeasurementPointDto(7, 54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                    ]),
            };

            if (showOnlyChangedValues)
            {
                measurementPositions = measurementPositions
                    .Where(position => position.MeasurementPoints
                        .Select(p => p.Quantity)
                        .Distinct()
                        .Count() > 1)
                    .ToList();
            }

            var measurement = new MeasurementsDto(measurementPositions);

            return await Task.FromResult(measurement);
        }
        else
        {
            return await Task.FromResult(
            new MeasurementsDto(
                [
                    new MeasurementPositionDto(
                        1,
                        firstMeasurement.ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 23.5m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 12.3m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(4, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        2,
                        firstMeasurement.Plus(Duration.FromMinutes(15)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 43, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        3,
                        firstMeasurement.Plus(Duration.FromMinutes(30)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 3, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        4,
                        firstMeasurement.ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 23.5m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 12.3m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(4, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        5,
                        firstMeasurement.Plus(Duration.FromMinutes(15)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 43, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        6,
                        firstMeasurement.Plus(Duration.FromMinutes(30)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 3, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        7,
                        firstMeasurement.Plus(Duration.FromMinutes(45)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(1, 6, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(2, 23, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(3, 12, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(4, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(5, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(6, 32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(7, 54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ])
                ]));
        }
    }
}
