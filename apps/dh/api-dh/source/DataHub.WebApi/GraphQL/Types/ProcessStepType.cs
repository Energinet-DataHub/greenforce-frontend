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
using System.Linq;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ProcessStepType : ObjectGraphType
    {
        public ProcessStepType()
        {
            Name = "ProcessStep";

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<ActorDtoType>>>>("actors")
               .Resolve()
               .WithScope()
               .WithService<IWholesaleClient>()
               .ResolveAsync(async (context, client) =>
               {
                   var parent = context.Parent!;
                   var batchId = parent.GetArgument<Guid>("batchId");
                   var gridArea = parent.GetArgument<string>("gridArea");
                   var request = parent.GetArgument<int>("step") switch
                   {
                       2 => new ProcessStepActorsRequest(batchId, gridArea, TimeSeriesType.NonProfiledConsumption, MarketRole.EnergySupplier),
                       _ => null,
                   };

                   var actors = request != null
                       ? await client.GetProcessStepActorsAsync(request)
                       : null;

                   return actors != null
                      ? actors
                          .Where(actor => actor.Gln != null)
                          .Select(actor => new Actor(actor.Gln))
                      : Array.Empty<Actor>();
               });
        }
    }
}
