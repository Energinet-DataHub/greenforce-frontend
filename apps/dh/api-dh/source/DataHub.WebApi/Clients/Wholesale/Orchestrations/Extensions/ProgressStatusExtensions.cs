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
using Energinet.DataHub.WebApi.GraphQL.Enums;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Extensions;

public static class ProgressStatusExtensions
{
    public static OrchestrationInstanceLifecycleStates ToLifecycleState(
        this ProgressStatus status) =>
        status switch
        {
            ProgressStatus.Canceled => OrchestrationInstanceLifecycleStates.Terminated,
            ProgressStatus.Completed => OrchestrationInstanceLifecycleStates.Terminated,
            ProgressStatus.Executing => OrchestrationInstanceLifecycleStates.Running,
            ProgressStatus.Failed => OrchestrationInstanceLifecycleStates.Terminated,
            ProgressStatus.Pending => OrchestrationInstanceLifecycleStates.Pending,
            ProgressStatus.Queued => OrchestrationInstanceLifecycleStates.Queued,
        };

    public static OrchestrationInstanceTerminationStates? ToTerminationState(
        this ProgressStatus status) =>
        status switch
        {
            ProgressStatus.Canceled => OrchestrationInstanceTerminationStates.UserCanceled,
            ProgressStatus.Completed => OrchestrationInstanceTerminationStates.Succeeded,
            ProgressStatus.Executing => null,
            ProgressStatus.Failed => OrchestrationInstanceTerminationStates.Failed,
            ProgressStatus.Pending => null,
            ProgressStatus.Queued => null,
        };
}
