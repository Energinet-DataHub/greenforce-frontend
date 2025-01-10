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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Enums;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Extensions;

public static class OrchestrationInstanceStateExtensions
{
    public static OrchestrationInstanceLifecycleStates ToLifecycleState(
        this OrchestrationInstanceState status) =>
        status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceLifecycleStates.Terminated,
            OrchestrationInstanceState.Completed => OrchestrationInstanceLifecycleStates.Terminated,
            OrchestrationInstanceState.Executing => OrchestrationInstanceLifecycleStates.Running,
            OrchestrationInstanceState.Failed => OrchestrationInstanceLifecycleStates.Terminated,
            OrchestrationInstanceState.Pending => OrchestrationInstanceLifecycleStates.Pending,
            OrchestrationInstanceState.Queued => OrchestrationInstanceLifecycleStates.Queued,
        };

    public static OrchestrationInstanceTerminationStates? ToTerminationState(
        this OrchestrationInstanceState status) =>
        status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceTerminationStates.UserCanceled,
            OrchestrationInstanceState.Completed => OrchestrationInstanceTerminationStates.Succeeded,
            OrchestrationInstanceState.Executing => null,
            OrchestrationInstanceState.Failed => OrchestrationInstanceTerminationStates.Failed,
            OrchestrationInstanceState.Pending => null,
            OrchestrationInstanceState.Queued => null,
        };

    public static OrchestrationInstanceState ToOrchestrationInstanceState(
        this OrchestrationInstanceLifecycleStateDto lifecycle) =>
        lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleStates.Pending } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleStates.Queued } => OrchestrationInstanceState.Queued,
            { State: OrchestrationInstanceLifecycleStates.Running } => OrchestrationInstanceState.Executing,
            { State: OrchestrationInstanceLifecycleStates.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationStates.UserCanceled => OrchestrationInstanceState.Canceled,
                    OrchestrationInstanceTerminationStates.Succeeded => OrchestrationInstanceState.Completed,
                    OrchestrationInstanceTerminationStates.Failed => OrchestrationInstanceState.Failed,
                },
        };

    public static OrchestrationInstanceState ToOrchestrationInstanceState(this StepInstanceLifecycleStateDto lifecycle) =>
        lifecycle switch
        {
            { State: StepInstanceLifecycleStates.Pending } => OrchestrationInstanceState.Pending,
            { State: StepInstanceLifecycleStates.Running } => OrchestrationInstanceState.Executing,
            { State: StepInstanceLifecycleStates.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationStepTerminationStates.Skipped => OrchestrationInstanceState.Canceled,
                    OrchestrationStepTerminationStates.Succeeded => OrchestrationInstanceState.Completed,
                    OrchestrationStepTerminationStates.Failed => OrchestrationInstanceState.Failed,
                },
        };
}
