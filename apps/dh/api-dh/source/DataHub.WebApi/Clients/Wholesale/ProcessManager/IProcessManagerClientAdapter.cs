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

using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.ProcessManager;

/// <summary>
/// An adapter for <see cref="IProcessManagerClient"/> which
/// handles mapping to the currently used calculations types.
/// </summary>
public interface IProcessManagerClientAdapter
{
    /// <summary>
    /// Query calculations in the Process Manager.
    /// </summary>
    Task<IEnumerable<CalculationDto>> QueryCalculationsAsync(CalculationQueryInput input, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get calculation in the Process Manager.
    /// </summary>
    Task<CalculationDto> GetCalculationAsync(Guid calculationId, CancellationToken cancellationToken = default);
}
