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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Types;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Calculations;

/// <summary>
/// Client for interacting with calculations in the Process Manager.
/// </summary>
public interface ICalculationsClient
{
    /// <summary>
    /// Query calculations in the Process Manager.
    /// </summary>
    Task<IEnumerable<IOrchestrationInstance<CalculationInputV1>>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get calculation from the Process Manager.
    /// </summary>
    Task<IOrchestrationInstance<CalculationInputV1>> GetCalculationByIdAsync(
        Guid calculationId,
        CancellationToken cancellationToken = default);
}
