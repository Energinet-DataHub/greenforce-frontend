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

using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetContactCpr.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.ElectricityMarket.MeteringPoint;

public class ElectricityMarketMeteringPointRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MeteringPointNode.GetMeteringPointContactCprAsync")]
    public async Task GetMeteringPointContactCprAsync()
    {
        var operation =
            $$"""
                query(
                    $meteringPointId: String!
                    $contactId: String!
                    $searchMigratedMeteringPoints: Boolean!
                ) {
                    meteringPointContactCpr(
                        meteringPointId: $meteringPointId
                        contactId: $contactId
                        searchMigratedMeteringPoints: $searchMigratedMeteringPoints
                    ) {
                        result
                    }
                }
            """;

        var server = new GraphQLTestService();
        var result = Result<GetContactCprResultDtoV1>.Success(new GetContactCprResultDtoV1("11111000"));

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext());

        server.FeatureManagerMock
            .Setup(x => x.IsEnabledAsync("PM120-DH3-METERING-POINTS-UI"))
            .ReturnsAsync(true);

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<GetContactCprQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "meteringPointId", "570000000000000008" },
                { "contactId", "00000000-0000-0000-0000-000000001234" },
                { "searchMigratedMeteringPoints", false },
            });
    }
}
