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
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.ElectricityMarket.Abstractions.Processes.BRS_011.IncorrectMoveIn.V1;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Modules.MessageArchive;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Client;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.MessageArchive;

public class MeteringPointProcessNodeTests
{
    private const string MeteringPointId = "571313180400000005";
    private const string EnergySupplierGln = "5790001330552";
    private static readonly Guid _processOrchestrationId = Guid.Parse("6f1d24c8-8f64-4e9f-85ee-637de6d61512");

    [Fact]
    public async Task GetAvailableActionsAsync_CustomerMoveInWithinSixtyDays_IncludesInitiateIncorrectMoveIn()
    {
        var process = CreateCustomerMoveInProcess();
        var electricityMarketClient = CreateElectricityMarketClientReturning(
            new GetMoveInsByEnergySupplierIdResultDtoV1.MoveInDto(
                ValidityDate: DateTimeOffset.UtcNow.AddDays(-10),
                OrchestrationInstanceId: null));
        var eligibilityService = new IncorrectMoveInEligibilityService(electricityMarketClient.Object);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            eligibilityService,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
        electricityMarketClient.Verify(
            x => x.SendAsync(It.IsAny<GetMoveInsByEnergySupplierIdQueryV1>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_CustomerMoveInWithEmptyResult_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // EM returns an empty move-ins list, modeling the case where every matching move-in's
        // validity date fell outside the From filter (older than 60 days).
        var process = CreateCustomerMoveInProcess();
        var electricityMarketClient = CreateElectricityMarketClientReturning();
        var eligibilityService = new IncorrectMoveInEligibilityService(electricityMarketClient.Object);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            eligibilityService,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NonCustomerMoveInBusinessReason_DoesNotCallElectricityMarketAndDoesNotIncludeInitiateIncorrectMoveIn()
    {
        var process = CreateProcess(BusinessReason.EndOfSupply, meteringPointId: MeteringPointId);
        var electricityMarketClient = new Mock<IElectricityMarketClient>(MockBehavior.Strict);
        var eligibilityService = new IncorrectMoveInEligibilityService(electricityMarketClient.Object);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            eligibilityService,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        electricityMarketClient.Verify(
            x => x.SendAsync(It.IsAny<GetMoveInsByEnergySupplierIdQueryV1>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_CalledTwiceForSameMeteringPointAndSupplier_ElectricityMarketIsHitOnlyOnce()
    {
        // Verifies the per-request memoization: two CustomerMoveIn processes on the same
        // metering point share a single EM lookup via the scoped eligibility service.
        var firstProcess = CreateCustomerMoveInProcess();
        var secondProcess = CreateCustomerMoveInProcess();
        var electricityMarketClient = CreateElectricityMarketClientReturning(
            new GetMoveInsByEnergySupplierIdResultDtoV1.MoveInDto(
                ValidityDate: DateTimeOffset.UtcNow.AddDays(-5),
                OrchestrationInstanceId: null));
        var eligibilityService = new IncorrectMoveInEligibilityService(electricityMarketClient.Object);
        var httpContextAccessor = CreateHttpContextAccessor().Object;

        var firstActions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            firstProcess, eligibilityService, httpContextAccessor, CancellationToken.None);
        var secondActions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            secondProcess, eligibilityService, httpContextAccessor, CancellationToken.None);

        firstActions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        secondActions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        electricityMarketClient.Verify(
            x => x.SendAsync(It.IsAny<GetMoveInsByEnergySupplierIdQueryV1>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private static MeteringPointProcess CreateCustomerMoveInProcess() =>
        CreateProcess(BusinessReason.CustomerMoveIn, meteringPointId: MeteringPointId);

    private static MeteringPointProcess CreateProcess(BusinessReason businessReason, string? meteringPointId) =>
        new(
            Id: _processOrchestrationId.ToString(),
            TransactionId: "transaction-id",
            CreatedAt: new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            CutoffDate: null,
            BusinessReason: businessReason,
            ActorNumber: EnergySupplierGln,
            ActorRole: ActorRole.EnergySupplier.Name,
            State: MeteringPointProcessState.Pending,
            Actions: [WorkflowAction.CancelWorkflow],
            WorkflowSteps: null,
            MeteringPointId: meteringPointId);

    private static Mock<IElectricityMarketClient> CreateElectricityMarketClientReturning(
        params GetMoveInsByEnergySupplierIdResultDtoV1.MoveInDto[] moveIns)
    {
        var client = new Mock<IElectricityMarketClient>();
        client
            .Setup(x => x.SendAsync(It.IsAny<GetMoveInsByEnergySupplierIdQueryV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<GetMoveInsByEnergySupplierIdResultDtoV1>.Success(
                new GetMoveInsByEnergySupplierIdResultDtoV1(moveIns.ToList())));
        return client;
    }

    private static Mock<IHttpContextAccessor> CreateHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        var user = new ClaimsPrincipal(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim("actornumber", EnergySupplierGln),
                new Claim("marketroles", ActorRole.EnergySupplier.Name),
            },
            "MockedAuthenticationType"));
        httpContextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext { User = user });
        return httpContextAccessor;
    }
}
