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

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.User;

public class UserNode : ObjectType<GetUserResponse>
{
    [Query]
    public static async Task<GetUserResponse> GetUserByIdAsync(
        Guid id,
        IMarketParticipantClient_V1 client)
    {
        return await client.UserAsync(id);
    }

    protected override void Configure(
        IObjectTypeDescriptor<GetUserResponse> descriptor)
    {
        descriptor.Name("User");

        descriptor
            .Field("auditLogs")
            .Type<NonNullType<ListType<NonNullType<ObjectType<UserAuditedChangeAuditLogDto>>>>>()
            .Resolve(ctx => ctx.Service<IMarketParticipantClient_V1>().UserAuditAsync(ctx.Parent<GetUserResponse>().Id));
    }
}
