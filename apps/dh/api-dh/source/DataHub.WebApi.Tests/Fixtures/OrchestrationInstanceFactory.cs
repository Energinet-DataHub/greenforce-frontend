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
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public static class OrchestrationInstanceFactory
{
    public static Guid Id { get; } = new("d79fcebb-3338-4dc5-923f-a6c483319b43");

    public static IOperatingIdentityDto Identity { get; } = new UserIdentityDto(
        new("67ee0eee-5d07-45e6-abda-828434cdc5fe"),
        ActorNumber.Create("1234567890123"),
        ActorRole.EnergySupplier);

    public static DateTimeOffset CreatedAt { get; } = DateTimeOffset.Now;

    public static DateTimeOffset ScheduledToRunAt { get; } = DateTimeOffset.Now.AddHours(1);

    public static DateTimeOffset QueuedAt { get; } = DateTimeOffset.Now.AddHours(1).AddMinutes(1);

    public static DateTimeOffset StartedAt { get; } = DateTimeOffset.Now.AddHours(1).AddMinutes(2);

    public static DateTimeOffset TerminatedAt { get; } = DateTimeOffset.Now.AddHours(2);

    public static WholesaleCalculationResultV1 CreateOrchestrationInstance(
        CalculationInputV1 input,
        OrchestrationInstanceLifecycleState state,
        OrchestrationInstanceTerminationState? terminationState,
        StepInstanceDto[]? steps = null,
        Guid? id = null) =>
        new WholesaleCalculationResultV1(
            id ?? Id,
            GetLifecycle(state, terminationState),
            steps ?? [],
            string.Empty,
            input);

    private static OrchestrationInstanceLifecycleDto GetLifecycle(
        OrchestrationInstanceLifecycleState state,
        OrchestrationInstanceTerminationState? terminationState) =>
        new OrchestrationInstanceLifecycleDto(
            Identity,
            state,
            terminationState,
            terminationState == OrchestrationInstanceTerminationState.UserCanceled ? Identity : null,
            CreatedAt,
            state == OrchestrationInstanceLifecycleState.Pending ? ScheduledToRunAt : null,
            state == OrchestrationInstanceLifecycleState.Pending ? null : QueuedAt,
            state == OrchestrationInstanceLifecycleState.Running || terminationState != null ? StartedAt : null,
            state == OrchestrationInstanceLifecycleState.Terminated ? TerminatedAt : null);
}
