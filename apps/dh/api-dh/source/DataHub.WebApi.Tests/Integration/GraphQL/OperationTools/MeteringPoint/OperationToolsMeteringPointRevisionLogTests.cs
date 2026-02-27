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
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPointDebug.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.OperationTools.MeteringPoint;

public class OperationToolsMeteringPointRevisionLogTests
{
    [Fact]
    [RevisionLogTest("OperationToolsMeteringPointNode.GetOperationToolsMeteringPointAsync")]
    public async Task GetOperationToolsMeteringPoint()
    {
        var operation =
            $$"""
                query($id: String!) {
                  operationToolsMeteringPoint(id: $id) {
                    meteringPointJson
                  }
                }
              """;

        var server = new GraphQLTestService();

        var result = Result<GetMeteringPointDebugResultDtoV1>.Success(
            new GetMeteringPointDebugResultDtoV1(
                MeteringPointJson: "{\"id\":\"570000000000000008\"}",
                MeteringPointWithRelationsJson: null,
                Events: []));

        server.ElectricityMarketClientMock.Setup(
                c => c.SendAsync(It.IsAny<GetMeteringPointDebugQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "id", "570000000000000008" } });
    }
}
