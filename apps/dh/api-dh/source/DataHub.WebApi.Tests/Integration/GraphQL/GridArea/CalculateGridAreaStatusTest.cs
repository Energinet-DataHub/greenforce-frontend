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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.GridArea;

public class CalculateGridAreaStatusTest
{
    private static readonly string _getGridAreasWithStatus =
    $$"""
      query {
        gridAreas {
          id
          status
        }
      }
    """;

    [Fact]
    public async Task GetGridAreaWithStatusAsync()
    {
        var server = new GraphQLTestService();

        var actors = new List<ActorDto>
        {
            new()
            {
                ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500aa"),
                ActorNumber = new ActorNumberDto { Value = "1234567890" },
                MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.DataHubAdministrator, GridAreas = [] },
                Name = new ActorNameDto { Value = "Test" },
            },
            new()
            {
                ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500bb"),
                ActorNumber = new ActorNumberDto { Value = "1234567890" },
                MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.BillingAgent, GridAreas = [] },
                Name = new ActorNameDto { Value = "Test1" },
            },
            new()
            {
                ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef510bb"),
                ActorNumber = new ActorNumberDto { Value = "1234567890" },
                MarketRole = new ActorMarketRoleDto
                {
                    EicFunction = EicFunction.GridAccessProvider,
                    GridAreas = [new ActorGridAreaDto { Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500ab") }],
                },
                Name = new ActorNameDto { Value = "Test1" },
            },
        };

        var gridAreas = new List<GridAreaDto>
        {
            new()
            {
                Code = "1234567890",
                Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500bb"),
                Name = "Test1",
                PriceAreaCode = "DK1",
                Type = GridAreaType.Aboard,
                ValidFrom = DateTimeOffset.UtcNow,
                ValidTo = DateTimeOffset.UtcNow.AddDays(1),
            },
            new()
            {
                Code = "1234567891",
                Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500cc"),
                Name = "Test2",
                PriceAreaCode = "DK2",
                Type = GridAreaType.Distribution,
                ValidFrom = DateTimeOffset.UtcNow.AddDays(-1),
                ValidTo = DateTimeOffset.UtcNow.AddDays(-1),
            },
            new()
            {
                Code = "1234567892",
                Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500dd"),
                Name = "Test3",
                PriceAreaCode = "DK2",
                Type = GridAreaType.Distribution,
                ValidFrom = DateTimeOffset.UtcNow,
            },
            new()
            {
                Code = "1234567893",
                Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500de"),
                Name = "Test3",
                PriceAreaCode = "DK2",
                Type = GridAreaType.Distribution,
                ValidFrom = DateTimeOffset.UtcNow.AddDays(2),
            },
            new()
            {
                Code = "1234567894",
                Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500ab"),
                Name = "Test4",
                PriceAreaCode = "DK2",
                Type = GridAreaType.Distribution,
                ValidFrom = DateTimeOffset.UtcNow,
            },
        };

        var consolidations = new List<ActorConsolidationDto>
        {
            new()
            {
                ActorFromId = new Guid("ceaa4172-cce6-4276-bd88-23589ef510bb"),
                ActorToId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500ba"),
                ConsolidateAt = DateTimeOffset.UtcNow.AddDays(2),
                Status = ActorConsolidationStatus.Pending,
            },
        };

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(actors);

        server.GridAreasClientMock
            .Setup(x => x.GetGridAreasAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(gridAreas);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorConsolidationsAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(new GetActorConsolidationsResponse() { ActorConsolidations = consolidations });

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_getGridAreasWithStatus));

        await result.MatchSnapshotAsync($"GetGridAreasWithStatus");
    }
}
