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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Models;

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
            .Resolve(c => c.Parent<IOrchestrationInstanceTypedDto<T>>().Lifecycle.ToOrchestrationInstanceState());

        descriptor
            .Field("steps")
            .Type<NonNullType<ListType<NonNullType<ObjectType<OrchestrationInstanceStep>>>>>()
            .Resolve(c =>
            {
                var instance = c.Parent<IOrchestrationInstanceTypedDto<T>>();
                return instance.Steps
                    .OrderBy(step => step.Sequence)
                    .Select(step => MapToOrchestrationInstanceState(step.Lifecycle))
                    .Prepend(MapToOrchestrationInstanceState(instance.Lifecycle))
                    .Select(state => new OrchestrationInstanceStep(state));
            });
    }

    private static OrchestrationInstanceState MapToOrchestrationInstanceState(
        StepInstanceLifecycleDto lifecycle) => lifecycle switch
        {
            { State: StepInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: StepInstanceLifecycleState.Running } => OrchestrationInstanceState.Running,
            { State: StepInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationStepTerminationState.Skipped => OrchestrationInstanceState.Canceled,
                    OrchestrationStepTerminationState.Succeeded => OrchestrationInstanceState.Succeeded,
                    OrchestrationStepTerminationState.Failed => OrchestrationInstanceState.Failed,
                },
        };

    private static OrchestrationInstanceState MapToOrchestrationInstanceState(
        OrchestrationInstanceLifecycleDto lifecycle) => lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Running } => OrchestrationInstanceState.Succeeded,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => OrchestrationInstanceState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => OrchestrationInstanceState.Succeeded,
                    OrchestrationInstanceTerminationState.Failed => OrchestrationInstanceState.Succeeded,
                },
        };
}
