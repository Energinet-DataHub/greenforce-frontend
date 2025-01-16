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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.Shared.BRS_026_028;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Client;

public class RequestsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient client)
    : IRequestsClient
{
    public async Task<IEnumerable<IActorRequestQueryResult>> GetRequestsAsync(CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var customQuery = new ActorRequestQuery(
            userIdentity,
            DateTimeOffset.Parse("2025-01-10T11:00:00.0000000+01:00"),
            DateTimeOffset.Parse("2026-01-10T11:00:00.0000000+01:00"));

        return await client.SearchOrchestrationInstancesByCustomQueryAsync(customQuery, ct);
    }

    public async Task<bool> RequestCalculatedEnergyTimeSeriesAsync(
        RequestCalculatedEnergyTimeSeriesInput input,
        CancellationToken ct = default)
    {
        await Task.CompletedTask;
        return true;
    }
}
