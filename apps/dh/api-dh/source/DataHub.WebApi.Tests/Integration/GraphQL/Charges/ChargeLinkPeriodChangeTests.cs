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

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Api.V1.HistoricalChargeLinks;
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

public class ChargeLinkPeriodChangeTests
{
    private static readonly string MeteringPointId = "571313180000000005";

    private static readonly Instant T0 = Instant.FromUtc(2024, 1, 1, 0, 0);
    private static readonly Instant T1 = Instant.FromUtc(2024, 6, 1, 0, 0);
    private static readonly Instant T2 = Instant.FromUtc(2024, 3, 1, 0, 0);

    private static readonly string Query =
    """
    query ($meteringPointId: String!) {
      chargeLinkPeriods(meteringPointId: $meteringPointId) {
        changes {
          created
          changeType
          stopDate
          factor
          previousFactor
        }
      }
    }
    """;

    private static readonly ChargeIdentifierDto ChargeId =
        new("TAR001", "1234567890", ChargeTypeDto.Tariff);

    [Fact]
    public async Task SinglePeriod_ReturnsStarted()
    {
        var changes = PairPeriods(MakePeriod(1, T0, T1, T0));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task CancelledPeriod_ReturnsCancelled()
    {
        var changes = PairPeriods(
            MakePeriod(1, T0, T1, T0),
            MakePeriod(1, T0, T0, T1));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task StoppedPeriod_ReturnsStopped()
    {
        var changes = PairPeriods(
            MakePeriod(1, T0, null, T0),
            MakePeriod(1, T0, T2, T1));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task EditedPeriod_ReturnsEdited()
    {
        var changes = PairPeriods(
            MakePeriod(1, T0, T1, T0),
            MakePeriod(3, T0, T1, T1));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task RestartAfterCancel_ReturnsStarted()
    {
        var t3 = Instant.FromUtc(2024, 9, 1, 0, 0);
        var t4 = Instant.FromUtc(2024, 12, 1, 0, 0);
        var changes = PairPeriods(
            MakePeriod(1, T0, T1, T0),
            MakePeriod(1, T0, T0, T1),
            MakePeriod(1, T0, t3, t4));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task FullLifecycle()
    {
        var t3 = Instant.FromUtc(2024, 9, 1, 0, 0);
        var t4 = Instant.FromUtc(2024, 12, 1, 0, 0);
        var changes = PairPeriods(
            MakePeriod(1, T0, null, T0),
            MakePeriod(2, T0, null, T1),
            MakePeriod(2, T0, t3, t3),
            MakePeriod(2, T0, T0, t4));
        var result = await ExecuteAsync(changes);
        await result.MatchSnapshotAsync();
    }

    private static HistoricalChargeLinkPeriodDto MakePeriod(int factor, Instant from, Instant? to, Instant created)
        => new(factor, from, to, created, string.Empty, false);

    private static List<ChargeLinkPeriodChange> PairPeriods(
        params HistoricalChargeLinkPeriodDto[] periods)
        => [.. periods.Select((p, i) => new ChargeLinkPeriodChange(p, i > 0 ? periods[i - 1] : null))];

    private static async Task<IExecutionResult> ExecuteAsync(List<ChargeLinkPeriodChange> changes)
    {
        var linkPeriod = new ChargeLinkPeriodDto(1, T0, T1);
        var server = new GraphQLTestService();

        server.ChargesClientMock
            .Setup(x => x.GetChargeLinkPeriodsAsync(MeteringPointId, It.IsAny<CancellationToken>()))
            .ReturnsAsync([new ChargeLinkPeriod(MeteringPointId, linkPeriod, ChargeId)]);

        server.ChargesClientMock
            .Setup(x => x.GetChargesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([new Charge(ChargeId, Resolution.Daily, false, false, "Tariff", [])]);

        server.ChargesClientMock
            .Setup(x => x.GetHistoricalChargeLinkPeriodsByIdAsync(
                It.IsAny<ChargeLinkPeriodId>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(changes);

        return await server.ExecuteRequestAsync(
            b => b
                .SetDocument(Query)
                .SetVariableValues(new Dictionary<string, object?> { { "meteringPointId", MeteringPointId } })
                .SetUser(ClaimsPrincipalMocks.CreateAdministrator()),
            CancellationToken.None);
    }
}
