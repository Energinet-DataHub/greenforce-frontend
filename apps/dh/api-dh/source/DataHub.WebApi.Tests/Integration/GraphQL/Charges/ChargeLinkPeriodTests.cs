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
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeLinkPeriodTests
{
    private static readonly string MeteringPointId = "571313180000000005";

    private static readonly string Query =
    """
    query ($meteringPointId: String!) {
      chargeLinkPeriods(meteringPointId: $meteringPointId) {
        charge {
          type
        }
        period
      }
    }
    """;

    [Fact]
    public async Task FeeChargeLinkHasNullPeriodEnd_OtherChargeTypesKeepPeriodEnd()
    {
        var from = Instant.FromDateTimeOffset(new DateTimeOffset(2023, 1, 1, 0, 0, 0, TimeSpan.Zero));
        var to = Instant.FromDateTimeOffset(new DateTimeOffset(2023, 12, 31, 0, 0, 0, TimeSpan.Zero));
        var linkPeriod = new ChargeLinkPeriodDto(1, from, to);

        var feeChargeId = new ChargeIdentifierDto("FEE001", "1234567890", ChargeTypeDto.Fee);
        var tariffChargeId = new ChargeIdentifierDto("TAR001", "1234567890", ChargeTypeDto.Tariff);

        var server = new GraphQLTestService();
        server.ChargesClientMock
            .Setup(x => x.GetChargeLinkPeriodsAsync(MeteringPointId, It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new ChargeLinkPeriod(MeteringPointId, linkPeriod, feeChargeId),
                new ChargeLinkPeriod(MeteringPointId, linkPeriod, tariffChargeId),
            ]);

        server.ChargesClientMock
            .Setup(x => x.GetChargesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new Charge(feeChargeId, Resolution.Hourly, false, false, "Fee", []),
                new Charge(tariffChargeId, Resolution.Daily, false, false, "Tariff", []),
            ]);

        var result = await server.ExecuteRequestAsync(
            b => b
                .SetDocument(Query)
                .SetVariableValues(new Dictionary<string, object?> { { "meteringPointId", MeteringPointId } })
                .SetUser(ClaimsPrincipalMocks.CreateAdministrator()),
            CancellationToken.None);

        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task CancelledFeeChargeLinkKeepsPeriodEnd()
    {
        var from = Instant.FromDateTimeOffset(new DateTimeOffset(2023, 1, 1, 0, 0, 0, TimeSpan.Zero));
        var to = from; // from == to means cancelled
        var linkPeriod = new ChargeLinkPeriodDto(1, from, to);

        var feeChargeId = new ChargeIdentifierDto("FEE001", "1234567890", ChargeTypeDto.Fee);
        var tariffChargeId = new ChargeIdentifierDto("TAR001", "1234567890", ChargeTypeDto.Tariff);

        var server = new GraphQLTestService();
        server.ChargesClientMock
            .Setup(x => x.GetChargeLinkPeriodsAsync(MeteringPointId, It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new ChargeLinkPeriod(MeteringPointId, linkPeriod, feeChargeId),
                new ChargeLinkPeriod(MeteringPointId, linkPeriod, tariffChargeId),
            ]);

        server.ChargesClientMock
            .Setup(x => x.GetChargesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([
                new Charge(feeChargeId, Resolution.Hourly, false, false, "Fee", []),
                    new Charge(tariffChargeId, Resolution.Daily, false, false, "Tariff", []),
            ]);

        var result = await server.ExecuteRequestAsync(
            b => b
                .SetDocument(Query)
                .SetVariableValues(new Dictionary<string, object?> { { "meteringPointId", MeteringPointId } })
                .SetUser(ClaimsPrincipalMocks.CreateAdministrator()),
            CancellationToken.None);

        await result.MatchSnapshotAsync();
    }
}
