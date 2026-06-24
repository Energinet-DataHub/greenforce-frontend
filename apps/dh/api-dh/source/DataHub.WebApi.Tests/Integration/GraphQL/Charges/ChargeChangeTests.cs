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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Abstractions.Api.V1.HistoricalChargeInformationPeriods;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Charges;

public class ChargeChangeTests
{
    private static readonly Instant T0 = Instant.FromUtc(2024, 1, 1, 0, 0);
    private static readonly Instant T1 = Instant.FromUtc(2024, 6, 1, 0, 0);
    private static readonly Instant T2 = Instant.FromUtc(2024, 9, 1, 0, 0);
    private static readonly Instant T3 = Instant.FromUtc(2024, 12, 1, 0, 0);

    private static readonly ChargeIdentifierDto ChargeId =
        new("TAR001", "1234567890", ChargeTypeDto.Tariff);

    private static readonly string EncodedChargeId =
        JsonBase64Converter.Serialize(ChargeId);

    private static readonly string Query =
    """
    query ($id: String!) {
      chargeById(id: $id) {
        id
        history {
          __typename
          createdAt
          effectiveDate
          ... on ChargeNameChanged {
            previousName
            currentName
          }
          ... on ChargeDescriptionChanged {
            previousDescription
            currentDescription
          }
          ... on ChargeVatChanged {
            previousVat
            currentVat
          }
          ... on ChargeTransparentInvoicingChanged {
            previousTransparentInvoicing
            currentTransparentInvoicing
          }
        }
      }
    }
    """;

    [Fact]
    public async Task SinglePeriod_ReturnsStarted()
    {
        var result = await ExecuteAsync(
            [new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true)]);
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task NameChanged()
    {
        var result = await ExecuteAsync(
            new("Original", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Updated", "Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task DescriptionChanged()
    {
        var result = await ExecuteAsync(
            new("Name", "Original", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Name", "Updated", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task VatChanged()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.NoVat, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task TransparentInvoicingChanged()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, false, T0, null, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ChargeStopped()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, T2, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ChargeResumed()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, T2, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ChargeCancelled()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, T0, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task MultipleChangesInSinglePeriod()
    {
        var result = await ExecuteAsync(
            new("Original", "Original Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Updated", "Updated Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task ResumedWithChanges()
    {
        var result = await ExecuteAsync(
            new("Original", "Desc", VatClassificationDto.Vat25, true, T0, T2, T0, "orch-1", true),
            new("Updated", "Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task FullLifecycle()
    {
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Updated", "Desc", VatClassificationDto.Vat25, true, T0, null, T1, "orch-2", true),
            new("Updated", "Desc", VatClassificationDto.Vat25, true, T0, T2, T2, "orch-3", true),
            new("Restarted", "New Desc", VatClassificationDto.Vat25, true, T0, null, T3, "orch-4", true));
        await result.MatchSnapshotAsync();
    }

    [Fact]
    public async Task DuplicateOrchestrationId_TakesLast()
    {
        // Two periods with the same orchestration ID — only the last (by StartDate) is used
        var result = await ExecuteAsync(
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, null, T0, "orch-1", true),
            new("Name", "Desc", VatClassificationDto.Vat25, true, T0, T1, T1, "orch-2", true),
            new("Updated", "Desc", VatClassificationDto.Vat25, true, T1, null, T1, "orch-2", true));
        await result.MatchSnapshotAsync();
    }

    private static async Task<IExecutionResult> ExecuteAsync(
        params HistoricalChargeInformationPeriodDto[] periods)
    {
        var server = new GraphQLTestService();
        var charge = new Charge(ChargeId, Resolution.Daily, false, false, "Tariff", []);
        var changes = ChargeChange.From(periods);

        server.ChargesClientMock
            .Setup(x => x.GetChargeByIdAsync(It.IsAny<ChargeIdentifierDto>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(charge);

        server.ChargesClientMock
            .Setup(x => x.GetChargeHistoryAsync(It.IsAny<ChargeIdentifierDto>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(changes);

        return await server.ExecuteRequestAsync(
            b => b
                .SetDocument(Query)
                .SetVariableValues(new Dictionary<string, object?> { { "id", EncodedChargeId } })
                .SetUser(ClaimsPrincipalMocks.CreateAdministrator()),
            CancellationToken.None);
    }
}
