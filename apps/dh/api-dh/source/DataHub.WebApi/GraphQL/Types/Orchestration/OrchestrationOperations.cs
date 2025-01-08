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
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Extensions;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Types;
using Energinet.DataHub.WebApi.Extensions;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Calculation2;

public static class OrchestrationOperations
{
    [Query]
    public static async Task<IOrchestrationInstance<IInputParameterDto>> GetProcessByIdAsync(
        Guid id,
        IHttpContextAccessor httpContextAccessor,
        IProcessManagerClient client,
        CancellationToken ct) =>
            (await client.GetOrchestrationInstanceByIdAsync<IInputParameterDto>(
                new GetOrchestrationInstanceByIdQuery(httpContextAccessor.CreateUserIdentity(), id),
                ct)).ToLocalType();

    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<IOrchestrationInstance<IInputParameterDto>>> GetProcessesAsync(
        IHttpContextAccessor httpContextAccessor,
        IProcessManagerClient client,
        CancellationToken ct) =>
            (await client.SearchOrchestrationInstancesByNameAsync<IInputParameterDto>(
                new SearchOrchestrationInstancesByNameQuery(
                    operatingIdentity: httpContextAccessor.CreateUserIdentity(),
                    name: "what should this be???",
                    null,
                    null,
                    null,
                    null,
                    null),
                ct)).Select(x => x.ToLocalType());
}
