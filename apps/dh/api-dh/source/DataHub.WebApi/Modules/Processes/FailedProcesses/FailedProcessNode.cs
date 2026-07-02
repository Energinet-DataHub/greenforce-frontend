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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.Processes.FailedProcesses.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.FailedProcesses;

[ObjectType<FailedProcess>]
public static partial class FailedProcessNode
{
    public static async Task<string?> GetProcessTypeAsync(
        [Parent] FailedProcess process,
        IWorkflowDescriptionNameByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var workflowDescriptionName = await dataLoader.LoadAsync(process.Id, cancellationToken);

        return workflowDescriptionName is null
            ? null
            : $"{workflowDescriptionName.ToUpperInvariant()}_{process.BusinessReason.Name}";
    }

    public static async Task<ActorDto?> GetCreatedByAsync(
        [Parent] FailedProcess process,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader)
    {
        if (string.IsNullOrEmpty(process.ActorNumber)) return null;
        if (!Enum.TryParse<EicFunction>(process.ActorRole, out var role)) return null;
        return await dataLoader.LoadAsync((process.ActorNumber, role));
    }

    // Interim fan-out: the suspended workflow instance list does not carry the workflow
    // description name yet, so it is resolved per instance. Swap this for the list DTO field
    // once a Process Manager release adds it.
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, string?>> GetWorkflowDescriptionNameByIdAsync(
        IReadOnlyList<Guid> keys,
        IProcessManagerClient processManagerClient,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken)
    {
        var userIdentity = httpContextAccessor.CreateUserIdentity();

        var lookups = keys.Select(async key =>
        {
            try
            {
                var workflowInstance = await processManagerClient
                    .GetWorkflowInstanceByIdQueryAsync(new GetWorkflowInstanceByIdQuery(userIdentity, key), cancellationToken)
                    .ConfigureAwait(false);

                return (Key: key, Name: workflowInstance?.WorkflowDescriptionName);
            }
            catch (Exception) when (!cancellationToken.IsCancellationRequested)
            {
                return (Key: key, Name: (string?)null);
            }
        });

        var results = await Task.WhenAll(lookups).ConfigureAwait(false);

        return results.ToDictionary(x => x.Key, x => x.Name);
    }

    static partial void Configure(IObjectTypeDescriptor<FailedProcess> descriptor)
    {
        descriptor.Name("FailedProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.MeteringPointId);
        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.SuspendedAt);
        descriptor.Field(f => f.SuspendReason);
        descriptor.Field(f => f.SuspendContext);
        descriptor.Field(f => f.OrchestrationInstanceId);
    }
}
