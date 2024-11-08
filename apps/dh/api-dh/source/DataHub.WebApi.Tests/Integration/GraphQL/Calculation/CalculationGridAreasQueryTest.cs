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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationGridAreasQueryTests
{
    private static readonly Guid _batchId = new("d79fcebb-3338-4dc5-923f-a6c483319b43");

    private static readonly string _calculationByIdQuery =
    $$"""
    {
      calculationById(id: "{{_batchId}}") {
        gridAreas {
          code
          name
          displayName
        }
      }
    }
    """;

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetCalculationGridAreasAsync(bool useProcessManagerFeature)
    {
        var server = new GraphQLTestService();

        server.FeatureManagerMock
            .Setup(x => x.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager)))
            .ReturnsAsync(useProcessManagerFeature);

        SetupClientMockAccordingToFeatureFlag(
            useProcessManagerFeature,
            server,
            new CalculationDto()
            {
                CalculationId = _batchId,
                GridAreaCodes = ["003", "001", "002"],
            });

        server.MarketParticipantClientV1Mock
            .Setup(x => x.GridAreaGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync([
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "002", Name = "Grid Area 2" },
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "001", Name = "Grid Area 1" },
                new GridAreaDto() { Id = Guid.NewGuid(), Code = "003", Name = "Grid Area 3" },
            ]);

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync([]);

        var result = await server.ExecuteRequestAsync(b => b.SetDocument(_calculationByIdQuery));

        await result.MatchSnapshotAsync();
    }

    private static void SetupClientMockAccordingToFeatureFlag(bool useProcessManagerFeature, GraphQLTestService server, CalculationDto calculationDto)
    {
        if (useProcessManagerFeature)
        {
            server.ProcessManagerCalculationClientV1Mock
                .Setup(x => x.GetCalculationMappedAsync(_batchId))
                .ReturnsAsync(calculationDto);
        }
        else
        {
            server.WholesaleClientV3Mock
                .Setup(x => x.GetCalculationAsync(_batchId, default))
                .ReturnsAsync(calculationDto);
        }
    }
}
