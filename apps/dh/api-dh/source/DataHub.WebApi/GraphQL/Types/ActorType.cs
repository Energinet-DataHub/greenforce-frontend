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
using HotChocolate.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ActorType : ObjectType<ActorDto>
    {
        protected override void Configure(IObjectTypeDescriptor<ActorDto> descriptor)
        {
            descriptor.Name("Actor");

            descriptor.Field(f => f.ActorId).Name("id");
            descriptor.Field(f => f.Name.Value).Name("name");

            descriptor
                .Ignore(f => f.ActorNumber)
                .Field(f => f.ActorNumber.Value)
                .Name("glnOrEicNumber");

            descriptor
                .Field(f => f.MarketRoles)
                .Name("marketRole")
                .Resolve(context =>
                    context.Parent<ActorDto>().MarketRoles.FirstOrDefault()?.EicFunction);

            descriptor
                .Field("gridAreas")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetGridAreasAsync(default!, default!));

            descriptor
                .Field("contact")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetContactAsync(default!, default!));

            descriptor
                .Field(f => f.OrganizationId)
                .Name("organization")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetOrganizationAsync(default!, default!));
        }
    }
}
