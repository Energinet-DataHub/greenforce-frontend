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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Actor;

public class CalculateGridAreaStatusTest
{
    private static readonly string _getGridAreasWithStatus =
    $$"""
    {
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
                    ActorNumber = new ActorNumberDto() { Value = "1234567890" },
                    MarketRoles =
                    [
                        new ActorMarketRoleDto() { EicFunction = EicFunction.DataHubAdministrator },
                    ],
                    Name = new ActorNameDto() { Value = "Test" },
                },
                new()
                {
                    ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500bb"),
                    ActorNumber = new ActorNumberDto() { Value = "1234567890" },
                    MarketRoles =
                    [
                        new ActorMarketRoleDto() { EicFunction = EicFunction.BillingAgent },
                    ],
                    Name = new ActorNameDto() { Value = "Test1" },
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
                    Code = "1234567892",
                    Id = new Guid("ceaa4172-cce6-4276-bd88-23589ef500dd"),
                    Name = "Test3",
                    PriceAreaCode = "DK2",
                    Type = GridAreaType.Distribution,
                    ValidFrom = DateTimeOffset.UtcNow.AddDays(2),
                },
            };

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(actors);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.GridAreaGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(gridAreas);

        var result = await server.ExecuteRequestAsync(b => b.SetQuery(_getGridAreasWithStatus));

        await result.MatchSnapshotAsync($"GetGridAreasWithStatus");
    }
}
