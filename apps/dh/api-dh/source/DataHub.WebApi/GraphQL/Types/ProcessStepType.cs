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
using System.Collections.Generic;
using System.Linq;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_3;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_4;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using ActorDto_V3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ActorDto;
using TimeSeriesType = Energinet.DataHub.WebApi.Clients.Wholesale.v2_3.TimeSeriesType;
using TimeSeriesType_V3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.TimeSeriesType;

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
                .WithService<IWholesaleClient_V3>()
                .ResolveAsync(async (context, client) =>
                {
                    var parent = context.Parent!;
                    var batchId = parent.GetArgument<Guid>("batchId");
                    var gridArea = parent.GetArgument<string>("gridArea");
                    var step = parent.GetArgument<int>("step");

                    var request = step switch
                    {
                        2 => new ProcessStepActorsRequest(batchId, gridArea, MarketRole._0, TimeSeriesType._1),
                        3 => new ProcessStepActorsRequest(batchId, gridArea, MarketRole._1, TimeSeriesType._1),
                        _ => null,
                    };

                    if (request is null)
                    {
                        return Array.Empty<ActorDto_V3>();
                    }

                    // TODO: Refactor this
                    var requestBatchId = request.BatchId;
                    var requestGridAreaCode = request.GridAreaCode;
                    var requestType = (TimeSeriesType_V3)request.Type;
                    var requestMarketRole = request.MarketRole;
                    var actors = new List<ActorDto_V3>();
                    if (requestMarketRole == MarketRole._0)
                    {
                        actors = (List<ActorDto_V3>)await client
                            .EnergySuppliersAsync(requestBatchId, requestGridAreaCode, requestType)
                            .ConfigureAwait(false);
                    }
                    else
                    {
                        actors = (List<ActorDto_V3>)await client
                            .BalanceResponsiblePartiesAsync(requestBatchId, requestGridAreaCode, requestType)
                            .ConfigureAwait(false);
                    }

                    return actors == null
                        ? Array.Empty<ActorDto_V3>()
                        : actors
                            .Where(actor => actor.Gln != null)
                            .Select(actor => new ActorDto_V3(actor.Gln));
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
                        1 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.Production, null,
                            null),
                        2 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.NonProfiledConsumption,
                            gln, null),
                        3 => new ProcessStepResultRequestDtoV3(batchId, gridArea, TimeSeriesType.NonProfiledConsumption,
                            null, gln),
                        _ => throw new ExecutionError("Invalid step"),
                    };

                    return await client.GetProcessStepResultAsync(request);
                });
        }
    }
}
