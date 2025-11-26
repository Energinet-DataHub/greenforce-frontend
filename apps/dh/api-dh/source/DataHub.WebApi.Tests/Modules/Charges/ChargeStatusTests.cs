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
using Energinet.DataHub.Charges.Abstractions.Api.Models;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using NodaTime;
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

#pragma warning disable SA1118 // Parameter should not span multiple lines
        server.ChargesClientMock
            .Setup(x => x.GetChargesAsync(It.IsAny<int>(), It.IsAny<int>(), null, null, It.IsAny<GetChargesQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<(IEnumerable<ChargeInformationDto> Charges, int TotalCount)>.Success(
                (
                    new List<ChargeInformationDto>
                    {
                        new(
                            ChargeIdentifierDto: new ChargeIdentifierDto(
                                Code: "SUB-123",
                                ChargeType: ChargeType.Subscription,
                                Owner: "Energy Provider A"),
                            Resolution: Resolution.Daily,
                            TaxIndicator: false,
                            Periods: [new(
                                    Description: "Period 1",
                                    StartDate: Instant.FromDateTimeOffset(validFrom),
                                    EndDate: validTo == DateTimeOffset.MaxValue ? null : Instant.FromDateTimeOffset(validTo),
                                    TransparentInvoicing: false,
                                    VatClassification: VatClassification.NoVat,
                                    Name: "Standard Period")]),
                        new(
                            ChargeIdentifierDto: new ChargeIdentifierDto(
                                Code: "FEE-456",
                                ChargeType: ChargeType.Fee,
                                Owner: "Grid Company B"),
                            Resolution: Resolution.Daily,
                            TaxIndicator: false,
                            Periods: [
                                new(
                                    Description: "Period 1",
                                    StartDate: Instant.FromDateTimeOffset(validFrom),
                                    EndDate: validTo == DateTimeOffset.MaxValue ? null : Instant.FromDateTimeOffset(validTo),
                                    TransparentInvoicing: false,
                                    VatClassification: VatClassification.NoVat,
                                    Name: "Standard Period")
                            ]),
                    },
                    2)));
#pragma warning restore SA1118 // Parameter should not span multiple lines

        server.ChargesClientMock
            .Setup(x => x.GetChargeSeriesAsync(It.IsAny<ChargeIdentifierDto>(), It.IsAny<Resolution>(), It.IsAny<Interval>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ChargeSeries>(hasAnyPrices ?
                [
                    new ChargeSeries(
                        Period: new Interval(
                            start: Instant.FromDateTimeOffset(DateTimeOffset.Now.AddDays(-5)),
                            end: Instant.FromDateTimeOffset(DateTimeOffset.Now.AddDays(10))),
                        Points: [])
                ] : []));

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_query)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync(testname);
    }
}
