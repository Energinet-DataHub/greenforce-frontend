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
                   var step = parent.GetArgument<int>("step");

                   var request = step switch
                   {
                       2 => new ProcessStepActorsRequest(batchId, gridArea, TimeSeriesType.NonProfiledConsumption, MarketRole.EnergySupplier),
                       3 => new ProcessStepActorsRequest(batchId, gridArea, TimeSeriesType.NonProfiledConsumption, MarketRole.BalanceResponsibleParty),
                       _ => null,
                   };

                   if (request is null)
                   {
                       return Array.Empty<Actor>();
                   }

                   var actors = await client.GetProcessStepActorsAsync(request);
                   return actors == null
                      ? Array.Empty<Actor>()
                      : actors
                          .Where(actor => actor.Gln != null)
                          .Select(actor => new Actor(actor.Gln));
               });

            Field<ProcessStepResultType>("result")
               .Argument<StringGraphType>("gln")
               .Resolve()
               .WithScope()
               .WithService<IWholesaleClient>()
               .ResolveAsync(async (context, client) =>
               {
                   var parent = context.Parent!;
                   var batchId = parent.GetArgument<Guid>("batchId");
                   var gridArea = parent.GetArgument<string>("gridArea");
                   var step = parent.GetArgument<int>("step");
                   var gln = context.GetArgument<string>("gln");

                   var request = step switch
                   {
                       1 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.Production, null, null),
                       2 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.NonProfiledConsumption, gln, null),
                       3 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.NonProfiledConsumption, null, gln),
                       _ => throw new ExecutionError("Invalid step"),
                   };

                   return await client.GetProcessStepResultAsync(request);
               });
        }
    }
}
