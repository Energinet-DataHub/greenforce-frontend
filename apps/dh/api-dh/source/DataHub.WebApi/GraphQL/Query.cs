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
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.WebApi.Extensions;
using HotChocolate;
using HotChocolate.Authorization;
using Microsoft.AspNetCore.Http;
using NodaTime;
using ProcessType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessType;
using SortDirection = Energinet.DataHub.WebApi.Clients.ESettExchange.v1.SortDirection;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class Query
    {
        public Task<PermissionDetailsDto> GetPermissionByIdAsync(
            int id,
            [Service] IMarketParticipantPermissionsClient client) =>
            client.GetPermissionAsync(id);

        public async Task<IEnumerable<PermissionDetailsDto>> GetPermissionsAsync(
            string searchTerm,
            [Service] IMarketParticipantPermissionsClient client) =>
            (await client.GetPermissionsAsync())
            .Where(x =>
                searchTerm is null ||
                x.Name.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase) ||
                x.Description.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase));

        public async Task<IEnumerable<PermissionLog>> GetPermissionLogsAsync(
            int id,
            [Service] IMarketParticipantPermissionsClient client)
        {
            var permissionTask = client.GetPermissionAsync(id);
            var logs = await client.GetAuditLogsAsync(id);
            return logs
                .Select(log => new PermissionLog
                {
                    ChangedByUserId = log.AuditIdentityId,
                    Value = log.Value,
                    Timestamp = log.Timestamp,
                    Type = log.PermissionChangeType switch
                    {
                        PermissionChangeType.DescriptionChange =>
                            PermissionAuditLogType.DescriptionChange,
                    },
                })
                .Prepend(new PermissionLog
                {
                    Timestamp = (await permissionTask).Created,
                    Type = PermissionAuditLogType.Created,
                });
        }

        public async Task<IEnumerable<UserRoleAuditLog>> GetUserRoleAuditLogsAsync(
            Guid id,
            [Service] IMarketParticipantUserRoleClient client,
            [Service] IMarketParticipantPermissionsClient permissionsClient)
        {
            var logs = await client.GetUserRoleAuditLogsAsync(id);
            var logsWithPermissions = await Task.WhenAll(logs.Select(async log =>
            {
                var permissions = await Task.WhenAll(log.Permissions.Select(async permissionId =>
                {
                    var permission = await permissionsClient.GetPermissionAsync(permissionId);
                    return permission.Name;
                }));
                return new UserRoleAuditLog
                {
                    AuditIdentityId = log.AuditIdentityId,
                    UserRoleId = log.UserRoleId,
                    Name = log.Name,
                    Description = log.Description,
                    Permissions = permissions,
                    EicFunction = log.EicFunction,
                    Status = log.Status,
                    ChangeType = log.ChangeType,
                    Timestamp = log.Timestamp,
                };
            }));

            return logsWithPermissions;
        }

        public Task<UserRoleWithPermissionsDto> GetUserRoleByIdAsync(
            Guid id,
            [Service] IMarketParticipantUserRoleClient client) =>
            client.GetAsync(id);

        public Task<OrganizationDto> GetOrganizationByIdAsync(
            Guid id,
            [Service] IMarketParticipantClient client) =>
            client.GetOrganizationAsync(id);

        public Task<IEnumerable<OrganizationDto>> GetOrganizationsAsync(
            [Service] IMarketParticipantClient client) =>
            client.GetOrganizationsAsync();

        public Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
            [Service] IMarketParticipantClient client) =>
            client.GetGridAreasAsync();

        public Task<BatchDto> GetCalculationByIdAsync(
            Guid id,
            [Service] IWholesaleClient_V3 client) =>
            client.GetBatchAsync(id);

        public async Task<IEnumerable<BatchDto>> GetCalculationsAsync(
            Interval? executionTime,
            BatchState[]? executionStates,
            ProcessType[]? processTypes,
            string[]? gridAreaCodes,
            Interval? period,
            int? first,
            [Service] IWholesaleClient_V3 client)
        {
            executionStates ??= Array.Empty<BatchState>();
            processTypes ??= Array.Empty<ProcessType>();
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
        }

        public async Task<IEnumerable<SettlementReport>> GetSettlementReportsAsync(
            string[]? gridAreaCodes,
            Interval? period,
            Interval? executionTime,
            [Service] IWholesaleClient_V3 wholesaleClient,
            [Service] IMarketParticipantClient marketParticipantClient)
        {
            gridAreaCodes ??= Array.Empty<string>();
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
        }

        public Task<ActorDto> GetSelectedActorAsync(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IMarketParticipantClient client)
        {
            var user = httpContextAccessor.HttpContext?.User;
            var associatedActor = user?.GetAssociatedActor() ?? throw new InvalidOperationException("No associated actor found.");
            return client.GetActorAsync(associatedActor);
        }

        public Task<ActorDto> GetActorByIdAsync(
            Guid id,
            [Service] IMarketParticipantClient client) =>
            client.GetActorAsync(id);

        public Task<IEnumerable<ActorDto>> GetActorsAsync(
            [Service] IMarketParticipantClient client) =>
            client.GetActorsAsync();

        public async Task<IEnumerable<ActorDto>> GetActorsForEicFunctionAsync(
            EicFunction[]? eicFunctions,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IMarketParticipantClient client)
        {
            var actors = await client.GetActorsAsync();

            // TODO: The contents of eicFunctions is not currently used?
            actors = eicFunctions switch
            {
                { Length: 0 } => actors,
                _ => actors.Where(x =>
                    x.MarketRoles.Any(y =>
                        y.EicFunction is EicFunction.EnergySupplier or EicFunction.GridAccessProvider)),
            };

            // TODO: Is this the right place to filter this list?
            var user = httpContextAccessor.HttpContext?.User;
            return user is null
                ? Enumerable.Empty<ActorDto>()
                : user.IsFas()
                    ? actors
                    : actors.Where(actor => actor.ActorId == user.GetAssociatedActor());
        }

        public Task<ExchangeEventTrackingResult> GetEsettOutgoingMessageByIdAsync(
            string documentId,
            [Service] IESettExchangeClient_V1 client) =>
            client.EsettAsync(documentId);

        public Task<ExchangeEventSearchResponse> GetEsettExchangeEventsAsync(
            int pageNumber,
            int pageSize,
            DateTimeOffset? periodFrom, // TODO: Consider using Interval?
            DateTimeOffset? periodTo, // TODO: Consider using Interval?
            string? gridAreaCode,
            Clients.ESettExchange.v1.CalculationType? calculationType,
            DocumentStatus? documentStatus,
            TimeSeriesType? timeSeriesType,
            string? documentId,
            [Service] IESettExchangeClient_V1 client) =>
            client.SearchAsync(new ExchangeEventSearchFilter
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                PeriodFrom = periodFrom,
                PeriodTo = periodTo,
                GridAreaCode = gridAreaCode,
                CalculationType = calculationType,
                DocumentStatus = documentStatus,
                TimeSeriesType = timeSeriesType,
                DocumentId = documentId,
            });

        public Task<BalanceResponsiblePageResult> BalanceResponsibleAsync(
            int pageNumber,
            int pageSize,
            BalanceResponsibleSortProperty sortProperty,
            SortDirection sortDirection,
            [Service] IESettExchangeClient_V1 client) =>
            client.BalanceResponsibleAsync(
                pageNumber,
                pageSize,
                sortProperty,
                sortDirection);

        public Task<IEnumerable<ActorDto>> GetActorsByOrganizationIdAsync(
            Guid organizationId,
            [Service] IMarketParticipantClient client) =>
            client.GetActorsAsync(organizationId);
    }
}
