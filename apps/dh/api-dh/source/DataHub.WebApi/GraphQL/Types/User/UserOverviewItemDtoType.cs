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
using Energinet.DataHub.WebApi.GraphQL.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.User;

public class UserOverviewItemDtoType : ObjectType<UserOverviewItemDto>
{
    protected override void Configure(IObjectTypeDescriptor<UserOverviewItemDto> descriptor)
    {
        descriptor.Field("name")
            .Type<NonNullType<StringType>>()
            .Resolve(ctx =>
            {
                var user = ctx.Parent<UserOverviewItemDto>();
                return user.FirstName + ' ' + user.LastName;
            });

        descriptor
           .Field("actors")
           .Type<NonNullType<ListType<NonNullType<ObjectType<ActorDto>>>>>()
           .ResolveWith<MarketParticipantResolvers>(x => x.GetActorByUserIdAsync(default!, default!));

        descriptor
            .Field("administratedBy")
            .ResolveWith<MarketParticipantResolvers>(x => x.GetAdministratedByAsync(default!, default!));
    }
}
