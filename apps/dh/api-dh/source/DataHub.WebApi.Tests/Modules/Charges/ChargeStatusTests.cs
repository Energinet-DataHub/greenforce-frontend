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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Charges;

public class ChargeStatusTests
{
    private static readonly string _query =
    $$"""
    {
        charges(
            query: null
            after: null
            before: null
            first: 10
            last: null
            order: {
                id: ASC
            }
        ) {
            totalCount
            nodes {
                status
            }
        }
    }
    """;

    private static readonly DateTimeOffset _sameDate = DateTimeOffset.Now.AddDays(5);

    public static IEnumerable<object[]> GetTestCases()
    {
        yield return new object[] { "CancelledSameDate", _sameDate, _sameDate, false };
        yield return new object[] { "Closed", DateTimeOffset.Now.AddDays(-4), DateTimeOffset.Now.AddDays(-4), true };
        yield return new object[] { "Current", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(10), true };
        yield return new object[] { "MissingPricesSeriesWithEnd", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.Now.AddDays(2), false };
    }

    [Theory]
    [MemberData(nameof(GetTestCases))]
    public async Task ChargesStatus(string testname, DateTimeOffset validFrom, DateTimeOffset validTo, bool hasAnyPrices) =>
        await ExecuteTestAsync(testname, validFrom, validTo, hasAnyPrices);

    [Fact]
    public async Task ChargeStatus_MissingPricesSeriesWithoutEndDate()
    {
        await ExecuteTestAsync("MissingPricesSeriesWithoutEndDate", DateTimeOffset.Now.AddDays(-5), null, false);
    }

    private static async Task ExecuteTestAsync(string testname, DateTimeOffset validFrom, DateTimeOffset? validTo, bool hasAnyPrices)
    {
        var server = new GraphQLTestService();

        server.ChargesClientMock
            .Setup(x => x.GetCharges(It.IsAny<GetChargesQuery>()))
            .Returns(
            [
                new ChargeDto(
                    Id: Guid.NewGuid(),
                    ChargeId: "SUB-123",
                    ChargeType: ChargeType.D01,
                    ChargeName: "Subscription 123",
                    ChargeOwner: "ABC123",
                    ChargeOwnerName: "Energy Provider A",
                    ChargeDescription: "Standard grid payment",
                    Resolution: ChargeResolution.P1D,
                    TaxIndicator: false,
                    TransparentInvoicing: false,
                    VatClassification: VatClassification.Vat25,
                    HasAnyPrices: hasAnyPrices,
                    ValidFromDateTime: validFrom,
                    ValidToDateTime: validTo),
                new ChargeDto(
                    Id: Guid.NewGuid(),
                    ChargeId: "FEE-456",
                    ChargeType: ChargeType.D02,
                    ChargeName: "Fee 456",
                    ChargeOwner: "XYZ456",
                    ChargeOwnerName: "Grid Company B",
                    ChargeDescription: "System utilization fee",
                    Resolution: ChargeResolution.P1D,
                    TaxIndicator: false,
                    TransparentInvoicing: false,
                    VatClassification: VatClassification.Vat25,
                    HasAnyPrices: hasAnyPrices,
                    ValidFromDateTime: validFrom,
                    ValidToDateTime: validTo),
            ]);

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_query)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync(testname);
    }
}
