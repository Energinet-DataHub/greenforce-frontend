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

using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Requests;

public class RequestOptionsQueryTests
{
    private static readonly string _requestOptionsQuery =
    $$"""
      query {
        requestOptions {
          isGridAreaRequired
          calculationTypes {
          value
            displayValue
          }
          meteringPointTypes {
            value
            displayValue
          }
        }
      }
    """;

    [Theory]
    [InlineData(EicFunction.BalanceResponsibleParty)]
    [InlineData(EicFunction.EnergySupplier)]
    [InlineData(EicFunction.GridAccessProvider)]
    public async Task GetRequestOptionsAsync(EicFunction eicFunction)
    {
        var server = new GraphQLTestService();
        var claimsPrincipal = ClaimsPrincipalMocks.FromMarketRole(eicFunction);
        var actorId = ClaimsPrincipalMocks.ActorId;
        var marketRole = new ActorMarketRoleDto { EicFunction = eicFunction };

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(actorId, null))
            .ReturnsAsync(new ActorDto() { ActorId = actorId, MarketRole = marketRole });

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext { User = claimsPrincipal });

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_requestOptionsQuery)
            .SetUser(claimsPrincipal));

        await result.MatchSnapshotAsync($"GetRequestOptionsAs{eicFunction}");
    }
}
