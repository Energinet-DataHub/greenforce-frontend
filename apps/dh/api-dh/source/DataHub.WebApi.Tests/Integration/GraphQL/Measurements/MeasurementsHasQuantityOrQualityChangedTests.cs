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

using System;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client.Extensions;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using NodaTime;
using Xunit;
using Measurements_Unit = Energinet.DataHub.Measurements.Abstractions.Api.Models.Unit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Measurements;

public class MeasurementsHasQuantityOrQualityChangedTests
{
    private static readonly string _query =
    $$"""
      query {
        measurements(
            showOnlyChangedValues: false
            query: {
                meteringPointId: "2222", date: "2025-01-01"
            }
        ) {
            measurementPositions {
                hasQuantityOrQualityChanged
            }
        }
      }
    """;

    [Theory]
    [InlineData("Quantity_Changed", 1.0, Quality.Calculated, 2.0, Quality.Calculated)]
    [InlineData("Quality_Changed", 1.0, Quality.Calculated, 1.0, Quality.Estimated)]
    [InlineData("Quantity_And_Quality_Equal", 1.0, Quality.Calculated, 1.0, Quality.Calculated)]
    public async Task Get_measurements_has_quantity_or_quality_changed(string test_case, decimal measurement1, Quality quality1, decimal measurement2, Quality quality2)
    {
        var server = new GraphQLTestService();
        var date = new LocalDate(2025, 1, 1);
        var getByDayQuery = new GetByDayQuery("2222", date);

        var measurement = new MeasurementDto([
            new MeasurementPositionDto(1, date.ToUtcDateTimeOffset(), [
                new MeasurementPointDto(1,  measurement1, quality1, Measurements_Unit.kWh, Resolution.Hourly, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
                new MeasurementPointDto(2, measurement2, quality2, Measurements_Unit.kWh, Resolution.Hourly, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
            ])
        ]);

        server.MeasurementsClientMock
            .Setup(x => x.GetByDayAsync(getByDayQuery, It.IsAny<CancellationToken>()))
            .ReturnsAsync(measurement);

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_query)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync(test_case);
    }
}
