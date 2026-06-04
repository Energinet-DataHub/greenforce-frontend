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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Modules.MessageArchive;
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
    public async Task GetAvailableActionsAsync_EligibleCustomerMoveIn_IncludesInitiateIncorrectMoveIn()
    {
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader(isEligible: true);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        actions.Should().Contain(MeteringPointProcessAction.CancelWorkflow);
        dataLoader.Verify(
            x => x.LoadAsync(
                It.Is<(string MeteringPointId, string EnergySupplierId)>(
                    k => k.MeteringPointId == MeteringPointId && k.EnergySupplierId == EnergySupplierGln),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_IneligibleCustomerMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // Eligibility data loader returns false, modeling the case where no matching
        // move-in exists in EM within the 60-day lookback window.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader(isEligible: false);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NonCustomerMoveInBusinessReason_DoesNotInvokeDataLoaderAndDoesNotIncludeInitiateIncorrectMoveIn()
    {
        var process = CreateProcess(BusinessReason.EndOfSupply, meteringPointId: MeteringPointId);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        dataLoader.Verify(
            x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
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

    private static Mock<IIncorrectMoveInEligibilityDataLoader> CreateEligibilityDataLoader(bool isEligible)
    {
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(isEligible);
        return dataLoader;
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
