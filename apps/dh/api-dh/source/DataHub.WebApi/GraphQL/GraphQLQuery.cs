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
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.WebApi.Extensions;
using Flurl;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using NodaTime;
using ProcessType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessType;

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

            Field<CalculationType>("calculation")
                .Argument<IdGraphType>("id", "The id of the calculation")
                .Resolve()
                .WithScope()
                .WithService<IWholesaleClient_V3>()
                .ResolveAsync(async (context, client) => await client.GetBatchAsync(context.GetArgument<Guid>("id")));

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<CalculationType>>>>("calculations")
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

                    // The API only allows for a single execution state to be specified
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

            Field<NonNullGraphType<ActorDtoType>>("actor")
                .Argument<IdGraphType>("id", "The id of the actor")
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, client) =>
                {
                    var gridAreas = await client.GetGridAreasAsync();
                    var gridAreaLookup = gridAreas.ToDictionary(x => x.Id);
                    var actorDto = await client.GetActorAsync(context.GetArgument<Guid>("id"));
                    var organization = await client.GetOrganizationAsync(actorDto.OrganizationId);

                    var actor = new Actor(actorDto.ActorId, actorDto.Name.Value, actorDto.ActorNumber.Value)
                    {
                        GridAreas = actorDto.MarketRoles
                           .SelectMany(marketRole => marketRole.GridAreas.Select(gridArea => gridArea.Id))
                           .Distinct()
                           .Select(gridAreaId => gridAreaLookup[gridAreaId])
                           .ToArray(),

                        MarketRole = actorDto.MarketRoles.FirstOrDefault()?.EicFunction,
                        Status = actorDto.Status,
                        Organization = organization,
                    };
                    return actor;
                });

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<ActorDtoType>>>>("actors")
                .Argument<EicFunction[]>("eicFunctions", true)
                .Resolve()
                .WithScope()
                .WithService<IMarketParticipantClient>()
                .ResolveAsync(async (context, client) =>
                {
                    var eicFunctions = context.GetArgument("eicFunctions", Array.Empty<EicFunction>());
                    var gridAreas = await client.GetGridAreasAsync();
                    var organizations = await client.GetOrganizationsAsync();
                    var organizationLookup = organizations.ToDictionary(x => x.OrganizationId);
                    var gridAreaLookup = gridAreas.ToDictionary(x => x.Id);
                    var actors = await client.GetActorsAsync();

                    if (eicFunctions is not { Length: 0 })
                    {
                        actors = actors.Where(x =>
                            x.MarketRoles.Any(y =>
                                y.EicFunction is EicFunction.EnergySupplier or EicFunction.GridAccessProvider));
                    }

                    var accessibleActors = actors.Select(x => new Actor(x.ActorId, x.Name.Value, x.ActorNumber.Value)
                    {
                        GlnOrEicNumber = x.ActorNumber.Value,
                        GridAreas = x.MarketRoles
                            .SelectMany(marketRole => marketRole.GridAreas.Select(gridArea => gridArea.Id))
                            .Distinct()
                            .Select(gridAreaId => gridAreaLookup[gridAreaId])
                            .ToArray(),

                        MarketRole = x.MarketRoles.FirstOrDefault()?.EicFunction,
                        Status = x.Status,
                        Organization = organizationLookup[x.OrganizationId],
                    });

                    // TODO: Is this the right place to filter this list?
                    if (context.User!.IsFas())
                    {
                        return accessibleActors;
                    }

                    var actorId = context.User!.GetAssociatedActor();
                    return accessibleActors.Where(actor => actor.Id == actorId);
                });

            Field<NonNullGraphType<ESettOutgoingMessageType>>("eSettOutgoingMessage")
                .Argument<NonNullGraphType<StringGraphType>>("documentId", "The id of the exchange document.")
                .Resolve()
                .WithScope()
                .WithService<IESettExchangeClient_V1>()
                .WithService<IMarketParticipantClient>()
                .WithService<LinkGenerator>()
                .WithService<IHttpContextAccessor>()
                .ResolveAsync(async (context, client, marketParticipantClient, linkGenerator, httpContext) =>
                {
                    var gridAreas = await marketParticipantClient.GetGridAreasAsync();
                    var gridAreaLookup = gridAreas.ToDictionary(x => x.Code);
                    var documentId = context.GetArgument<string>("documentId");
                    var exchangeEventTrackignResult = await client.EsettAsync(documentId);
                    return new ESettOutogingMessage
                    {
                        DocumentId = exchangeEventTrackignResult.DocumentId,
                        Created = exchangeEventTrackignResult.Created,
                        DocumentStatus = exchangeEventTrackignResult.DocumentStatus,
                        GridArea = gridAreaLookup[exchangeEventTrackignResult.GridAreaCode],
                        PeriodFrom = exchangeEventTrackignResult.PeriodFrom,
                        PeriodTo = exchangeEventTrackignResult.PeriodTo,
                        ProcessType = exchangeEventTrackignResult.ProcessType,
                        TimeSeriesType = exchangeEventTrackignResult.TimeSeriesType,
                        GetResponseDocumentLink = linkGenerator.GetUriByAction(httpContext.HttpContext!, "ResponseDocument", "EsettExchange", new { documentId }),
                        GetDispatchDocumentLink = linkGenerator.GetUriByAction(httpContext.HttpContext!, "GetDispatchDocument", "EsettExchange", new { documentId }),
                    };
                });

            Field<NonNullGraphType<ExchangeEventSearchResponseType>>("esettExchangeEvents")
                .Argument<NonNullGraphType<IntGraphType>>("pageNumber", "The number of the page to retrieve data for.")
                .Argument<NonNullGraphType<IntGraphType>>("pageSize", "The number of items on each page.")
                .Argument<DateTimeGraphType>("periodFrom", "The start date and time of the filter period.")
                .Argument<DateTimeGraphType>("periodTo", "The end date and time of the filter period.")
                .Argument<StringGraphType>("gridAreaCode", "The code of the grid area the document is referencing.")
                .Argument<ExchangeEventProcessTypeType>("processType", "The type of process that generated the calculation results in the document.")
                .Argument<EnumerationGraphType<DocumentStatus>>("documentStatus", "The delivery status of the document.")
                .Argument<EnumerationGraphType<TimeSeriesType>>("timeSeriesType", "The type of calculation result in the document.")
                .Resolve()
                .WithScope()
                .WithService<IESettExchangeClient_V1>()
                .ResolveAsync(async (context, client) =>
                {
                    var exchangeEventSearchFilter = new ExchangeEventSearchFilter
                    {
                        PageNumber = context.GetArgument<int>("pageNumber"),
                        PageSize = context.GetArgument<int>("pageSize"),
                        PeriodFrom = context.GetArgument<DateTimeOffset?>("periodFrom"),
                        PeriodTo = context.GetArgument<DateTimeOffset?>("periodTo"),
                        GridAreaCode = context.GetArgument<string?>("gridAreaCode"),
                    };

                    var processTypeFilter = context.GetArgument<Clients.ESettExchange.v1.ProcessType?>("processType");
                    if (processTypeFilter.HasValue)
                    {
                        exchangeEventSearchFilter.ProcessType = processTypeFilter.Value;
                    }

                    var documentStatusFilter = context.GetArgument<DocumentStatus?>("documentStatus");
                    if (documentStatusFilter.HasValue)
                    {
                        exchangeEventSearchFilter.DocumentStatus = documentStatusFilter.Value;
                    }

                    var timeSeriesTypeFilter = context.GetArgument<TimeSeriesType?>("timeSeriesType");
                    if (timeSeriesTypeFilter.HasValue)
                    {
                        exchangeEventSearchFilter.TimeSeriesType = timeSeriesTypeFilter.Value;
                    }

                    return await client.SearchAsync(exchangeEventSearchFilter);
                });
        }
    }
}
