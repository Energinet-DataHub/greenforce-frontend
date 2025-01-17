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

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Models;

public enum OrchestrationInstanceState
{
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

public static class OrchestrationInstanceStateExtensions
{
    public static OrchestrationInstanceState ToOrchestrationInstanceState(
        this OrchestrationInstanceLifecycleDto lifecycle) => lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Running } => OrchestrationInstanceState.Running,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => OrchestrationInstanceState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => OrchestrationInstanceState.Succeeded,
                    OrchestrationInstanceTerminationState.Failed => OrchestrationInstanceState.Failed,
                },
        };

    public static OrchestrationInstanceLifecycleState ToLifecycleState(
        this OrchestrationInstanceState status) => status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Succeeded => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Running => OrchestrationInstanceLifecycleState.Running,
            OrchestrationInstanceState.Failed => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Pending => OrchestrationInstanceLifecycleState.Pending,
        };

    public static OrchestrationInstanceTerminationState? ToTerminationState(
        this OrchestrationInstanceState status) => status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceTerminationState.UserCanceled,
            OrchestrationInstanceState.Succeeded => OrchestrationInstanceTerminationState.Succeeded,
            OrchestrationInstanceState.Running => null,
            OrchestrationInstanceState.Failed => OrchestrationInstanceTerminationState.Failed,
            OrchestrationInstanceState.Pending => null,
        };
}
