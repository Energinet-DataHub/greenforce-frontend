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

            Field<ProcessStepType>("processStep")
               .Argument<NonNullGraphType<IntGraphType>>("step", "The process step number.")
               .Argument<NonNullGraphType<IdGraphType>>("batchId", "The batch id the process belongs to.")
               .Argument<NonNullGraphType<StringGraphType>>("gridArea", "The grid area code for the process.")
               .Resolve(context => new { });
        }
    }
}
