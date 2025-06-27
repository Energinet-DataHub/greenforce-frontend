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
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client.Authorization;
using Energinet.DataHub.Measurements.Client.Extensions;
using Energinet.DataHub.Measurements.Client.ResponseParsers;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Moq.Protected;
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
        var actorId = Guid.NewGuid();
        var server = new GraphQLTestService();
        server.HttpContextAccessorMock
     .Setup(accessor => accessor.HttpContext)
     .Returns(new DefaultHttpContext
     {
         User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
         {
                    new("actornumber", actorId.ToString()),
                    new("marketroles", EicFunction.DataHubAdministrator.ToString()),
         })),
     });
        var date = new LocalDate(2025, 1, 1);
        var getByDayQuery = new GetByDayQuery("2222", date);

        var measurement = new MeasurementDto([
            new MeasurementPositionDto(1, date.ToUtcDateTimeOffset(), [
                new MeasurementPointDto(1,  measurement1, quality1, Measurements_Unit.kWh, Resolution.Hourly, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
                new MeasurementPointDto(2, measurement2, quality2, Measurements_Unit.kWh, Resolution.Hourly, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
            ])
        ]);

        CreateHttpClientFactoryMock(CreateHttpClient(new HttpResponseMessage()), server, true);
        server.MeasurementsDtoResponseParserMock
            .Setup(x => x.ParseResponseMessage(new HttpResponseMessage(), CancellationToken.None))
            .ReturnsAsync(new MeasurementDto(new List<MeasurementPositionDto>
            {
                new MeasurementPositionDto(
                    1, // Index
                    DateTimeOffset.UtcNow, // ObservationTime
                    new List<MeasurementPointDto>()),
            }));

        // server.MeasurementsClientMock
        //     .Setup(x => x.GetByDayAsync(getByDayQuery, "12345", MarketParticipant.Authorization.Model.EicFunction.MeteredDataAdministrator, It.IsAny<CancellationToken>()))
        //   .ReturnsAsync(measurement);
        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_query)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync(test_case);
    }

    private static void CreateHttpClientFactoryMock(HttpClient httpClient, GraphQLTestService server, bool shouldAuthorize = false)
    {
        if (!shouldAuthorize)
        {
            server.MeasurementsApiHttpClientFactoryMock
                .Setup(x => x.CreateUnauthorizedHttpClient())
                .Returns(httpClient);
        }

        server.MeasurementsApiHttpClientFactoryMock
            .Setup(x => x.CreateAuthorizedHttpClient(It.IsAny<Signature>()))
            .Returns(httpClient);
    }

    private static HttpClient CreateHttpClient(HttpResponseMessage response)
    {
        var httpMessageHandlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);

        httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(response);

        return new HttpClient(httpMessageHandlerMock.Object) { BaseAddress = new Uri("http://localhost") };
    }
}
