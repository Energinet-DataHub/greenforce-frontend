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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Types;

public sealed class MarketParticipantAuditedChangeAuditLogDtoType : ObjectType<ActorAuditedChangeAuditLogDto>
{
    protected override void Configure(IObjectTypeDescriptor<ActorAuditedChangeAuditLogDto> descriptor)
    {
        descriptor
            .Field(f => f.AuditIdentityId)
            .Name("auditedBy")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var auditIdentifyDataLoader = ctx.DataLoader<IAuditIdentitiesByUserIdDataLoader>();

                var auditIdentity = await auditIdentifyDataLoader.LoadAsync(parent.AuditIdentityId, ct);

                return auditIdentity?.DisplayName;
            });

        descriptor.Field("consolidation")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var gridAreaDataLoader = ctx.DataLoader<IGridAreaByIdDataLoader>();
                var marketParticipantDataLoader = ctx.DataLoader<IMarketParticipantByIdDataLoader>();

                if (parent.Change != ActorAuditedChange.ConsolidationCompleted &&
                    parent.Change != ActorAuditedChange.ConsolidationRequested)
                {
                    return null;
                }

                if (parent.CurrentValue == null || parent.PreviousValue == null)
                {
                    return null;
                }

                try
                {
                    var currentValue = JsonSerializer.Deserialize<MarketParticipantConsolidationActorAndDate>(parent.CurrentValue) ?? throw new InvalidOperationException("Could not deserialize current value for Consolidation audit log");
                    var previousValue = JsonSerializer.Deserialize<MarketParticipantConsolidationActorAndDate>(parent.PreviousValue) ?? throw new InvalidOperationException("Could not deserialize prvious value for Consolidation audit log");
                    var previousOwner = await marketParticipantDataLoader.LoadAsync(previousValue.MarketParticipantId, ct);
                    var currentOwner = await marketParticipantDataLoader.LoadAsync(currentValue.MarketParticipantId, ct);

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

                    return new MarketParticipantConsolidationAuditLog(
                        currentOwner.Name.Value,
                        currentOwner.ActorNumber.Value,
                        previousOwner.Name.Value,
                        previousOwner.ActorNumber.Value,
                        currentValue.ConsolidateAt);
                }
                catch (System.Exception)
                {
                    return null;
                }
            });

        descriptor
            .Field("delegation")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<ActorAuditedChangeAuditLogDto>();
                var gridAreaDataLoader = ctx.DataLoader<IGridAreaByIdDataLoader>();
                var marketParticipantDataLoader = ctx.DataLoader<IMarketParticipantByIdDataLoader>();

                if (parent.Change != ActorAuditedChange.DelegationStart &&
                    parent.Change != ActorAuditedChange.DelegationStop)
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

                var marketParticipant = await marketParticipantDataLoader.LoadAsync(Guid.Parse(actorId), ct);

                var gridArea = await gridAreaDataLoader.LoadAsync(Guid.Parse(gridAreaId), ct);

                if (marketParticipant == null || gridArea == null)
                {
                    return null;
                }

                return new MarketParticipantDelegationAuditLog(
                    marketParticipant.Name.Value,
                    marketParticipant.ActorNumber.Value,
                    startsAt,
                    stopsAt,
                    gridArea.Name,
                    processType);
            });
    }
}
