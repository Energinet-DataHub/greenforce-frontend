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

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Types;

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
                UserIdentityDto user => c.DataLoader<AuditIdentityBatchDataLoader>().LoadAsync(user.UserId),
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
        StepInstanceDto step) =>
        new OrchestrationInstanceStep(step.Lifecycle.ToProcessStepState(), IsCurrentStep(instance, step));

    private static OrchestrationInstanceStep CreateInitialOrchestrationInstanceStep(
        IOrchestrationInstanceTypedDto<T> instance) => instance.Lifecycle.State switch
        {
            OrchestrationInstanceLifecycleState.Pending =>
                new OrchestrationInstanceStep(ProcessStepState.Pending, true),
            OrchestrationInstanceLifecycleState.Queued or
            OrchestrationInstanceLifecycleState.Running =>
                new OrchestrationInstanceStep(ProcessStepState.Succeeded, false),
            OrchestrationInstanceLifecycleState.Terminated =>
                instance.Lifecycle.TerminationState == OrchestrationInstanceTerminationState.UserCanceled
                    ? new OrchestrationInstanceStep(ProcessStepState.Canceled, true)
                    : new OrchestrationInstanceStep(ProcessStepState.Succeeded, false),
        };

    private static bool IsCurrentStep(
        IOrchestrationInstanceTypedDto<T> instance,
        StepInstanceDto step) => instance.Lifecycle.State switch
        {
            OrchestrationInstanceLifecycleState.Pending => false,
            OrchestrationInstanceLifecycleState.Queued => step.Sequence == 1,
            OrchestrationInstanceLifecycleState.Running => step.Lifecycle.State switch
            {
                StepInstanceLifecycleState.Pending =>
                    step.Sequence == instance.Steps
                        .OrderBy(s => s.Sequence)
                        .Where(s => s.Lifecycle.TerminationState != StepInstanceTerminationState.Skipped)
                        .First(s => s.Lifecycle.TerminationState != StepInstanceTerminationState.Succeeded)
                        .Sequence,
                StepInstanceLifecycleState.Running => true,
                StepInstanceLifecycleState.Terminated => false,
            },
            OrchestrationInstanceLifecycleState.Terminated => instance.Lifecycle.TerminationState switch
            {
                OrchestrationInstanceTerminationState.UserCanceled => false,
                OrchestrationInstanceTerminationState.Failed =>
                    step.Lifecycle.TerminationState == StepInstanceTerminationState.Failed,
                OrchestrationInstanceTerminationState.Succeeded =>
                        step.Sequence == instance.Steps
                            .OrderBy(s => s.Sequence)
                            .Last(s => s.Lifecycle.TerminationState != StepInstanceTerminationState.Skipped)
                            .Sequence,
            },
        };
}
