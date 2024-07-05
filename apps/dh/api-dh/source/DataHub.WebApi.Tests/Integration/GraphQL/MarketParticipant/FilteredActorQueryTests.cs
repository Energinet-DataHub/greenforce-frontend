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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.MarketParticipant;

public class FilteredActorQueryTests
{
    private static readonly Guid _batchId = new("14098365-3231-40e3-8c1b-5a73dbab31c0");

    private static readonly string _filteredActors =
    $$"""
    {
        filteredActors {
            displayName
            id
            organization {
                domain
            }
        }
    }
    """;

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetFilteredActorsAsync(bool isFas)
    {
        var actorId = Guid.Parse("ceaa4172-cce6-4276-bd88-23589ef500aa");
        var organizationId = Guid.NewGuid();

        var actors = new List<ActorDto>
            {
                new ActorDto()
                {
                    ActorId = actorId,
                    ActorNumber = new ActorNumberDto() { Value = "1234567890" },
                    MarketRoles = new List<ActorMarketRoleDto>()
                    {
                        new ActorMarketRoleDto() { EicFunction = EicFunction.DataHubAdministrator },
                    },
                    Name = new ActorNameDto() { Value = "Test" },
                    OrganizationId = organizationId,
                },
                new ActorDto()
                {
                    ActorId = new Guid("ceaa4172-cce6-4276-bd88-23589ef500bb"),
                    ActorNumber = new ActorNumberDto() { Value = "1234567890" },
                    MarketRoles = new List<ActorMarketRoleDto>()
                    {
                        new ActorMarketRoleDto() { EicFunction = EicFunction.BillingAgent },
                    },
                    Name = new ActorNameDto() { Value = "Test1" },
                    OrganizationId = organizationId,
                },
            };

        GraphQLTestService.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(default))
            .ReturnsAsync(actors);

        GraphQLTestService.MarketParticipantClientV1Mock
            .Setup(x => x.OrganizationGetAsync(organizationId, default))
            .ReturnsAsync(new OrganizationDto() { OrganizationId = organizationId, Domain = "test.com" });

        var context = new DefaultHttpContext();

        context.User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new("azp", actorId.ToString()),
            new("membership", isFas ? "fas" : "non-fas"),
        }));

        GraphQLTestService.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(context);

        var result = await GraphQLTestService
            .ExecuteRequestAsync(b => b.SetQuery(_filteredActors));

        await result.MatchSnapshotAsync($"GetFilteredActorsAsync-isFas-{isFas}");
    }
}
