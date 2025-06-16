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

using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.Measurements.Client.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Authorization;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementsNode
{
    // Use new signature auth for all methods
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByDateDto>> GetAggregatedMeasurementsForMonthAsync(
        bool showOnlyChangedValues,
        GetMonthlyAggregateByDateQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        bool enableNewSecurityModel = false)
    {
        IEnumerable<MeasurementAggregationByDateDto> measurements;

        if (!enableNewSecurityModel)
        {
            measurements = await client.GetMonthlyAggregateByDateAsync(query, ct);
        }
        else
        {
            if (httpContextAccessor.HttpContext == null)
            {
                throw new InvalidOperationException("Http context is not available.");
            }

            var accessValidationRequest = (MeasurementsAccessValidationRequest)SignatureAuth.GetAccessValidationRequest(
                typeof(MeasurementsAccessValidationRequest),
                query.MeteringPointId,
                query.YearMonth.ToDateInterval().Start.ToUtcDateTimeOffset(),
                query.YearMonth.ToDateInterval().End.ToUtcDateTimeOffset(),
                httpContextAccessor,
                requestAuthorization);

            var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
            var authClient = authorizedHttpClientFactory.CreateMeasurementClientWithSignature(signature);

            measurements = await authClient.GetMonthlyAggregateByDateAsync(query);
        }

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
        [Service] IMeasurementsClient client,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        bool enableNewSecurityModel = false)
    {
        if (!enableNewSecurityModel)
        {
            return await client.GetYearlyAggregateByMonthAsync(query, ct);
        }

        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var accessValidationRequest = (MeasurementsAccessValidationRequest)SignatureAuth.GetAccessValidationRequest(
            typeof(MeasurementsAccessValidationRequest),
            query.MeteringPointId,
            new DateTime(query.Year, 1, 1),
            new DateTime(query.Year, 12, 31),
            httpContextAccessor,
            requestAuthorization);

        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var authClient = authorizedHttpClientFactory.CreateMeasurementClientWithSignature(signature);

        return await authClient.GetYearlyAggregateByMonthAsync(query);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByYearDto>> GetAggregatedMeasurementsForAllYearsAsync(
        GetAggregateByYearQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        bool enableNewSecurityModel = false)
    {
        if (!enableNewSecurityModel)
        {
            return await client.GetAggregateByYearAsync(query, ct);
        }

        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var accessValidationRequest = (MeasurementsAccessValidationRequest)SignatureAuth.GetAccessValidationRequest(
            typeof(MeasurementsAccessValidationRequest),
            query.MeteringPointId,
            new DateTime(DateTime.Now.Year, 1, 1),
            new DateTime(DateTime.Now.Year, 12, 31),
            httpContextAccessor,
            requestAuthorization);

        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var authClient = authorizedHttpClientFactory.CreateMeasurementClientWithSignature(signature);

        return await authClient.GetAggregateByYearAsync(query);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementDto> GetMeasurementsAsync(
        bool showOnlyChangedValues,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        bool enableNewSecurityModel = false)
    {
        MeasurementDto measurements;

        if (!enableNewSecurityModel)
        {
            measurements = await client.GetByDayAsync(query, ct);
        }

        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var accessValidationRequest = (MeasurementsAccessValidationRequest)SignatureAuth.GetAccessValidationRequest(
            typeof(MeasurementsAccessValidationRequest),
            query.MeteringPointId,
            query.Date.ToUtcDateTimeOffset(),
            query.Date.PlusDays(1).ToUtcDateTimeOffset(),
            httpContextAccessor,
            requestAuthorization);

        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var authClient = authorizedHttpClientFactory.CreateMeasurementClientWithSignature(signature);

        measurements = await authClient.GetByDayAsync(query);

        if (measurements.MeasurementPositions == null || !measurements.MeasurementPositions.Any())
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
            return new MeasurementDto(measurementPositions
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
        DateTimeOffset observationTime,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IRequestAuthorization requestAuthorization,
        [Service] AuthorizedHttpClientFactory authorizedHttpClientFactory,
        bool enableNewSecurityModel = false)
    {
        MeasurementDto measurements;

        if (!enableNewSecurityModel)
        {
            measurements = await client.GetByDayAsync(query, ct);
        }

        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var accessValidationRequest = (MeasurementsAccessValidationRequest)SignatureAuth.GetAccessValidationRequest(
            typeof(MeasurementsAccessValidationRequest),
            query.MeteringPointId,
            query.Date.ToUtcDateTimeOffset(),
            query.Date.PlusDays(1).ToUtcDateTimeOffset(),
            httpContextAccessor,
            requestAuthorization);

        var signature = await requestAuthorization.RequestSignatureAsync(accessValidationRequest);
        var authClient = authorizedHttpClientFactory.CreateMeasurementClientWithSignature(signature);

        measurements = await authClient.GetByDayAsync(query);

        return measurements.MeasurementPositions
                .Where(position => position.ObservationTime == observationTime)
                .SelectMany(position => position.MeasurementPoints);
    }
}
