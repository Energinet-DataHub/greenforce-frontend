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

using System.Text.Json;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.GridArea;

public class GridAreaAuditedChangeAuditLogDtoType : ObjectType<GridAreaAuditedChangeAuditLogDto>
{
    protected override void Configure(IObjectTypeDescriptor<GridAreaAuditedChangeAuditLogDto> descriptor)
    {
        descriptor
            .Field(f => f.AuditIdentityId)
            .Name("auditedBy")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();
                var auditIdentity = await ctx
                    .Service<IMarketParticipantClient_V1>()
                    .AuditIdentityGetAsync(parent.AuditIdentityId, ct)
                    .ConfigureAwait(false);

                return auditIdentity.DisplayName;
            });

        descriptor
            .Field("currentOwner")
            .Resolve(async (ctx, _) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();
                if (parent.Change is GridAreaAuditedChange.ConsolidationRequested or GridAreaAuditedChange.ConsolidationCompleted && parent.CurrentValue is not null)
                {
                    var currentValue = JsonSerializer.Deserialize<ActorConsolidationActorAndDate>(parent.CurrentValue) ?? throw new InvalidOperationException("Could not deserialize current value for Consolidation audit log in GridAreaAuditedChangeAuditLogDtoType");
                    return await GetActorNameAsync(parent.Change, currentValue.ActorId.ToString(), ctx);
                }

                return await GetActorNameAsync(parent.Change, parent.CurrentValue, ctx);
            });

        descriptor
            .Field("previousOwner")
            .Resolve(async (ctx, _) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();
                if (parent.Change is GridAreaAuditedChange.ConsolidationRequested or GridAreaAuditedChange.ConsolidationCompleted && parent.PreviousValue is not null)
                {
                    var previousValue = JsonSerializer.Deserialize<ActorConsolidationActorAndDate>(parent.PreviousValue) ?? throw new InvalidOperationException("Could not deserialize current value for Consolidation audit log in GridAreaAuditedChangeAuditLogDtoType");
                    return await GetActorNameAsync(parent.Change, previousValue.ActorId.ToString(), ctx);
                }

                return await GetActorNameAsync(parent.Change, parent.PreviousValue, ctx);
            });

        descriptor
            .Field("consolidatedAt")
            .Resolve((ctx, _) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();

                if (parent.Change is GridAreaAuditedChange.ConsolidationRequested or GridAreaAuditedChange.ConsolidationCompleted && parent.CurrentValue is not null)
                {
                    var currentValue = JsonSerializer.Deserialize<ActorConsolidationActorAndDate>(parent.CurrentValue) ?? throw new InvalidOperationException("Could not deserialize current value for Consolidation audit log in GridAreaAuditedChangeAuditLogDtoType");
                    return (DateTimeOffset?)currentValue.ConsolidateAt;
                }

                return null;
            });
    }

    private async Task<string> GetActorNameAsync(GridAreaAuditedChange change, string? id, IResolverContext ctx)
    {
        if (string.IsNullOrEmpty(id))
        {
            return string.Empty;
        }

        if (change != GridAreaAuditedChange.ConsolidationRequested && change != GridAreaAuditedChange.ConsolidationCompleted)
        {
            return string.Empty;
        }

        var previousOwner = await ctx
            .Service<IMarketParticipantClient_V1>()
            .ActorGetAsync(Guid.Parse(id))
            .ConfigureAwait(false);

        return $"{previousOwner.ActorNumber.Value} • {previousOwner.Name.Value}";
    }
}
