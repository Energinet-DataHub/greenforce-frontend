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
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Actor;

public sealed class ActorAuditedChangeAuditLogDtoType : ObjectType<ActorAuditedChangeAuditLogDto>
{
    protected override void Configure(IObjectTypeDescriptor<ActorAuditedChangeAuditLogDto> descriptor)
    {
        descriptor
            .Field(f => f.AuditIdentityId)
            .Name("auditedBy")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var auditIdentity = await ctx
                    .Service<IMarketParticipantClient_V1>()
                    .AuditIdentityGetAsync(parent.AuditIdentityId, ct)
                    .ConfigureAwait(false);

                return auditIdentity.DisplayName;
            });

        descriptor.Field("consolidation")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var gridAreaDataLoader = ctx.DataLoader<GridAreaByIdBatchDataLoader>();
                var actorDataLoader = ctx.DataLoader<ActorByIdBatchDataLoader>();

                if (parent.Change == ActorAuditedChange.ConsolidationCompleted == false &&
                    parent.Change == ActorAuditedChange.ConsolidationRequested == false)
                {
                    return null;
                }

                if (parent.CurrentValue == null || parent.PreviousValue == null)
                {
                    return null;
                }

                var previousOwner = await actorDataLoader.LoadAsync(Guid.Parse(parent.PreviousValue), ct);
                var currentOwner = await actorDataLoader.LoadAsync(Guid.Parse(parent.CurrentValue), ct);

                if (previousOwner == null || currentOwner == null)
                {
                    return null;
                }

                var previousGridAreaId = previousOwner.MarketRole.GridAreas.FirstOrDefault();
                var currentGridAreaId = currentOwner.MarketRole.GridAreas.FirstOrDefault();

                if (currentGridAreaId == null)
                {
                    return null;
                }

                var previousGridArea = previousGridAreaId != null ? await gridAreaDataLoader.LoadAsync(previousGridAreaId.Id) : null;
                var currentGridArea = await gridAreaDataLoader.LoadAsync(currentGridAreaId.Id);

                if (currentGridArea == null)
                {
                    return null;
                }

                return new ActorConsolidationAuditLog(
                    currentOwner.Name.Value,
                    previousOwner.Name.Value,
                    currentGridArea.Name,
                    previousGridArea?.Name,
                    previousGridArea?.ValidTo);
            });

        descriptor
            .Field("delagation")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var gridAreaDataLoader = ctx.DataLoader<GridAreaByIdBatchDataLoader>();
                var actorDataLoader = ctx.DataLoader<ActorByIdBatchDataLoader>();

                if (parent.Change == ActorAuditedChange.DelegationStart == false &&
                    parent.Change == ActorAuditedChange.DelegationStop == false)
                {
                    return null;
                }

                var values = parent.CurrentValue?.Replace("(", string.Empty)
                                                .Replace(")", string.Empty)
                                                .Split(";")
                                                .Select((x) => x.Trim());

                var actorId = values?.ElementAtOrDefault(0);
                var startsAt = values?.ElementAtOrDefault(1) ?? string.Empty;
                var gridAreaId = values?.ElementAtOrDefault(2);
                var processType = values?.ElementAtOrDefault(3) ?? string.Empty;
                var stopsAt = values?.ElementAtOrDefault(4);

                if (actorId == null || gridAreaId == null)
                {
                    return null;
                }

                var actor = await actorDataLoader.LoadAsync(Guid.Parse(actorId), ct);

                var gridArea = await gridAreaDataLoader.LoadAsync(Guid.Parse(gridAreaId), ct);

                if (actor == null || gridArea == null)
                {
                    return null;
                }

                return new ActorDelegationAuditLog(
                    actor.Name.Value,
                    actor.ActorNumber.Value,
                    startsAt,
                    stopsAt,
                    gridArea.Name,
                    processType);
            });
    }
}
