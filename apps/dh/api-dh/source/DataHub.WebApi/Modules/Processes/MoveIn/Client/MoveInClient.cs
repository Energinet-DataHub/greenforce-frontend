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
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_015.CustomQueries;
using Energinet.DataHub.WebApi.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;

public class MoveInClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient processManagerClient)
    : IMoveInClient
{
    private static readonly IReadOnlySet<BusinessReason> AllowedTemporaryStorageBusinessReasons =
        new HashSet<BusinessReason>
        {
            BusinessReason.CustomerMoveIn,
            BusinessReason.SecondaryMoveIn,
            BusinessReason.ChangeOfEnergySupplier,
        };

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
        var instance = instances.FirstOrDefault(i => i.Id == processGuid);

        if (instance is null)
        {
            return null;
        }

        // Defense in depth: even though SearchWorkflowInstancesByMeteringPointIdQuery already
        // searches across all workflow types, we only expose temporary-storage data for
        // processes that semantically use it (CustomerMoveIn / SecondaryMoveIn / ChangeOfEnergySupplier) and
        // only when the calling actor is the one that initiated the workflow. This prevents
        // an authorized actor from passing an arbitrary processId for an unrelated process
        // type (or for another actor's workflow) to fish for customer data.
        if (!AllowedTemporaryStorageBusinessReasons.Contains(instance.BusinessReason))
        {
            return null;
        }

        var createdByActorNumber = instance.Lifecycle.CreatedBy.ActorNumber?.Value;
        if (createdByActorNumber is null ||
            !string.Equals(createdByActorNumber, userIdentity.ActorNumber.Value, StringComparison.Ordinal))
        {
            return null;
        }

        if (instance.TransactionId is null)
        {
            return null;
        }

        var query = new TemporaryStorageDataQuery(
            userIdentity,
            userIdentity.ActorNumber,
            meteringPointId,
            instance.TransactionId,
            instance.Id);

        return await processManagerClient
            .SearchWorkflowInstanceByCustomQueryAsync(query, ct);
    }

    public async Task<DateTimeOffset?> GetStartDateAsync(
        string processId,
        CancellationToken ct = default)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();
        var query = new GetWorkflowInstanceByIdQuery(userIdentity, Guid.Parse(processId));
        var instance = await processManagerClient.GetWorkflowInstanceByIdQueryAsync(query, ct);
        return instance?.ExpectedValidityDate;
    }
}
