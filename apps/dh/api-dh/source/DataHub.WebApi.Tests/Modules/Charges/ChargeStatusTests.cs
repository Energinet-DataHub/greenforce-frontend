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
using Energinet.DataHub.Charges.Abstractions.Api.Models;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
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
            query: { chargeTypes: [FEE] }
            skip: 0
            take: 10
        ) {
            totalCount
            items {
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
        await ExecuteTestAsync("MissingPricesSeriesWithoutEndDate", DateTimeOffset.Now.AddDays(-5), DateTimeOffset.MaxValue, false);
    }

    private static async Task ExecuteTestAsync(string testname, DateTimeOffset validFrom, DateTimeOffset validTo, bool hasAnyPrices)
    {
        var server = new GraphQLTestService();

        server.ChargesClientMock
            .Setup(x => x.GetChargeInformationAsync(It.IsAny<ChargeInformationSearchCriteriaDto>(), It.IsAny<System.Threading.CancellationToken>()))
            .Returns(
               Task.FromResult(Result<IEnumerable<ChargeInformationDto>>.Success(new List<ChargeInformationDto>
               {
                new ChargeInformationDto(
                    Id: "01234",
                    Code: "SUB-123",
                    ChargeType: ChargeType.Subscription,
                    Name: "Subscription 123",
                    Owner: "Energy Provider A",
                    Description: "Standard grid payment",
                    Resolution: Resolution.Daily,
                    // TaxIndicator: false,
                    // TransparentInvoicing: false,
                    // VatClassification: VatClassification.Vat25,
                    HasAnyPrices: hasAnyPrices,
                    ValidFrom: validFrom,
                    ValidTo: validTo),
                new ChargeInformationDto(
                    Id: "56789",
                    Code: "FEE-456",
                    ChargeType: ChargeType.Fee,
                    Name: "Fee 456",
                    Owner: "Grid Company B",
                    Description: "System utilization fee",
                    Resolution: Resolution.Daily,
                    // TaxIndicator: false,
                    // TransparentInvoicing: false,
                    // VatClassification: VatClassification.Vat25,
                    HasAnyPrices: hasAnyPrices,
                    ValidFrom: validFrom,
                    ValidTo: validTo),
               })));

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_query)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync(testname);
    }
}
