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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GraphQLQuery : ObjectGraphType
    {
        public GraphQLQuery()
        {
            Field<ListGraphType<OrganizationDtoType>>("organizations")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantClient>()
               .ResolveAsync(async (context, client) => await client.GetOrganizationsAsync());

            Field<OrganizationDtoType>("organization")
               .Argument<IdGraphType>("id", "The id of the organization")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantClient>()
               .ResolveAsync(async (context, client) => await client.GetOrganizationAsync(context.GetArgument<Guid>("id")));

            Field<BatchType>("batch")
               .Argument<IdGraphType>("id", "The id of the organization")
               .Resolve()
               .WithScope()
               .WithService<IWholesaleClient>()
               .ResolveAsync(async (context, client) => await client.GetBatchAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<BatchType>>>>("batches")
               .Argument<DateRangeType>("executionTime")
               .Resolve()
               .WithScope()
               .WithService<IWholesaleClient>()
               .ResolveAsync(async (context, client) =>
               {
                   var interval = context.GetArgument<Tuple<DateTimeOffset, DateTimeOffset>>("executionTime");
                   var batchSearchDto = new BatchSearchDto(interval.Item1, interval.Item2);
                   return await client.GetBatchesAsync(batchSearchDto);
               });

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<SettlementReportType>>>>("settlementReports")
               .Argument<ProcessTypeEnum>("processType")
               .Argument<string[]>("gridAreaCodes")
               .Argument<DateRangeType>("period")
               .Argument<DateRangeType>("executionTime")
               .Resolve()
               .WithScope()
               .WithService<IWholesaleClient>()
               .WithService<IMarketParticipantClient>()
               .ResolveAsync(async (context, wholesaleClient, marketParticipantClient) =>
               {
                   var processType = context.GetArgument<ProcessType>("processType");
                   var gridAreaCodes = context.GetArgument<string[]>("gridAreaCodes");
                   var period = context.GetArgument<Tuple<DateTimeOffset, DateTimeOffset>>("period");
                   var executionTime = context.GetArgument<Tuple<DateTimeOffset, DateTimeOffset>>("executionTime");
                   var batchSearchDto = new BatchSearchDtoV2(gridAreaCodes, BatchState.Completed, executionTime.Item1, executionTime.Item2, period.Item1, period.Item2);
                   var gridAreasTask = marketParticipantClient.GetGridAreasAsync();
                   var batchesTask = wholesaleClient.GetBatchesAsync(batchSearchDto);
                   var batches = await batchesTask;
                   var gridAreas = await gridAreasTask;
                   return batches.Aggregate(new List<SettlementReport>(), (accumulator, batch) =>
                   {
                       var settlementReports = batch.GridAreaCodes
                          .Where(gridAreaCode => gridAreaCodes.Length == 0 || gridAreaCodes.Contains(gridAreaCode))
                          .Select(gridAreaCode => new SettlementReport(
                              ProcessType.BalanceFixing,
                              gridAreas.First(gridArea => gridArea.Code == gridAreaCode),
                              Tuple.Create(batch.PeriodStart, batch.PeriodEnd),
                              batch.ExecutionTimeStart));

                       accumulator.AddRange(settlementReports);
                       return accumulator;
                   });
               });

            Field<ProcessStepType>("processStep")
               .Argument<NonNullGraphType<IntGraphType>>("step", "The process step number.")
               .Argument<NonNullGraphType<IdGraphType>>("batchId", "The batch id the process belongs to.")
               .Argument<NonNullGraphType<StringGraphType>>("gridArea", "The grid area code for the process.")
               .Resolve(context => new { });
        }
    }
}
