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
    private static readonly Guid _otherProcessOrchestrationId = Guid.Parse("aa1d24c8-8f64-4e9f-85ee-637de6d6151a");

    [Fact]
    public async Task GetAvailableActionsAsync_EligibleCustomerMoveIn_IncludesInitiateIncorrectMoveIn()
    {
        var process = CreateCustomerMoveInProcess();
        var dataLoader = CreateEligibilityDataLoader(isEligible: true);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
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
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_NonCustomerMoveInBusinessReason_DoesNotInvokeDataLoaderAndDoesNotIncludeInitiateIncorrectMoveIn()
    {
        var process = CreateProcess(BusinessReason.EndOfSupply, meteringPointId: MeteringPointId);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
        dataLoader.Verify(
            x => x.LoadAsync(
                It.IsAny<(string MeteringPointId, string EnergySupplierId)>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_CustomerMoveInWithinWindow_IncludesInitiateIncorrectMoveInWithoutCallingDataLoader()
    {
        // FAS has no supplier GLN to scope EM against; we surface the action whenever the
        // process's own cutoff is inside the 60-day window. Strict mock fails if the data
        // loader is touched.
        var cutoff = DateTimeOffset.UtcNow.AddDays(-10);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().Contain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_CustomerMoveInOutsideWindow_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        var cutoff = DateTimeOffset.UtcNow.AddDays(-61);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _processOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_PendingCustomerMoveIn_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // A still-pending CustomerMoveIn cannot be corrected, so the action must not appear.
        // Strict mocks on both loaders prove the short-circuit happens before any data is loaded.
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            state: MeteringPointProcessState.Pending);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>(MockBehavior.Strict);

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_SucceededButNotLatest_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // The process is Succeeded but a newer CustomerMoveIn supersedes it on the same
        // metering point, so InitiateIncorrectMoveIn must not be offered. The EM loader is
        // strict to prove the latest gate short-circuits before per-supplier eligibility is checked.
        var process = CreateCustomerMoveInProcess();
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _otherProcessOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    [Fact]
    public async Task GetAvailableActionsAsync_FasUser_NotLatest_DoesNotIncludeInitiateIncorrectMoveIn()
    {
        // Same "latest" gate as the non-FAS path. The cutoff is inside the 60-day FAS
        // window so the only reason the action should not appear is the latest check.
        var cutoff = DateTimeOffset.UtcNow.AddDays(-10);
        var process = CreateProcess(
            BusinessReason.CustomerMoveIn,
            MeteringPointId,
            cutoff,
            state: MeteringPointProcessState.Succeeded);
        var dataLoader = new Mock<IIncorrectMoveInEligibilityDataLoader>(MockBehavior.Strict);
        var latestLoader = CreateLatestDataLoader(latestProcessId: _otherProcessOrchestrationId.ToString());

        var actions = await MeteringPointProcessNode.GetAvailableActionsAsync(
            process,
            dataLoader.Object,
            latestLoader.Object,
            CreateFasHttpContextAccessor().Object,
            CancellationToken.None);

        actions.Should().NotContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
    }

    private static MeteringPointProcess CreateCustomerMoveInProcess() =>
        CreateProcess(
            BusinessReason.CustomerMoveIn,
            meteringPointId: MeteringPointId,
            state: MeteringPointProcessState.Succeeded);

    private static MeteringPointProcess CreateProcess(
        BusinessReason businessReason,
        string? meteringPointId,
        DateTimeOffset? cutoffDate = null,
        MeteringPointProcessState state = MeteringPointProcessState.Pending) =>
        new(
            Id: _processOrchestrationId.ToString(),
            TransactionId: "transaction-id",
            CreatedAt: new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            CutoffDate: cutoffDate,
            BusinessReason: businessReason,
            ActorNumber: EnergySupplierGln,
            ActorRole: ActorRole.EnergySupplier.Name,
            State: state,
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

    private static Mock<ILatestCustomerMoveInProcessIdDataLoader> CreateLatestDataLoader(string? latestProcessId)
    {
        var dataLoader = new Mock<ILatestCustomerMoveInProcessIdDataLoader>();
        dataLoader
            .Setup(x => x.LoadAsync(
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(latestProcessId);
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

    private static Mock<IHttpContextAccessor> CreateFasHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        var user = new ClaimsPrincipal(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim("multitenancy", "true"),
            },
            "MockedAuthenticationType"));
        httpContextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext { User = user });
        return httpContextAccessor;
    }
}
