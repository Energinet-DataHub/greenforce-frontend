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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.SendMeasurements;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementOperations
{
    // TODO: Find a way to handle failed measurements
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByDateDto>> GetAggregatedMeasurementsForMonthAsync(
        bool showOnlyChangedValues,
        GetMonthlyAggregateByDateQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var maybeMeasurements = await client.GetMonthlyAggregateByDateAsync(query, ct);

        if (maybeMeasurements.IsFailure)
        {
            return Enumerable.Empty<MeasurementAggregationByDateDto>();
        }

        // TODO: Comment backend when ContainsUpdatedValues is implemented
        // if (showOnlyChangedValues)
        // {
        //     return measurements.Where(x => x.ContainsUpdatedValues);
        // }
        return maybeMeasurements.Value!.PadWithEmptyPositions(query.YearMonth);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByMonthDto>> GetAggregatedMeasurementsForYearAsync(
        GetYearlyAggregateByMonthQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var maybeMeasurements = await client.GetYearlyAggregateByMonthAsync(query, ct);

        if (maybeMeasurements.IsFailure)
        {
            return Enumerable.Empty<MeasurementAggregationByMonthDto>();
        }

        return maybeMeasurements.Value!.PadWithEmptyPositions(query.Year);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByYearDto>> GetAggregatedMeasurementsForAllYearsAsync(
        GetAggregateByYearQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var maybeMeasurements = await client.GetAggregateByYearAsync(query, ct);

        if (maybeMeasurements.IsFailure)
        {
            return Enumerable.Empty<MeasurementAggregationByYearDto>();
        }

        return maybeMeasurements.Value!;
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementDto> GetMeasurementsAsync(
        bool showOnlyChangedValues,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var maybeMeasurements = await client.GetByDayAsync(query, ct);

        if (maybeMeasurements.IsFailure)
        {
            return new MeasurementDto(Enumerable.Empty<MeasurementPositionDto>());
        }

        var measurementPositions = maybeMeasurements.Value!.MeasurementPositions.Select(position =>
            new MeasurementPositionDto(
                position.Index,
                position.ObservationTime,
                position.MeasurementPoints
                    .GroupBy(p => new { p.Quantity, p.Quality })
                    .Select(g => g.First())));

        if (showOnlyChangedValues)
        {
            return new MeasurementDto(measurementPositions
                .Where(position => position.MeasurementPoints
                    .Select(p => new { p.Quantity, p.Quality })
                    .Distinct()
                    .Count() > 1) ?? Enumerable.Empty<MeasurementPositionDto>());
        }

        return new MeasurementDto(measurementPositions.PadWithEmptyPositions(query.Date));
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementPointDto>> GetMeasurementPointsAsync(
        DateTimeOffset observationTime,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var maybeMeasurements = await client.GetByDayAsync(query, ct);

        if (maybeMeasurements.IsFailure)
        {
            return Enumerable.Empty<MeasurementPointDto>();
        }

        return maybeMeasurements.Value!.MeasurementPositions
                    .Where(position => position.ObservationTime == observationTime)
                    .SelectMany(position => position.MeasurementPoints);
    }

    [Mutation]
    [UseMutationConvention(Disable = true)]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "measurements:manage" })]
    public static async Task<bool> SendMeasurementsAsync(
        SendMeasurementsRequestV1 input,
        CancellationToken ct,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        await client.SendMeasurementsAsync("1", input, ct);
        return true;
    }

    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<SendMeasurementsInstanceDto>> GetFailedSendMeasurementsInstancesAsync(
        Interval created,
        string? filter,
        CancellationToken ct,
        [Service] IProcessManagerClient client,
        [Service] IHttpContextAccessor httpContextAccessor)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var instances = await client.GetSendMeasurementsInstancesAsync(
            query: new GetSendMeasurementsInstancesQuery(
                OperatingIdentity: userIdentity,
                CreatedFrom: created.Start.ToDateTimeOffset(),
                CreatedTo: created.End.ToDateTimeOffset(),
                Status: GetSendMeasurementsInstancesQuery.InstanceStatusFilter.Failed,
                MeteringPointId: filter),
            cancellationToken: ct);

        return instances;
    }
}
