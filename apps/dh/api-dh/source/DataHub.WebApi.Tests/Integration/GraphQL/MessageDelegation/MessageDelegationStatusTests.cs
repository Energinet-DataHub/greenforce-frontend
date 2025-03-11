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

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.MessageDelegation;

public class MessageDelegationStatusTests
{
    private static readonly Guid _actorId = new("9d1b5e2a-3c4e-4f8b-9a6e-7f2b6c8d9e1f");

    private static readonly string _messageDelegationQuery =
    $$"""
    {
        actorById(id: "{{_actorId}}") {
            id
            delegations {
                id
                status
            }

        }
    }
    """;

    private static readonly DateTimeOffset _sameDate = DateTimeOffset.Now.AddDays(5);
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.

    public static IEnumerable<object[]> GetTestCases()
    {
        yield return new object[] { "Cancelled same date", _sameDate, _sameDate };
        yield return new object[] { "Cancelled", DateTimeOffset.Now.AddDays(5), DateTimeOffset.Now.AddDays(4) };
        yield return new object[] { "Active with end", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(10) };
        yield return new object[] { "Active without end", DateTimeOffset.Now.AddDays(-5), null };
        yield return new object[] { "Expired", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(-1) };
    }

#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.

    [Theory]
    [MemberData(nameof(GetTestCases))]
    public async Task MessageDelegationWithStatus(string testname, DateTimeOffset validFrom, DateTimeOffset? validTo) =>
        await ExecuteTestAsync(testname, validFrom, validTo);

    private static async Task ExecuteTestAsync(string testname, DateTimeOffset validFrom, DateTimeOffset? validTo)
    {
        var server = new GraphQLTestService();
        var organizationId = Guid.NewGuid();

        var actor =
                new ActorDto()
                {
                    ActorId = _actorId,
                    ActorNumber = new ActorNumberDto { Value = "1234567890" },
                    MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.DataHubAdministrator },
                    Name = new ActorNameDto { Value = "Test" },
                    OrganizationId = organizationId,
                };

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(_actorId, It.IsAny<CancellationToken>(), null))
            .ReturnsAsync(actor);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.OrganizationGetAsync(organizationId, default))
            .ReturnsAsync(new OrganizationDto { OrganizationId = organizationId, Domains = new List<string> { "test.com", "test2.dk" } });

        var context = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            {
                new("azp", _actorId.ToString()),
                new("multitenancy", "true"),
            })),
        };

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(context);
        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorDelegationsGetAsync(_actorId, default))
            .ReturnsAsync(new GetDelegationsForActorResponse()
            {
                Delegations =
                [
                    new ProcessDelegationDto()
                    {
                        Id = new("8d1b5e2a-3c4e-4f8b-9a6e-7f2b6c8d9e1f"),
                        DelegatedBy = Guid.NewGuid(),
                        Process = DelegatedProcess.ReceiveEnergyResults,
                        Periods = new[]
                        {
                            new DelegationPeriodDto()
                            {
                                DelegatedTo = Guid.NewGuid(),
                                GridAreaId = Guid.NewGuid(),
                                Id = Guid.NewGuid(),
                                StartsAt = validFrom,
                                StopsAt = validTo,
                            },
                        },
                    },
                ],
            });

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_messageDelegationQuery));

        await result.MatchSnapshotAsync(testname);
    }
}
