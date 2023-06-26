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
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.WebApi.Extensions;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class GraphQLQuery : ObjectGraphType
    {
        public GraphQLQuery()
        {
            Field<NonNullGraphType<PermissionDtoType>>("permission")
                .Argument<IdGraphType>("id", "The id of the permission")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .ResolveAsync(
                    async (context, client) => await client.GetPermissionAsync(context.GetArgument<int>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<PermissionDtoType>>>>("permissions")
                .Argument<StringGraphType>("searchTerm", "The search term for which to look for in name and description")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .ResolveAsync(async (context, client) =>
                {
                    var searchTerm = context.GetArgument<string?>("searchTerm");
                    var permissionDetailsDtos = await client.GetPermissionsAsync();
                    return searchTerm is not null
                        ? permissionDetailsDtos.Where(x =>
                            x.Name.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase) ||
                            x.Description.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase))
                        : permissionDetailsDtos;
                });

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<PermissionAuditLogDtoType>>>>("permissionLogs")
                .Argument<IdGraphType>("id", "The id of the permission")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantPermissionsClient>()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, permissionClient, userClient) =>
                {
                    var permissionId = context.GetArgument<int>("id");
                    var permission =
                        (await permissionClient.GetPermissionsAsync()).Single(permission =>
                            permission.Id == permissionId);
                    var auditLogs = await permissionClient.GetAuditLogsAsync(permissionId);
                    var userLookup = new Dictionary<Guid, UserDto>();
                    var auditLogsViewDtos = new List<PermissionAuditLogViewDto>
                    {
                        new(permissionId,
                            Guid.Empty,
                            "DataHub",
                            PermissionAuditLogType.Created,
                            permission.Created,
                            string.Empty),
                    };

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
                            log.Timestamp,
                            log.Value));
                    }

                    return auditLogsViewDtos;
                });

            Field<NonNullGraphType<UserRoleWithPermissionsDtoType>>("userrole")
                .Argument<IdGraphType>("id", "The id of the user role")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantUserRoleClient>()
                .ResolveAsync(async (context, client) => await client.GetAsync(context.GetArgument<Guid>("id")));

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
                .ResolveAsync(async (context, client) =>
                    await client.GetOrganizationAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<GridAreaType>>>>("gridAreas")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, client) => await client.GetGridAreasAsync());

            Field<BatchType>("batch")
                .Argument<IdGraphType>("id", "The id of the organization")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient_V3>()
                .ResolveAsync(async (context, client) => await client.GetBatchAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<BatchType>>>>("batches")
                .Argument<DateRangeType>("executionTime")
                .Argument<BatchState[]>("executionStates", nullable: true)
                .Argument<ProcessType[]>("processTypes", nullable: true)
                .Argument<string[]>("gridAreaCodes", nullable: true)
                .Argument<DateRangeType>("period")
                .Argument<IntGraphType>("first")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient_V3>()
                .ResolveAsync(async (context, client) =>
                {
                    var executionTime = context.GetArgument<Interval?>("executionTime");
                    var executionStates = context.GetArgument("executionStates", Array.Empty<BatchState>());
                    var processTypes = context.GetArgument("processTypes", Array.Empty<ProcessType>());
                    var gridAreaCodes = context.GetArgument("gridAreaCodes", Array.Empty<string>());
                    var period = context.GetArgument<Interval?>("period");
                    var first = context.GetArgument<int?>("first");

                    var minExecutionTime = executionTime?.Start.ToDateTimeOffset();
                    var maxExecutionTime = executionTime?.End.ToDateTimeOffset();
                    var periodStart = period?.Start.ToDateTimeOffset();
                    var periodEnd = period?.End.ToDateTimeOffset();

                    // The SearchBatches API only allows for a single execution state to be specified
                    BatchState? executionState = executionStates.Length == 1 ? executionStates[0] : null;

                    var batches = (await client.SearchBatchesAsync(gridAreaCodes, executionState, minExecutionTime, maxExecutionTime, periodStart, periodEnd))
                        .OrderByDescending(x => x.ExecutionTimeStart)
                        .Where(x => executionStates.Length <= 1 || executionStates.Contains(x.ExecutionState))
                        .Where(x => processTypes.Length == 0 || processTypes.Contains(x.ProcessType));

                    return first is not null ? batches.Take(first.Value) : batches;
                });

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<SettlementReportType>>>>("settlementReports")
                .Argument<ProcessTypeEnum>("processType")
                .Argument<string[]>("gridAreaCodes", nullable: true)
                .Argument<DateRangeType>("period")
                .Argument<DateRangeType>("executionTime")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient_V3>()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, wholesaleClient, marketParticipantClient) =>
                {
                    // var processType = context.GetArgument<ProcessType?>("processType", null);
                    var gridAreaCodes = context.GetArgument("gridAreaCodes", Array.Empty<string>());
                    var period = context.GetArgument<Interval?>("period");
                    var executionTime = context.GetArgument<Interval?>("executionTime");

                    var minExecutionTime =
                        executionTime?.HasStart == true ? executionTime?.Start.ToDateTimeOffset() : null;
                    var maxExecutionTime = executionTime?.HasEnd == true ? executionTime?.End.ToDateTimeOffset() : null;
                    var periodStart = period?.HasStart == true ? period?.Start.ToDateTimeOffset() : null;
                    var periodEnd = period?.HasEnd == true ? period?.End.ToDateTimeOffset() : null;

                    var gridAreasTask = marketParticipantClient.GetGridAreasAsync();
                    var batchesTask = wholesaleClient.SearchBatchesAsync(gridAreaCodes, BatchState.Completed, minExecutionTime, maxExecutionTime, periodStart, periodEnd);
                    var batches = await batchesTask;
                    var gridAreas = await gridAreasTask;

                    return batches.Aggregate(new List<SettlementReport>(), (accumulator, batch) =>
                    {
                        var settlementReports = batch.GridAreaCodes
                            .Where(gridAreaCode => gridAreaCodes.Length == 0 || gridAreaCodes.Contains(gridAreaCode))
                            .Select(gridAreaCode => new SettlementReport(
                                batch.BatchId,
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

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<ActorDtoType>>>>("actors")
                .Argument<EicFunction[]>("eicFunctions", true)
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, client) =>
                {
                    var eicFunctions = context.GetArgument("eicFunctions", Array.Empty<EicFunction>());
                    var gridAreas = await client.GetGridAreasAsync();
                    var gridAreaLookup = gridAreas.ToDictionary(x => x.Id);
                    var actors = await client.GetActorsAsync();

                    if (eicFunctions is not { Length: 0 })
                    {
                        actors = actors.Where(x =>
                            x.MarketRoles.Any(y =>
                                y.EicFunction is EicFunction.EnergySupplier or EicFunction.GridAccessProvider));
                    }

                    var accessibleActors = actors.Select(x => new Actor(x.ActorNumber.Value)
                    {
                        Id = x.ActorId,
                        Name = x.Name.Value,
                        Number = x.ActorNumber.Value,
                        GridAreaCodes = x.MarketRoles
                            .SelectMany(marketRole => marketRole.GridAreas.Select(gridArea => gridArea.Id))
                            .Distinct()
                            .Select(gridAreaId => gridAreaLookup[gridAreaId].Code)
                            .ToArray(),
                    });

                    // TODO: Is this the right place to filter this list?
                    if (context.User!.IsFas())
                    {
                        return accessibleActors;
                    }

                    var actorId = context.User!.GetAssociatedActor();
                    return accessibleActors.Where(actor => actor.Id == actorId);
                });
        }
    }
}
