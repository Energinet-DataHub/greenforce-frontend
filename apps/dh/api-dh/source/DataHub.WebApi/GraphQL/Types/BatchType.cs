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
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class BatchType : ObjectGraphType<BatchDtoV2>
    {
        public BatchType()
        {
            Name = "Batch";
            Field(x => x.BatchNumber).Name("id").Description("The id of the batch.");
            Field(x => x.ExecutionState).Description("The execution state.");
            Field(x => x.ExecutionTimeStart, nullable: true).Description("The execution start time.");
            Field(x => x.ExecutionTimeEnd, nullable: true).Description("The execution end time.");
            Field(x => x.IsBasisDataDownloadAvailable).Description("Whether basis data is downloadable.");

            // TODO: Can this be optimized in case only the grid area code is queried?
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<GridAreaType>>>>("gridAreas")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantClient>()
               .ResolveAsync(async (context, client) =>
               {
                   // TODO:
                   // This is pretty inefficient, but the client currently
                   // lacks a GetGridAreaByCode function or similar.
                   var gridAreas = await client.GetGridAreasAsync();
                   return gridAreas == null
                       ? Enumerable.Empty<GridAreaDto>()
                       : gridAreas.Where(gridArea => context.Source.GridAreaCodes.Contains(gridArea.Code));
               });

            Field<NonNullGraphType<StatusTypeEnum>>("statusType")
                .Resolve(context => context.Source.ExecutionState switch
                {
                    BatchState.Pending => "warning",
                    BatchState.Completed => "success",
                    BatchState.Failed => "danger",
                    BatchState.Executing => "info",
                    _ => "info",
                });

            Field<DateRangeType>("period")
              .Resolve(context => Tuple.Create(context.Source.PeriodStart, context.Source.PeriodEnd));
        }
    }
}
