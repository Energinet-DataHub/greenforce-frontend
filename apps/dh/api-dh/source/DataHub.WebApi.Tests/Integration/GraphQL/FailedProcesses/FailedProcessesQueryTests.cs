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
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.ProcessManager.Abstractions.Api.OrchestrationInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using MaskedActorIdentityDto = Energinet.DataHub.ProcessManager.Abstractions.Api.OperatingIdentity.Model.MaskedActorIdentityDto;
using PmActorNumber = Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects.ActorNumber;
using PmActorRole = Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects.ActorRole;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.FailedProcesses;

public class FailedProcessesQueryTests
{
    private const string EnergySupplierGln = "5790001330552";

    private static readonly Guid _moveInId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid _endOfSupplyId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid _failingLookupId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    private static readonly string _failedProcessesQuery =
    """
      query {
        failedProcesses {
          totalCount
          items {
            id
            processType
            meteringPointId
            createdBy {
              id
              name
              glnOrEicNumber
              marketRole
            }
            createdAt
            suspendedAt
            suspendReason
            suspendContext
            orchestrationInstanceId
          }
        }
      }
    """;

    [Fact]
    public async Task GetFailedProcessesAsync()
    {
        var server = new GraphQLTestService();
        var user = ClaimsPrincipalMocks.CreateFasAdministrator();

        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext { User = user });

        server.ProcessManagerClientMock
            .Setup(x => x.SearchSuspendedWorkflowInstancesAsync(
                It.IsAny<SearchSuspendedWorkflowInstancesQuery>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new SuspendedWorkflowInstancesResultDto(
                [
                    CreateSuspendedWorkflowInstance(
                        id: _moveInId,
                        businessReason: BusinessReason.CustomerMoveIn,
                        meteringPointId: "571313180400000005",
                        createdBy: new MaskedActorIdentityDto(
                            PmActorNumber.Create(EnergySupplierGln),
                            PmActorRole.EnergySupplier),
                        suspendReason: OrchestrationInstanceSuspendReason.UnhandledFailure,
                        suspendContext: "System.InvalidOperationException: Something went wrong"),
                    CreateSuspendedWorkflowInstance(
                        id: _endOfSupplyId,
                        businessReason: BusinessReason.EndOfSupply,
                        meteringPointId: "571313180400000006",
                        createdBy: new MaskedActorIdentityDto(
                            null,
                            PmActorRole.EnergySupplier),
                        suspendReason: OrchestrationInstanceSuspendReason.RetryDurationExceeded,
                        suspendContext: null),
                    CreateSuspendedWorkflowInstance(
                        id: _failingLookupId,
                        businessReason: BusinessReason.ChangeOfEnergySupplier,
                        meteringPointId: "571313180400000007",
                        createdBy: new MaskedActorIdentityDto(
                            PmActorNumber.Create(EnergySupplierGln),
                            PmActorRole.EnergySupplier),
                        suspendReason: OrchestrationInstanceSuspendReason.OrchestrationFailed,
                        suspendContext: "Orchestration failed"),
                ],
                TotalCount: 42,
                NextCursor: null));

        server.ProcessManagerClientMock
            .Setup(x => x.GetWorkflowInstanceByIdQueryAsync(
                It.Is<GetWorkflowInstanceByIdQuery>(q => q.Id == _moveInId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreateWorkflowInstanceWithSteps(_moveInId, BusinessReason.CustomerMoveIn, "Brs_009"));

        server.ProcessManagerClientMock
            .Setup(x => x.GetWorkflowInstanceByIdQueryAsync(
                It.Is<GetWorkflowInstanceByIdQuery>(q => q.Id == _endOfSupplyId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreateWorkflowInstanceWithSteps(_endOfSupplyId, BusinessReason.EndOfSupply, "Brs_002"));

        server.ProcessManagerClientMock
            .Setup(x => x.GetWorkflowInstanceByIdQueryAsync(
                It.Is<GetWorkflowInstanceByIdQuery>(q => q.Id == _failingLookupId),
                It.IsAny<CancellationToken>()))
            .ThrowsAsync(new HttpRequestException("Workflow instance lookup failed"));

        server.MarketParticipantClientV1Mock
            .Setup(x => x.ActorGetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(
            [
                new ActorDto
                {
                    ActorId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = new ActorNameDto { Value = "Test Energy Supplier" },
                    ActorNumber = new ActorNumberDto { Value = EnergySupplierGln },
                    MarketRole = new ActorMarketRoleDto { EicFunction = EicFunction.EnergySupplier },
                    OrganizationId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Status = "Active",
                },
            ]);

        var result = await server.ExecuteRequestAsync(
            b => b
                .SetDocument(_failedProcessesQuery)
                .SetUser(user),
            CancellationToken.None);

        await result.MatchSnapshotAsync();
    }

    private static SuspendedWorkflowInstanceDto CreateSuspendedWorkflowInstance(
        Guid id,
        BusinessReason businessReason,
        string meteringPointId,
        MaskedActorIdentityDto createdBy,
        OrchestrationInstanceSuspendReason suspendReason,
        string? suspendContext) =>
        new(
            Id: id,
            BusinessReason: businessReason,
            MeteringPointId: meteringPointId,
            Lifecycle: new SuspendedWorkflowInstanceLifecycleDto(
                CreatedBy: createdBy,
                State: WorkflowInstanceLifecycleState.Suspended,
                CreatedAt: new DateTimeOffset(2025, 5, 1, 12, 0, 0, TimeSpan.Zero),
                SuspendedAt: new DateTimeOffset(2025, 5, 2, 8, 30, 0, TimeSpan.Zero)),
            SuspendedOrchestrationInstance: new SuspendedOrchestrationInstanceDto(
                Id: Guid.Parse($"99999999-9999-9999-9999-{id.ToString()[^12..]}"),
                Lifecycle: new SuspendedOrchestrationInstanceLifecycleDto(
                    CreatedBy: createdBy,
                    State: OrchestrationInstanceLifecycleState.Suspended,
                    CreatedAt: new DateTimeOffset(2025, 5, 1, 12, 0, 0, TimeSpan.Zero),
                    StartedAt: new DateTimeOffset(2025, 5, 1, 12, 5, 0, TimeSpan.Zero),
                    SuspendedAt: new DateTimeOffset(2025, 5, 2, 8, 30, 0, TimeSpan.Zero),
                    SuspendReason: suspendReason,
                    SuspendContext: suspendContext)));

    private static WorkflowInstanceWithStepsDto CreateWorkflowInstanceWithSteps(
        Guid id,
        BusinessReason businessReason,
        string workflowDescriptionName) =>
        new(
            Id: id,
            Lifecycle: new WorkflowInstanceLifecycleDto(
                CreatedBy: new MaskedActorIdentityDto(
                    PmActorNumber.Create(EnergySupplierGln),
                    PmActorRole.EnergySupplier),
                State: WorkflowInstanceLifecycleState.Suspended,
                TerminationState: null,
                CreatedAt: new DateTimeOffset(2025, 5, 1, 12, 0, 0, TimeSpan.Zero),
                TerminatedAt: null,
                SuspendedAt: new DateTimeOffset(2025, 5, 2, 8, 30, 0, TimeSpan.Zero),
                ResumedAt: null,
                CanceledByWorkflowInstanceId: null),
            BusinessReason: businessReason,
            ExpectedValidityDate: null,
            Steps: [],
            Actions: [],
            WorkflowDescriptionName: workflowDescriptionName);
}
