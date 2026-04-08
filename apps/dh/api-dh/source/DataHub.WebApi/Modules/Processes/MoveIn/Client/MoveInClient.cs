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

using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_015.CustomQueries;
using Energinet.DataHub.WebApi.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;

public class MoveInClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient processManagerClient)
    : IMoveInClient
{
    public async Task<RequestTemporaryStorageResult?> GetTemporaryStorageDataAsync(
        string meteringPointId,
        string processId,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        // Resolve transactionId from processId by searching all workflow instances for the metering point
        var searchQuery = new SearchWorkflowInstancesByMeteringPointIdQuery(
            userIdentity,
            meteringPointId,
            DateTimeOffset.MinValue,
            DateTimeOffset.MaxValue);

        var instances = await processManagerClient.SearchWorkflowInstancesByMeteringPointIdQueryAsync(searchQuery, ct);
        var processGuid = Guid.Parse(processId);
        var transactionId = instances.FirstOrDefault(i => i.Id == processGuid)?.TransactionId;

        if (transactionId is null)
            return null;

        var query = new TemporaryStorageDataQuery(
            userIdentity,
            userIdentity.ActorNumber,
            meteringPointId,
            transactionId);

        return await processManagerClient
            .SearchWorkflowInstanceByCustomQueryAsync<RequestTemporaryStorageResult>(query, ct);
    }
}
