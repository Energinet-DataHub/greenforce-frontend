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

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Actor;

public class ActorGridAreasQueryTests
{
    private static readonly List<GridAreaDto> _gridAreas =
    [
        new() { Id = new("baee5905-2950-461c-8875-17062d095bcf"), Code = "002", Name = "Grid Area 2" },
        new() { Id = new("bb0c208e-f505-4be1-9742-05633bf673a5"), Code = "001", Name = "Grid Area 1" },
        new() { Id = new("44cbddcd-6c63-4ad3-915f-48226de07072"), Code = "003", Name = "Grid Area 3" },
    ];

    private static readonly Guid _actorId = new("2718fe76-f250-47b6-97c2-a37333403991");

    private static readonly string _actorByIdQuery =
    $$"""
    {
      actorById(id: "{{_actorId}}") {
        gridAreas {
          code
          name
          displayName
        }
      }
    }
    """;

    [Fact]
    public async Task GetActorGridAreasAsync()
    {
        var server = new GraphQLTestService();

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(_actorId, It.IsAny<string?>()))
            .ReturnsAsync(new ActorDto
            {
                MarketRoles = [
                    new ActorMarketRoleDto
                    {
                        GridAreas = _gridAreas
                            .Select(g => new ActorGridAreaDto { Id = g.Id })
                            .ToList(),
                    },
                ],
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.GridAreaGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(_gridAreas);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync([]);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_actorByIdQuery));

        await result.MatchSnapshotAsync();
    }
}
