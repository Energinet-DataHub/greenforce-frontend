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

using System;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using HotChocolate.Types;

namespace Energinet.DataHub.WebApi.GraphQL;

public sealed class UserAuditedChangeAuditLogDtoType : ObjectType<UserAuditedChangeAuditLogDto>
{
    protected override void Configure(IObjectTypeDescriptor<UserAuditedChangeAuditLogDto> descriptor)
    {
        descriptor
            .Field(f => f.AuditIdentityId)
            .Name("auditedBy")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<UserAuditedChangeAuditLogDto>();
                var auditIdentity = await ctx
                    .Service<IMarketParticipantClient_V1>()
                    .AuditIdentityAsync(parent.AuditIdentityId, ct)
                    .ConfigureAwait(false);

                return auditIdentity.DisplayName;
            });

        descriptor
            .Field("affectedActorName")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<UserAuditedChangeAuditLogDto>();
                if (parent is { Change: UserAuditedChange.InvitedIntoActor, CurrentValue: not null })
                {
                    var actorId = Guid.Parse(parent.CurrentValue);

                    var actor = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .ActorGetAsync(actorId, ct)
                        .ConfigureAwait(false);

                    return actor.Name.Value;
                }

                if (parent is { Change: UserAuditedChange.UserRoleAssigned, CurrentValue: not null })
                {
                    var userRoleComposite = parent
                        .CurrentValue
                        .Replace("(", string.Empty)
                        .Replace(")", string.Empty)
                        .Split(';');

                    var actorId = Guid.Parse(userRoleComposite[0]);

                    var actor = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .ActorGetAsync(actorId, ct)
                        .ConfigureAwait(false);

                    return actor.Name.Value;
                }

                if (parent is { Change: UserAuditedChange.UserRoleRemoved, PreviousValue: not null })
                {
                    var userRoleComposite = parent
                        .PreviousValue
                        .Replace("(", string.Empty)
                        .Replace(")", string.Empty)
                        .Split(';');

                    var actorId = Guid.Parse(userRoleComposite[0]);

                    var actor = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .ActorGetAsync(actorId, ct)
                        .ConfigureAwait(false);

                    return actor.Name.Value;
                }

                return null;
            });

        descriptor
            .Field("affectedUserRoleName")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<UserAuditedChangeAuditLogDto>();
                if (parent is { Change: UserAuditedChange.UserRoleAssigned, CurrentValue: not null })
                {
                    var userRoleComposite = parent
                        .CurrentValue
                        .Replace("(", string.Empty)
                        .Replace(")", string.Empty)
                        .Split(';');

                    var userRoleId = Guid.Parse(userRoleComposite[1]);

                    var userRole = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .UserRolesGetAsync(userRoleId, ct)
                        .ConfigureAwait(false);

                    return userRole.Name;
                }

                if (parent is { Change: UserAuditedChange.UserRoleRemoved, PreviousValue: not null })
                {
                    var userRoleComposite = parent
                        .PreviousValue
                        .Replace("(", string.Empty)
                        .Replace(")", string.Empty)
                        .Split(';');

                    var userRoleId = Guid.Parse(userRoleComposite[1]);

                    var userRole = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .UserRolesGetAsync(userRoleId, ct)
                        .ConfigureAwait(false);

                    return userRole.Name;
                }

                if (parent is { Change: UserAuditedChange.UserRoleRemovedDueToDeactivation, PreviousValue: not null })
                {
                    var userRoleId = Guid.Parse(parent.PreviousValue);

                    var userRole = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .UserRolesGetAsync(userRoleId, ct)
                        .ConfigureAwait(false);

                    return userRole.Name;
                }

                return null;
            });
    }
}
