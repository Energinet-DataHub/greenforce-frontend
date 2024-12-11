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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.GridArea;

public sealed class GridAreaAuditedChangeAuditLogDtoType : ObjectType<GridAreaAuditedChangeAuditLogDto>
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
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();

                if (parent.Change == GridAreaAuditedChange.ConsolidationRequested || parent.Change == GridAreaAuditedChange.ConsolidationCompleted)
                {
                    return await GetActorNameAsync(parent.CurrentValue, ctx);
                }

                return string.Empty;
            });

        descriptor
            .Field("previousOwner")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<GridAreaAuditedChangeAuditLogDto>();

                if (parent.Change == GridAreaAuditedChange.ConsolidationRequested || parent.Change == GridAreaAuditedChange.ConsolidationCompleted)
                {
                    return await GetActorNameAsync(parent.PreviousValue, ctx);
                }

                return string.Empty;
            });
    }

    private async Task<string> GetActorNameAsync(string? id, IResolverContext ctx)
    {
        if (string.IsNullOrEmpty(id))
        {
            return string.Empty;
        }

        var previousOwner = await ctx
            .Service<IMarketParticipantClient_V1>()
            .ActorGetAsync(Guid.Parse(id))
            .ConfigureAwait(false);

        return previousOwner.Name.Value;
    }
}
