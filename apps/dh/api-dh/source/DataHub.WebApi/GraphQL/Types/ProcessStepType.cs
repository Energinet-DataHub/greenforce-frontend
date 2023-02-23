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
        private static TimeSeriesType GetTimeSeriesTypeForStep(int step)
        {
            return step switch
            {
                1 => TimeSeriesType.Production,
                2 or 3 => TimeSeriesType.NonProfiledConsumption,
                _ => throw new ExecutionError("Invalid step"),
            };
        }

        private static MarketRole? GetMarketRoleForStep(int step)
        {
            return step switch
            {
                1 => null,
                2 => MarketRole.EnergySupplier,
                3 => null,
                _ => null,
            };
        }

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
                   var timeSeriesType = GetTimeSeriesTypeForStep(step);
                   var marketRole = GetMarketRoleForStep(step);

                   if (marketRole is null)
                   {
                       return Array.Empty<Actor>();
                   }

                   var request = new ProcessStepActorsRequest(batchId, gridArea, timeSeriesType, marketRole.Value);
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
                   var timeSeriesType = GetTimeSeriesTypeForStep(step);
                   var request = new ProcessStepResultRequestDtoV2(batchId, gridArea, timeSeriesType, gln);
                   try
                   {
                       var t = await client.GetProcessStepResultAsync(request);
                       return t;
                   }
                   catch (Exception e)
                   {
                       Console.WriteLine(e);
                       return null;
                   }
               });
        }
    }
}
