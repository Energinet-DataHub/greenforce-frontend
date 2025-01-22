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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Modules.Common.DataLoaders;
using Energinet.DataHub.WebApi.Modules.Common.Models;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Types;

public class OrchestrationInstanceType<T> : InterfaceType<IOrchestrationInstanceTypedDto<T>>
    where T : class, IInputParameterDto
{
    protected override void Configure(
        IInterfaceTypeDescriptor<IOrchestrationInstanceTypedDto<T>> descriptor)
    {
        descriptor.BindFieldsExplicitly();

        descriptor.Field(f => f.Id);

        descriptor
            .Field("createdAt")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.CreatedAt);

        descriptor
            .Field("scheduledAt")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.ScheduledToRunAt);

        descriptor
            .Field("startedAt")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.StartedAt);

        descriptor
            .Field("terminatedAt")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.TerminatedAt);

        descriptor
            .Field("createdBy")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.CreatedBy switch
            {
                UserIdentityDto user => c.DataLoader<UserBatchDataLoader>().LoadAsync(user.UserId),
                ActorIdentityDto => null,
                _ => null,
            });

        descriptor
            .Field("state")
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.ToProcessState());

        descriptor
            .Field("steps")
            .Type<NonNullType<ListType<NonNullType<ObjectType<OrchestrationInstanceStep>>>>>()
            .Resolve(c =>
            {
                var instance = c.Parent<IOrchestrationInstanceTypedDto<T>>();
                return instance.Steps
                    .OrderBy(step => step.Sequence)
                    .Select(step => CreateOrchestrationInstanceStep(instance, step))
                    .Prepend(CreateInitialOrchestrationInstanceStep(instance));
            });
    }

    private static OrchestrationInstanceStep CreateOrchestrationInstanceStep(
        IOrchestrationInstanceTypedDto<T> instance,
        StepInstanceDto step)
    {
        if (step.Lifecycle.TerminationState == OrchestrationStepTerminationState.Skipped)
        {
            return new OrchestrationInstanceStep(ProcessStepState.Skipped, false);
        }

        if (instance.Lifecycle.TerminationState == OrchestrationInstanceTerminationState.UserCanceled)
        {
            return new OrchestrationInstanceStep(ProcessStepState.Canceled, false);
        }

        var activeSteps = instance.Steps
            .OrderBy(s => s.Sequence)
            .Where(s => s.Lifecycle.TerminationState != OrchestrationStepTerminationState.Skipped);

        var lastActiveSequence = activeSteps.Select(s => s.Sequence).LastOrDefault();
        var currentSequence = activeSteps
            .Where(s => s.Lifecycle.TerminationState != OrchestrationStepTerminationState.Succeeded)
            .Select(s => s.Sequence)
            .FirstOrDefault(lastActiveSequence);

        var isCurrent = step.Sequence == currentSequence;
        var state = step.Lifecycle.ToProcessStepState();
        return new OrchestrationInstanceStep(state, isCurrent);
    }

    private static OrchestrationInstanceStep CreateInitialOrchestrationInstanceStep(
        IOrchestrationInstanceTypedDto<T> instance)
    {
        if (instance.Lifecycle.TerminationState == OrchestrationInstanceTerminationState.UserCanceled)
        {
            return new OrchestrationInstanceStep(ProcessStepState.Canceled, true);
        }

        var isCurrent = instance.Steps.All(s => s.Lifecycle.State == StepInstanceLifecycleState.Pending);
        var state = instance.Lifecycle.State switch
        {
            OrchestrationInstanceLifecycleState.Pending => ProcessStepState.Pending,
            OrchestrationInstanceLifecycleState.Queued => ProcessStepState.Pending,
            OrchestrationInstanceLifecycleState.Running => ProcessStepState.Succeeded,
            OrchestrationInstanceLifecycleState.Terminated => ProcessStepState.Succeeded,
        };

        return new OrchestrationInstanceStep(state, isCurrent);
    }
}
