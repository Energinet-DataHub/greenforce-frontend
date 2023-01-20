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
using Energinet.DataHub.MarketParticipant.Client;
using GraphQL;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class MarketParticipantQuery : ObjectGraphType
    {
        private readonly IMarketParticipantClient _client;

        public MarketParticipantQuery(IMarketParticipantClient client)
        {
            _client = client;
            Field<ListGraphType<OrganizationDtoType>>("organizations")
                .ResolveAsync(async context => await _client.GetOrganizationsAsync().ConfigureAwait(false));

            Field<OrganizationDtoType>("organization")
                .Argument<IdGraphType>("id", "The id of the organization")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<Guid>("id");
                    return await _client.GetOrganizationAsync(id).ConfigureAwait(false);
                });
        }
    }
}
