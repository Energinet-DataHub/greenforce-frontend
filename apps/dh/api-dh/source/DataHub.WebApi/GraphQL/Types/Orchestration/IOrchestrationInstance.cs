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

namespace Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;

/// <summary>
/// Interface for orchestration.
/// </summary>
public interface IOrchestrationInstance<out T>
    where T : class, IInputParameterDto
{
    /// <summary>
    /// The id of the orchestration.
    /// </summary>
    Guid Id { get; }

    /// <summary>
    /// The life cycle state of the orchestration.
    /// </summary>
    OrchestrationInstanceLifecycleStateDto Lifecycle { get; }

    /// <summary>
    /// The steps of the orchestration.
    /// </summary>
    IReadOnlyCollection<StepInstanceDto> Steps { get; }

    /// <summary>
    /// The parameter value.
    /// </summary>
    T ParameterValue { get; }

    /// <summary>
    /// The parameter value.
    /// </summary>
    Guid CreatedBySortProperty { get; }
}
