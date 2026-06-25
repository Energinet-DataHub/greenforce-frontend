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
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;

namespace Energinet.DataHub.WebApi.Modules.Charges.Types;

[ObjectType<ChargeSeriesPointChange>]
public static partial class ChargeSeriesPointChangeNode
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, string?>> GetActorMessageIdByOrchestrationIdAsync(
        IReadOnlyList<Guid> keys,
        IProcessManagerClient client,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken ct)
    {
        var identity = httpContextAccessor.CreateUserIdentity();
        return await keys
            .ToAsyncEnumerable()
            .Select(async (id, ct) => await client.GetOrchestrationInstanceByIdAsync(new(identity, id), ct))
            .Select(r => KeyValuePair.Create(r.Id, r.ActorMessageId))
            .ToDictionaryAsync(cancellationToken: ct);
    }

    public static async Task<string?> GetMessageIdAsync(
        [Parent] ChargeSeriesPointChange parent,
        ActorMessageIdByOrchestrationIdDataLoader dataLoader)
        => parent.OrchestrationInstanceId is not null
            ? await dataLoader.LoadAsync(parent.OrchestrationInstanceId.Value)
            : null;

    static partial void Configure(IObjectTypeDescriptor<ChargeSeriesPointChange> descriptor)
    {
        descriptor.Name("ChargeSeriesPointChange");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Created);
        descriptor.Field(f => f.Price);
        descriptor.Field(f => f.IsCurrent);
    }
}
