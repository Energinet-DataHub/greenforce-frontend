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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Actor;

public class FilteredMarketParticipantsQueryTests
{
    private static readonly string _filteredMarketParticipants =
    """
    {
      filteredMarketParticipants {
        displayName
        id
        organization {
          domains
        }
      }
    }
    """;

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetFilteredMarketParticipantsAsync(bool isFas)
    {
        var server = new GraphQLTestService();
        var marketParticipantId = Guid.Parse("ceaa4172-cce6-4276-bd88-23589ef500aa");
        var organizationId = Guid.NewGuid();

        var actors = new List<ActorDto>
            {
                new()
                {
                    ActorId = marketParticipantId,
                    ActorNumber = new ActorNumberDto { Value = "1234567890" },
                    MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.DataHubAdministrator },
                    Name = new ActorNameDto { Value = "Test" },
                    OrganizationId = organizationId,
                },
                new()
                {
                    ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500bb"),
                    ActorNumber = new ActorNumberDto { Value = "1234567890" },
                    MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.BillingAgent },
                    Name = new ActorNameDto { Value = "Test1" },
                    OrganizationId = organizationId,
                },
            };

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), null))
            .ReturnsAsync(actors);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.OrganizationGetAsync(organizationId, default))
            .ReturnsAsync(new OrganizationDto { OrganizationId = organizationId, Domains = new List<string> { "test.com", "test2.dk" } });

        var context = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            {
                new("azp", marketParticipantId.ToString()),
                new("multitenancy", isFas ? "true" : "false"),
            })),
        };

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(context);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_filteredMarketParticipants));

        await result.MatchSnapshotAsync($"GetFilteredMarketParticipantsAsync-isFas-{isFas}");
    }
}
