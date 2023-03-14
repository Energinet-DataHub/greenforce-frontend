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
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GraphQLQuery : ObjectGraphType
    {
        public GraphQLQuery()
        {
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<PermissionDtoType>>>>("permissions")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantPermissionsClient>()
               .ResolveAsync(async (context, client) => await client.GetPermissionsAsync());

            Field<NonNullGraphType<UserRoleWithPermissionsDtoType>>("userrole")
                .Argument<IdGraphType>("id", "The id of the user role")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantUserRoleClient>()
                .ResolveAsync(async (context, client) => await client.GetAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<PermissionAuditLogDtoType>>>>("permissionlogs")
                .Argument<IdGraphType>("id", "The id of the permission")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, permissionClient, userClient) =>
                {
                    var auditLogs = await permissionClient.GetAuditLogsAsync(context.GetArgument<int>("id"));
                    var userLookup = new Dictionary<Guid, UserDto>();
                    var auditLogsViewDtos = new List<PermissionAuditLogViewDto>();

                    foreach (var log in auditLogs)
                    {
                        var userFoundInCache = userLookup.ContainsKey(log.ChangedByUserId);
                        if (!userFoundInCache)
                        {
                            var user = await userClient.GetUserAsync(log.ChangedByUserId);
                            userLookup.TryAdd(log.ChangedByUserId, user);
                        }

                        userLookup.TryGetValue(log.ChangedByUserId, out var userCache);

                        auditLogsViewDtos.Add(new PermissionAuditLogViewDto(
                            log.PermissionId,
                            log.ChangedByUserId,
                            userCache?.Name ?? throw new KeyNotFoundException("User not found"),
                            log.PermissionChangeType == PermissionChangeType.DescriptionChange ? PermissionAuditLogType.DescriptionChange : PermissionAuditLogType.Unknown,
                            log.Timestamp));
                    }

                    return auditLogsViewDtos;
                });

            Field<NonNullGraphType<UserRoleWithPermissionsDtoType>>("userrole")
                .Argument<IdGraphType>("id", "The id of the user role")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantUserRoleClient>()
                .ResolveAsync(async (context, client) => await client.GetAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<PermissionAuditLogDtoType>>>>("permissionlogs")
                .Argument<IdGraphType>("id", "The id of the permission")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, permissionClient, userClient) =>
                {
                    var auditLogs = await permissionClient.GetAuditLogsAsync(context.GetArgument<int>("id"));
                    var userLookup = new Dictionary<Guid, UserDto>();
                    var auditLogsViewDtos = new List<PermissionAuditLogViewDto>();

                    foreach (var log in auditLogs)
                    {
                        var userFoundInCache = userLookup.ContainsKey(log.ChangedByUserId);
                        if (!userFoundInCache)
                        {
                            var user = await userClient.GetUserAsync(log.ChangedByUserId);
                            userLookup.TryAdd(log.ChangedByUserId, user);
                        }

                        userLookup.TryGetValue(log.ChangedByUserId, out var userCache);

                        auditLogsViewDtos.Add(new PermissionAuditLogViewDto(
                            log.PermissionId,
                            log.ChangedByUserId,
                            userCache?.Name ?? throw new KeyNotFoundException("User not found"),
                            log.PermissionChangeType == PermissionChangeType.DescriptionChange ? PermissionAuditLogType.DescriptionChange : PermissionAuditLogType.Unknown,
                            log.Timestamp));
                    }

                    return auditLogsViewDtos;
                });

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
                    var interval = context.GetArgument<Interval>("executionTime");
                    var start = interval.Start.ToDateTimeOffset();
                    var end = interval.End.ToDateTimeOffset();
                    var batchSearchDto = new BatchSearchDto(start, end);
                    return await client.GetBatchesAsync(batchSearchDto);
                });

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<SettlementReportType>>>>("settlementReports")
                .Argument<ProcessTypeEnum>("processType")
                .Argument<string[]>("gridAreaCodes", nullable: true)
                .Argument<DateRangeType>("period")
                .Argument<DateRangeType>("executionTime")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient>()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, wholesaleClient, marketParticipantClient) =>
                {
                    // var processType = context.GetArgument<ProcessType?>("processType", null);
                    var gridAreaCodes = context.GetArgument("gridAreaCodes", Array.Empty<string>());
                    var period = context.GetArgument<Interval?>("period");
                    var executionTime = context.GetArgument<Interval?>("executionTime");

                    var minExecutionTime = executionTime?.HasStart == true ? executionTime?.Start.ToDateTimeOffset() : null;
                    var maxExecutionTime = executionTime?.HasEnd == true ? executionTime?.End.ToDateTimeOffset() : null;
                    var periodStart = period?.HasStart == true ? period?.Start.ToDateTimeOffset() : null;
                    var periodEnd = period?.HasEnd == true ? period?.End.ToDateTimeOffset() : null;

                    var batchSearchDto = new BatchSearchDtoV2(
                        gridAreaCodes,
                        BatchState.Completed,
                        minExecutionTime,
                        maxExecutionTime,
                        periodStart,
                        periodEnd);

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
                                new Interval(
                                    Instant.FromDateTimeOffset(batch.PeriodStart),
                                    Instant.FromDateTimeOffset(batch.PeriodEnd)),
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
