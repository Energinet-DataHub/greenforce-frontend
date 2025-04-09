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

public static partial class MeasurementPointNodeV2
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementsDto> GetMeasurements_v2Async(
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var firstMeasurement = Instant.FromDateTimeOffset(DateTimeOffset.Parse("2022-12-31T23:00:59Z"));
        if (query.MeteringPointId == "570714700010001014")
        {
            return await Task.FromResult(
                new MeasurementsDto(
                    [
                        new MeasurementPositionDto(
                        firstMeasurement.ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(23.5m, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(12.3m, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromHours(1)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(43, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromHours(2)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(3, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromHours(3)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(43, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(23, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(12, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Hour, DateTimeOffset.UtcNow)
                        ])
                    ]));
        }
        else
        {
            return await Task.FromResult(
            new MeasurementsDto(
                [
                    new MeasurementPositionDto(
                        firstMeasurement.ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(23.5m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(12.3m, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromMinutes(15)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(43, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromMinutes(30)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(3, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        firstMeasurement.Plus(Duration.FromMinutes(45)).ToDateTimeOffset(),
                        [
                            new Model.MeasurementPointDto(43, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(23, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(12, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(32, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow),
                            new Model.MeasurementPointDto(54, Quality.Calculated, Unit.kWh, Resolution.Quarter, DateTimeOffset.UtcNow)
                        ])
                ]));
        }
    }
}
