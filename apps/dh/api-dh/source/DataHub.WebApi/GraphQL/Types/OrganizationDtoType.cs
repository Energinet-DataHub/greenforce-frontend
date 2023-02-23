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

using System.Linq;
using Energinet.DataHub.MarketParticipant.Client.Models;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class OrganizationDtoType : ObjectGraphType<OrganizationDto>
    {
        public OrganizationDtoType()
        {
            Name = "Organization";
            Field(x => x.OrganizationId).Description("The ID of the organization.");
            Field(x => x.Name).Description("The name of the organization.");
            Field(x => x.BusinessRegisterIdentifier).Description("The business register identifier of the organization.");
            Field(x => x.Status).Description("The status of the organization.");
            Field(x => x.Comment).Description("The comment of the organization.");
            Field(x => x.Address).Description("The address of the organization.");
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<ActorDtoType>>>>("actors")
                .Description("The actors of the organization.")
                .Resolve(context => context.Source.Actors
                    .Select(actor => new Actor(actor.ActorNumber.Value)));
        }
    }
}
