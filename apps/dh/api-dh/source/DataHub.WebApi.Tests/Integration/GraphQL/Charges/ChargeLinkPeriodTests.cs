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
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate;
using HotChocolate.Execution;
using Moq;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeLinkPeriodTests
{
    private static readonly string Query =
    """
    query ($meteringPointId: String!) {
      chargeLinkPeriods(meteringPointId: $meteringPointId) {
        period
      }
    }
    """;

    [Fact]
    public async Task GetChargeLinkOverview_FeeChargeLinkHasNullPeriodEnd_OtherChargeTypesKeepPeriodEnd()
    {
        var from = Instant.FromDateTimeOffset(new DateTimeOffset(2023, 1, 1, 0, 0, 0, TimeSpan.Zero));
        var to = Instant.FromDateTimeOffset(new DateTimeOffset(2023, 12, 31, 0, 0, 0, TimeSpan.Zero));

        var chargePeriod = new ChargeInformationPeriodDto(
            Name: "Period",
            Description: "Description",
            VatClassificationDto: VatClassificationDto.NoVat,
            TransparentInvoicing: false,
            StartDate: from,
            EndDate: null);

        var feeCharge = new Charge(
            Id: new ChargeIdentifierDto("FEE001", "1234567890", ChargeTypeDto.Fee),
            Resolution: Resolution.Monthly,
            TaxIndicator: false,
            SpotDependingPrice: false,
            TypeDisplayName: "Fee",
            PeriodDtos: [chargePeriod]);

        var tariffCharge = new Charge(
            Id: new ChargeIdentifierDto("TAR001", "1234567890", ChargeTypeDto.Tariff),
            Resolution: Resolution.Monthly,
            TaxIndicator: false,
            SpotDependingPrice: false,
            TypeDisplayName: "Tariff",
            PeriodDtos: [chargePeriod]);

        var linkPeriod = new ChargeLinkPeriodDto(1, from, to);

        var server = new GraphQLTestService();
        server.ChargesClientMock
            .Setup(x => x.GetChargeLinkPeriodsAsync("571313180000000005", It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new ChargeLinkPeriod("571313180000000005", linkPeriod, feeCharge),
                new ChargeLinkPeriod("571313180000000005", linkPeriod, tariffCharge),
            ]);

        var result = await server.ExecuteRequestAsync(
            b => b
                .SetDocument(Query)
                .SetVariableValues(new Dictionary<string, object?> { { "meteringPointId", "571313180000000005" } })
                .SetUser(ClaimsPrincipalMocks.CreateAdministrator()),
            CancellationToken.None);

        var json = JsonDocument.Parse(result.ToJson());
        var items = json.RootElement
            .GetProperty("data")
            .GetProperty("chargeLinkPeriods")
            .EnumerateArray()
            .ToArray();

        // Items are sorted by SortOrder: Tariff (1) before Fee (3)
        var tariffPeriod = items[0].GetProperty("period");
        var feePeriod = items[1].GetProperty("period");

        Assert.Equal(JsonValueKind.String, tariffPeriod.GetProperty("end").ValueKind);
        Assert.Equal(JsonValueKind.Null, feePeriod.GetProperty("end").ValueKind);
    }
}
