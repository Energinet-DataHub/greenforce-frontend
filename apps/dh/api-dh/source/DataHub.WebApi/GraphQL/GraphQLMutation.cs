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
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GraphQLMutation : ObjectGraphType
    {
        public GraphQLMutation()
        {
            Field<NonNullGraphType<PermissionDtoType>>("updatePermission")
                .Argument<NonNullGraphType<UpdatePermissionInputType>>("input", "Permission to update")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .ResolveAsync(async (context, client) =>
                    {
                        var updatePermissionDto = context.GetArgument<UpdatePermissionDto>("input");
                        await client.UpdatePermissionAsync(updatePermissionDto);
                        return await client.GetPermissionAsync(updatePermissionDto.Id);
                    });

            Field<NonNullGraphType<BatchType>>("createBatch")
                .Argument<NonNullGraphType<CreateBatchInputType>>("input", "Batch to create")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient_V3>()
                .ResolveAsync(async (context, client) =>
                    {
                        var input = context.GetArgument<CreateBatchInput>("input");

                        if (!input.Period.HasEnd || !input.Period.HasStart)
                        {
                            throw new ExecutionError("Period cannot be open-ended");
                        }

                        var batchRequestDto = new BatchRequestDto
                        {
                            StartDate = input.Period.Start.ToDateTimeOffset(),
                            EndDate = input.Period.End.ToDateTimeOffset(),
                            GridAreaCodes = input.GridAreaCodes,
                            ProcessType = input.ProcessType,
                        };

                        var guid = await client.CreateBatchAsync(batchRequestDto);

                        return new BatchDto
                        {
                            BatchId = guid,
                            ExecutionState = BatchState.Pending,
                            PeriodStart = batchRequestDto.StartDate,
                            PeriodEnd = batchRequestDto.EndDate,
                            ExecutionTimeEnd = null,
                            ExecutionTimeStart = null,
                            AreSettlementReportsCreated = false,
                            GridAreaCodes = batchRequestDto.GridAreaCodes,
                            ProcessType = batchRequestDto.ProcessType,
                        };
                    });
        }
    }
}
