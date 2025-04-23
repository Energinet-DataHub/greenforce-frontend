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

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Types;

public enum ProcessStepState
{
    [GraphQLName("pending")]
    Pending,
    [GraphQLName("running")]
    Running,
    [GraphQLName("failed")]
    Failed,
    [GraphQLName("skipped")]
    Skipped,
    [GraphQLName("canceled")]
    Canceled,
    [GraphQLName("succeeded")]
    Succeeded,
}

public static class ProcessStepStateExtensions
{
    public static ProcessStepState ToProcessStepState(
        this StepInstanceLifecycleDto lifecycle) => lifecycle.State switch
        {
            StepInstanceLifecycleState.Pending => ProcessStepState.Pending,
            StepInstanceLifecycleState.Running => ProcessStepState.Running,
            StepInstanceLifecycleState.Terminated => lifecycle.TerminationState switch
            {
                StepInstanceTerminationState.Skipped => ProcessStepState.Skipped,
                StepInstanceTerminationState.Succeeded => ProcessStepState.Succeeded,
                StepInstanceTerminationState.Failed => ProcessStepState.Failed,
            },
        };
}
