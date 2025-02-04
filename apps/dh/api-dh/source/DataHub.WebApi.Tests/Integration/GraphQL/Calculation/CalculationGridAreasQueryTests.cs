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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationGridAreasQueryTests
{
    private static readonly string _calculationByIdQuery =
    $$"""
      query {
        calculationById(id: "{{OrchestrationInstanceFactory.Id}}") {
          ... on Calculation {
            gridAreas {
              code
              name
              displayName
            }
          }
        }
      }
    """;

    [Fact]
    public async Task GetCalculationGridAreasAsync()
    {
        var server = new GraphQLTestService();

        server.CalculationsClientMock
            .Setup(x => x.GetCalculationByIdAsync(OrchestrationInstanceFactory.Id, default))
            .ReturnsAsync(CalculationFactory.Create(gridAreaCodes: ["003", "001", "002"]));

        server.GridAreasClientMock
            .Setup(x => x.GetGridAreasAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "002", Name = "Grid Area 2" },
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "001", Name = "Grid Area 1" },
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "003", Name = "Grid Area 3" },
            ]);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync([]);

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationByIdQuery)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync();
    }
}
