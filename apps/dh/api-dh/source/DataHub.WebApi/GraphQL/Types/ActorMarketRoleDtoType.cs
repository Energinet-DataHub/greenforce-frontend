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

using Energinet.DataHub.MarketParticipant.Client.Models;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ActorMarketRoleDtoType : ObjectGraphType<ActorMarketRoleDto>
    {
        public ActorMarketRoleDtoType()
        {
            Field(x => x.Comment).Description("The comment of the market role.");
            Field(x => x.EicFunction).Description("The EIC function of the market role.");
            Field(x => x.GridAreas).Description("The grid areas of the market role.");
        }
    }
}
