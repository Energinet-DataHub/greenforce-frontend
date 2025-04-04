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

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

[ObjectType<MeasurementPoint>]
public static partial class MeasurementPointNode
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementsDto> GetMeasurementsAsync(
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        Instant now = SystemClock.Instance.GetCurrentInstant();
        return await Task.FromResult(
            new MeasurementsDto(
                [
                    new MeasurementPositionDto(
                        now.ToDateTimeOffset(),
                        [
                            new MeasurementPointDto(23, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(12, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(32, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(54, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        now.Minus(Duration.FromHours(1)).ToDateTimeOffset(),
                        [
                            new MeasurementPointDto(43, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(32, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(54, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        now.Minus(Duration.FromHours(2)).ToDateTimeOffset(),
                        [
                            new MeasurementPointDto(3, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(32, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(54, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow)
                        ]),
                    new MeasurementPositionDto(
                        now.Minus(Duration.FromHours(3)).ToDateTimeOffset(),
                        [
                            new MeasurementPointDto(43, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(23, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(12, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(32, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(54, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(32, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow),
                            new MeasurementPointDto(54, Quality.Calculated, Unit.kWh, DateTimeOffset.UtcNow)
                        ])
                ]));
    }
}
