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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using HotChocolate.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementsNode
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByDateDto>> GetAggregatedMeasurementsForMonthAsync(
        bool showOnlyChangedValues,
        GetMonthlyAggregateByDateQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = await client.GetMonthlyAggregateByDateAsync(query, ct);

        if (showOnlyChangedValues)
        {
            return measurements.Where(x => x.ContainsUpdatedValues);
        }

        return measurements;
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByMonthDto>> GetAggregatedMeasurementsForYearAsync(
        GetYearlyAggregateByMonthQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) => await client.GetYearlyAggregateByMonthAsync(query, ct);

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByYearDto>> GetAggregatedMeasurementsForAllYearsAsync(
        GetAggregateByYearQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) => await client.GetAggregateByYearAsync(query, ct);

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementDto> GetMeasurementsAsync(
        bool showOnlyChangedValues,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = await client.GetByDayAsync(query, ct);

        if (measurements.MeasurementPositions.IsNullOrEmpty())
        {
            return new MeasurementDto(Enumerable.Empty<MeasurementPositionDto>());
        }

        var measurementPositions = measurements.MeasurementPositions.Select(position =>
            new MeasurementPositionDto(
                position.Index,
                position.ObservationTime,
                position.MeasurementPoints
                    .GroupBy(p => new { p.Quantity, p.Quality })
                    .Select(g => g.First())));

        if (showOnlyChangedValues)
        {
            return new MeasurementDto(measurements.MeasurementPositions
                .Where(position => position.MeasurementPoints
                    .Select(p => new { p.Quantity, p.Quality })
                    .Distinct()
                    .Count() > 1) ?? Enumerable.Empty<MeasurementPositionDto>());
        }

        return new MeasurementDto(measurementPositions.EnsureCompletePositions(query.Date));
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementPointDto>> GetMeasurementPointsAsync(
        int index,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) => (await client.GetByDayAsync(query, ct))
            .MeasurementPositions
            .Where(position => position.Index == index)
            .SelectMany(position => position.MeasurementPoints);
}
