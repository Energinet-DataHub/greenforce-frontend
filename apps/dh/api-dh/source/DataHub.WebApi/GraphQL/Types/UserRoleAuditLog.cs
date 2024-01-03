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

public sealed class UserRoleAuditedChangeAuditLogDtoType : ObjectType<UserRoleAuditedChangeAuditLogDto>
{
    protected override void Configure(IObjectTypeDescriptor<UserRoleAuditedChangeAuditLogDto> descriptor)
    {
        descriptor
            .Field(f => f.AuditIdentityId)
            .Name("auditedBy")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<UserRoleAuditedChangeAuditLogDto>();
                var auditIdentity = await ctx
                    .Service<IMarketParticipantClient_V1>()
                    .AuditIdentityAsync(parent.AuditIdentityId, ct)
                    .ConfigureAwait(false);

                return auditIdentity.DisplayName;
            });

        descriptor
            .Field("affectedPermissionName")
            .Resolve(async (ctx, ct) =>
            {
                var parent = ctx.Parent<UserRoleAuditedChangeAuditLogDto>();
                if (parent is { Change: UserRoleAuditedChange.PermissionAdded, CurrentValue: not null })
                {
                    var permissionId = int.Parse(parent.CurrentValue);

                    var actor = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .PermissionGetAsync(permissionId, ct)
                        .ConfigureAwait(false);

                    return actor.Name;
                }

                if (parent is { Change: UserRoleAuditedChange.PermissionRemoved, PreviousValue: not null })
                {
                    var permissionId = int.Parse(parent.PreviousValue);

                    var actor = await ctx
                        .Service<IMarketParticipantClient_V1>()
                        .PermissionGetAsync(permissionId, ct)
                        .ConfigureAwait(false);

                    return actor.Name;
                }

                return null;
            });
    }
}
