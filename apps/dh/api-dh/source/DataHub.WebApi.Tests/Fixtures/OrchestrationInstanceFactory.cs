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

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public static class OrchestrationInstanceFactory
{
    public static Guid Id { get; } = new("d79fcebb-3338-4dc5-923f-a6c483319b43");

    public static IOperatingIdentityDto Identity { get; } = new UserIdentityDto(
        new("67ee0eee-5d07-45e6-abda-828434cdc5fe"),
        new("8ff64118-45c5-4459-a0e8-cb37fad9e9bf"));

    public static OrchestrationInstanceTypedDto<T> CreateOrchestrationInstance<T>(
        T input,
        OrchestrationInstanceLifecycleState lifecycleState,
        OrchestrationInstanceTerminationState? terminationState,
        StepInstanceDto[]? steps = null,
        Guid? id = null)
        where T : class, IInputParameterDto
    {
        return new OrchestrationInstanceTypedDto<T>(
            id ?? Id,
            new OrchestrationInstanceLifecycleDto(
                Identity,
                lifecycleState,
                terminationState,
                terminationState == OrchestrationInstanceTerminationState.UserCanceled ? Identity : null,
                DateTimeOffset.Now,
                lifecycleState == OrchestrationInstanceLifecycleState.Pending ? DateTimeOffset.Now : null,
                lifecycleState == OrchestrationInstanceLifecycleState.Pending ? null : DateTimeOffset.Now,
                lifecycleState == OrchestrationInstanceLifecycleState.Running || lifecycleState == OrchestrationInstanceLifecycleState.Terminated ? DateTimeOffset.Now : null,
                lifecycleState == OrchestrationInstanceLifecycleState.Terminated ? DateTimeOffset.Now : null),
            steps ?? [],
            string.Empty,
            input);
    }
}