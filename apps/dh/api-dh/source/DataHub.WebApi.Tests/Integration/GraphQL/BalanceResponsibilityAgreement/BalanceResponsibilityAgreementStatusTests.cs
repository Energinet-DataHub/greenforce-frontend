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
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.BalanceResponsibilityAgreement;

public class BalanceResponsibilityAgreementStatusTests
{
    private static readonly Guid _actorId = new("9d1b5e2a-3c4e-4f8b-9a6e-7f2b6c8d9e1f");

    private static readonly string _actorByIdWithbalanceResponsibleAgreementsQuery =
    $$"""
    {
      actorById(id: "{{_actorId}}") {
        id
        balanceResponsibleAgreements {
            status
        }
      }
    }
    """;
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.

    public static IEnumerable<object[]> GetTestCases()
    {
        yield return new object[] { "Awaiting", DateTimeOffset.Now.AddDays(5), null };
        yield return new object[] { "Active without enddate", DateTimeOffset.Now.AddDays(-5), null };
        yield return new object[] { "Active with enddate", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(10) };
        yield return new object[] { "Expired", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(-1) };
        yield return new object[] { "SoonToExpire", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(3) };
    }

#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.

    [Theory]
    [MemberData(nameof(GetTestCases))]
    public async Task BalanceResponsibilityAgreementsWithStatus(string testname, DateTimeOffset validFrom, DateTimeOffset? validTo) =>
        await ExecuteTestAsync(testname, validFrom, validTo);

    private static async Task ExecuteTestAsync(string testname, DateTimeOffset validFrom, DateTimeOffset? validTo)
    {
        var server = new GraphQLTestService();

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(_actorId, default))
            .ReturnsAsync(new ActorDto()
            {
                ActorId = _actorId,
                Name = new ActorNameDto { Value = "Test" },
                ActorNumber = new ActorNumberDto { Value = "1234567890123" },
                MarketRoles = new[]
                {
                    new ActorMarketRoleDto
                    {
                        EicFunction = EicFunction.BalanceResponsibleParty,
                    },
                },
                OrganizationId = Guid.NewGuid(),
                Status = "Active",
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.BalanceResponsibilityRelationsAsync(_actorId, default))
            .ReturnsAsync(new[]
                {
                    new BalanceResponsibilityRelationDto()
                    {
                        BalanceResponsibleId = Guid.NewGuid(),
                        ValidFrom = validFrom,
                        ValidTo = validTo,
                        EnergySupplierId = Guid.NewGuid(),
                        GridAreaId = Guid.NewGuid(),
                        MeteringPointType = MeteringPointType.D03NotUsed,
                    },
                });

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_actorByIdWithbalanceResponsibleAgreementsQuery));

        await result.MatchSnapshotAsync(testname);
    }
}
