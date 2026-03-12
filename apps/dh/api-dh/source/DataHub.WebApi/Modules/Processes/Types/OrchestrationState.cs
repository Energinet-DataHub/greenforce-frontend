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

using Energinet.DataHub.ProcessManager.Abstractions.Api.OrchestrationInstance.Model;

namespace Energinet.DataHub.WebApi.Modules.Processes.Types;

public enum OrchestrationState
{
    [GraphQLName("scheduled")]
    Scheduled,
    [GraphQLName("pending")]
    Pending,
    [GraphQLName("running")]
    Running,
    [GraphQLName("failed")]
    Failed,
    [GraphQLName("canceled")]
    Canceled,
    [GraphQLName("succeeded")]
    Succeeded,
}

public static class OrchestrationStateExtensions
{
    public static OrchestrationState ToOrchestrationState(
        this OrchestrationInstanceLifecycleDto lifecycle) => lifecycle switch
        {
            { ScheduledToRunAt: not null, State: OrchestrationInstanceLifecycleState.Pending }
                when lifecycle.ScheduledToRunAt > DateTimeOffset.Now => OrchestrationState.Scheduled,
            { State: OrchestrationInstanceLifecycleState.Pending } => OrchestrationState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => OrchestrationState.Pending,
            { State: OrchestrationInstanceLifecycleState.Running } => OrchestrationState.Running,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => OrchestrationState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => OrchestrationState.Succeeded,
                    OrchestrationInstanceTerminationState.Failed => OrchestrationState.Failed,
                    _ => throw new ArgumentOutOfRangeException(),
                },
            _ => throw new ArgumentOutOfRangeException(),
        };

    public static List<OrchestrationInstanceLifecycleState> ToListOfOrchestrationInstanceLifecycleState(
        this OrchestrationState status) => status switch
        {
            OrchestrationState.Scheduled => [OrchestrationInstanceLifecycleState.Pending],
            OrchestrationState.Pending => [OrchestrationInstanceLifecycleState.Pending, OrchestrationInstanceLifecycleState.Queued],
            OrchestrationState.Running => [OrchestrationInstanceLifecycleState.Running],
            OrchestrationState.Failed => [OrchestrationInstanceLifecycleState.Terminated],
            OrchestrationState.Canceled => [OrchestrationInstanceLifecycleState.Terminated],
            OrchestrationState.Succeeded => [OrchestrationInstanceLifecycleState.Terminated],
        };

    public static OrchestrationInstanceTerminationState? ToOrchestrationInstanceTerminationState(
        this OrchestrationState status) => status switch
        {
            OrchestrationState.Scheduled => null,
            OrchestrationState.Pending => null,
            OrchestrationState.Running => null,
            OrchestrationState.Failed => OrchestrationInstanceTerminationState.Failed,
            OrchestrationState.Canceled => OrchestrationInstanceTerminationState.UserCanceled,
            OrchestrationState.Succeeded => OrchestrationInstanceTerminationState.Succeeded,
        };
}
