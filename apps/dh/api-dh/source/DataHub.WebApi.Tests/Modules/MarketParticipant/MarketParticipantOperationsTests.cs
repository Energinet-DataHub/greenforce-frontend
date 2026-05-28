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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoints.GetMeteringPointTypes.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using FluentAssertions;
using Microsoft.FeatureManagement;
using Moq;
using Xunit;
using Em1MeteringPointType = Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1.MeteringPointType;
using MarketParticipantMeteringPointType = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.MeteringPointType;
using MeteringPointDto = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.MeteringPointDto;
using SharedMeteringPointType = Energinet.DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType;

namespace Energinet.DataHub.WebApi.Tests.Modules.MarketParticipant;

public class MarketParticipantOperationsTests
{
    [Fact]
    public async Task AddMeteringPointsToAdditionalRecipientAsync_ReturnsEquivalentMeteringPointMapping_ForEm1AndEm2Branches()
    {
        var marketParticipantId = Guid.NewGuid();
        var meteringPointIds = new[] { "571313180100000001", "571313180100000002" };

        var em1MappedMeteringPoints = await ExecuteMutationAndCaptureMappedMeteringPointsAsync(
            marketParticipantId,
            meteringPointIds,
            featureToggleEnabled: false);
        var em2MappedMeteringPoints = await ExecuteMutationAndCaptureMappedMeteringPointsAsync(
            marketParticipantId,
            meteringPointIds,
            featureToggleEnabled: true);

        em1MappedMeteringPoints.Should().BeEquivalentTo(
            em2MappedMeteringPoints,
            options => options.WithStrictOrdering());
    }

    [Fact]
    public async Task AddMeteringPointsToAdditionalRecipientAsync_Throws_WhenEm2QueryIsNotSuccessful()
    {
        var marketParticipantClient = new Mock<IMarketParticipantClient_V1>();
        var em1Client = new Mock<IElectricityMarketClient_V1>();
        var em2Client = new Mock<IElectricityMarketClient>();
        var featureManager = new Mock<IFeatureManager>();

        featureManager
            .Setup(x => x.IsEnabledAsync("PM120-DH3-METERING-POINTS-UI"))
            .ReturnsAsync(true);

        em2Client
            .Setup(x => x.SendAsync(It.IsAny<GetMeteringPointTypesQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<GetMeteringPointTypesResultDtoV1>.Fail("EM2 query failed"));

        var act = () => MarketParticipantOperations.AddMeteringPointsToAdditionalRecipientAsync(
            Guid.NewGuid(),
            new[] { "571313180100000001" },
            marketParticipantClient.Object,
            em1Client.Object,
            em2Client.Object,
            featureManager.Object,
            CancellationToken.None);

        await act.Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("GetMeteringPointTypesQueryV1 failed for 1 metering point(s): EM2 query failed");

        marketParticipantClient.Verify(
            x => x.AdditionalRecipientsPostAsync(
                It.IsAny<Guid>(),
                It.IsAny<IEnumerable<MeteringPointDto>>(),
                It.IsAny<CancellationToken>(),
                It.IsAny<string?>()),
            Times.Never);
    }

    private static async Task<List<MeteringPointDto>> ExecuteMutationAndCaptureMappedMeteringPointsAsync(
        Guid marketParticipantId,
        IReadOnlyCollection<string> meteringPointIds,
        bool featureToggleEnabled)
    {
        var marketParticipantClient = new Mock<IMarketParticipantClient_V1>();
        var em1Client = new Mock<IElectricityMarketClient_V1>();
        var em2Client = new Mock<IElectricityMarketClient>();
        var featureManager = new Mock<IFeatureManager>();
        List<MeteringPointDto>? mappedMeteringPoints = null;

        featureManager
            .Setup(x => x.IsEnabledAsync("PM120-DH3-METERING-POINTS-UI"))
            .ReturnsAsync(featureToggleEnabled);

        marketParticipantClient
            .Setup(x => x.AdditionalRecipientsPostAsync(
                marketParticipantId,
                It.IsAny<IEnumerable<MeteringPointDto>>(),
                It.IsAny<CancellationToken>(),
                It.IsAny<string?>()))
            .Callback<Guid, IEnumerable<MeteringPointDto>, CancellationToken, string?>((_, meteringPoints, _, _) => mappedMeteringPoints = meteringPoints.ToList())
            .Returns(Task.CompletedTask);

        em1Client
            .Setup(x => x.MeteringPointQueryTypeAsync(meteringPointIds, It.IsAny<CancellationToken>(), It.IsAny<string?>()))
            .ReturnsAsync(
            [
                new MeteringPointTypeQueryDto
                {
                    Identification = meteringPointIds.ElementAt(0),
                    Type = Em1MeteringPointType.Consumption,
                },
                new MeteringPointTypeQueryDto
                {
                    Identification = meteringPointIds.ElementAt(1),
                    Type = Em1MeteringPointType.Production,
                },
            ]);

        em2Client
            .Setup(x => x.SendAsync(It.IsAny<GetMeteringPointTypesQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                Result<GetMeteringPointTypesResultDtoV1>.Success(
                    new GetMeteringPointTypesResultDtoV1(
                    [
                        new MeteringPointTypeDtoV1(meteringPointIds.ElementAt(0), SharedMeteringPointType.Consumption),
                        new MeteringPointTypeDtoV1(meteringPointIds.ElementAt(1), SharedMeteringPointType.Production),
                    ])));

        await MarketParticipantOperations.AddMeteringPointsToAdditionalRecipientAsync(
            marketParticipantId,
            meteringPointIds,
            marketParticipantClient.Object,
            em1Client.Object,
            em2Client.Object,
            featureManager.Object,
            CancellationToken.None);

        mappedMeteringPoints.Should().NotBeNull();
        mappedMeteringPoints.Should().HaveCount(2);
        mappedMeteringPoints.Should().BeEquivalentTo(
            [
                new MeteringPointDto
                {
                    Identification = meteringPointIds.ElementAt(0),
                    MeteringPointType = MarketParticipantMeteringPointType.E17Consumption,
                },
                new MeteringPointDto
                {
                    Identification = meteringPointIds.ElementAt(1),
                    MeteringPointType = MarketParticipantMeteringPointType.E18Production,
                },
            ],
            options => options.WithStrictOrdering());

        return mappedMeteringPoints!;
    }
}
