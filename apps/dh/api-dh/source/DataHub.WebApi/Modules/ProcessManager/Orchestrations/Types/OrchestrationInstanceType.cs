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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Types;

public class OrchestrationInstanceType<T> : InterfaceType<IOrchestrationInstance<T>>
    where T : class, IInputParameterDto
{
    protected override void Configure(
        IInterfaceTypeDescriptor<IOrchestrationInstance<T>> descriptor)
    {
        descriptor.Name(dependency => dependency.Name + "OrchestrationInstance");
        descriptor.BindFieldsExplicitly();

        descriptor.Field(f => f.Id);

        descriptor
            .Field("createdAt")
            .Resolve(c => c.Parent<IOrchestrationInstance<T>>().Lifecycle.CreatedAt);

        descriptor
            .Field("createdBy")
            .Resolve(c => c.Parent<IOrchestrationInstance<T>>().Lifecycle.CreatedBy switch
            {
                UserIdentityDto user => c.DataLoader<UserBatchDataLoader>().LoadAsync(user.UserId),
                ActorIdentityDto => null,
                _ => null,
            });

        descriptor
            .Field("state")
            .Resolve(c => c.Parent<IOrchestrationInstance<T>>().Lifecycle.ToOrchestrationInstanceState());

        descriptor
            .Field("currentStep")
            .Resolve(c => c.Parent<IOrchestrationInstance<T>>().Steps
                .Where(s => s.Lifecycle.State != StepInstanceLifecycleState.Pending)
                .Select(s => s.Sequence)
                .Order()
                .FirstOrDefault(0));

        descriptor
            .Field("steps")
            .Resolve(c =>
            {
                var f = c.Parent<IOrchestrationInstance<T>>();
                return f.Steps
                    .Select(s => new OrchestrationStep(s.Lifecycle.ToOrchestrationInstanceState()))
                    .Prepend(new OrchestrationStep(GetInitialStepState(f.Lifecycle)));
            });
    }

    private static OrchestrationInstanceState GetInitialStepState(OrchestrationInstanceLifecycleDto lifecycle) =>
        lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => OrchestrationInstanceState.Queued,
            { State: OrchestrationInstanceLifecycleState.Running } => OrchestrationInstanceState.Completed,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => OrchestrationInstanceState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => OrchestrationInstanceState.Completed,
                    OrchestrationInstanceTerminationState.Failed => OrchestrationInstanceState.Completed,
                },
        };
}
