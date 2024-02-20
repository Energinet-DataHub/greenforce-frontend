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
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using NodaTime;
using WholesaleCalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class Query
    {
        public Task<PermissionDto> GetPermissionByIdAsync(
            int id,
            [Service] IMarketParticipantClient_V1 client) =>
            client.PermissionGetAsync(id);

        public async Task<IEnumerable<PermissionDto>> GetPermissionsAsync(
            string searchTerm,
            [Service] IMarketParticipantClient_V1 client) =>
            (await client.PermissionGetAsync())
            .Where(x =>
                searchTerm is null ||
                x.Name.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase) ||
                x.Description.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase));

        public async Task<IEnumerable<PermissionAuditedChangeAuditLogDto>> GetPermissionAuditLogsAsync(
            int id,
            [Service] IMarketParticipantClient_V1 client)
        {
            return await client
                .PermissionAuditAsync(id)
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<UserRoleAuditedChangeAuditLogDto>> GetUserRoleAuditLogsAsync(
            Guid id,
            [Service] IMarketParticipantClient_V1 client)
        {
            return await client
                .UserRolesAuditAsync(id)
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<UserAuditedChangeAuditLogDto>> GetUserAuditLogsAsync(
            Guid id,
            [Service] IMarketParticipantClient_V1 client)
        {
            return await client
                .UserAuditAsync(id)
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<OrganizationAuditedChangeAuditLogDto>> GetOrganizationAuditLogsAsync(
            Guid organizationId,
            [Service] IMarketParticipantClient_V1 client)
        {
            return await client
                .OrganizationAuditAsync(organizationId)
                .ConfigureAwait(false);
        }

        public async Task<IEnumerable<ActorAuditedChangeAuditLogDto>> GetActorAuditLogsAsync(
            Guid actorId,
            [Service] IMarketParticipantClient_V1 client)
        {
            return await client
                .ActorAuditAsync(actorId)
                .ConfigureAwait(false);
        }

        public Task<UserRoleWithPermissionsDto> GetUserRoleByIdAsync(
            Guid id,
            [Service] IMarketParticipantClient_V1 client) =>
            client.UserRolesGetAsync(id);

        public async Task<IEnumerable<UserRoleDto>> GetUserRolesByEicFunctionAsync(
            EicFunction eicFunction,
            [Service] IMarketParticipantClient_V1 client)
        {
            var userRoles = await client.UserRolesGetAsync().ConfigureAwait(false);
            return userRoles.Where(y => y.EicFunction == eicFunction);
        }

        public Task<OrganizationDto> GetOrganizationByIdAsync(
            Guid id,
            [Service] IMarketParticipantClient_V1 client) =>
            client.OrganizationGetAsync(id);

        public Task<ICollection<OrganizationDto>> GetOrganizationsAsync(
            [Service] IMarketParticipantClient_V1 client) =>
            client.OrganizationGetAsync();

        public Task<ICollection<GridAreaDto>> GetGridAreasAsync(
            [Service] IMarketParticipantClient_V1 client) =>
            client.GridAreaGetAsync();

        public Task<CalculationDto> GetCalculationByIdAsync(
            Guid id,
            [Service] IWholesaleClient_V3 client) =>
            client.GetCalculationAsync(id);

        public async Task<IEnumerable<CalculationDto>> GetCalculationsAsync(
            Interval? executionTime,
            CalculationState[]? executionStates,
            WholesaleCalculationType[]? calculationTypes,
            string[]? gridAreaCodes,
            Interval? period,
            int? first,
            [Service] IWholesaleClient_V3 client)
        {
            executionStates ??= Array.Empty<CalculationState>();
            calculationTypes ??= Array.Empty<WholesaleCalculationType>();
            var minExecutionTime = executionTime?.Start.ToDateTimeOffset();
            var maxExecutionTime = executionTime?.End.ToDateTimeOffset();
            var periodStart = period?.Start.ToDateTimeOffset();
            var periodEnd = period?.End.ToDateTimeOffset();

            // The API only allows for a single execution state to be specified
            CalculationState? executionState = executionStates.Length == 1 ? executionStates[0] : null;

            var calculations = (await client.SearchCalculationsAsync(gridAreaCodes, executionState, minExecutionTime, maxExecutionTime, periodStart, periodEnd))
                .OrderByDescending(x => x.ExecutionTimeStart)
                .Where(x => executionStates.Length <= 1 || executionStates.Contains(x.ExecutionState))
                .Where(x => calculationTypes.Length == 0 || calculationTypes.Contains(x.CalculationType));

            return first is not null ? calculations.Take(first.Value) : calculations;
        }

        public async Task<IEnumerable<SettlementReport>> GetSettlementReportsAsync(
            string[]? gridAreaCodes,
            Interval? period,
            Interval? executionTime,
            [Service] IWholesaleClient_V3 wholesaleClient,
            [Service] IMarketParticipantClient_V1 marketParticipantClient)
        {
            gridAreaCodes ??= Array.Empty<string>();
            var minExecutionTime =
                executionTime?.HasStart == true ? executionTime?.Start.ToDateTimeOffset() : null;
            var maxExecutionTime = executionTime?.HasEnd == true ? executionTime?.End.ToDateTimeOffset() : null;
            var periodStart = period?.HasStart == true ? period?.Start.ToDateTimeOffset() : null;
            var periodEnd = period?.HasEnd == true ? period?.End.ToDateTimeOffset() : null;

            var gridAreasTask = marketParticipantClient.GridAreaGetAsync();
            var calculationsTask = wholesaleClient.SearchCalculationsAsync(gridAreaCodes, CalculationState.Completed, minExecutionTime, maxExecutionTime, periodStart, periodEnd);
            var calculations = await calculationsTask;
            var gridAreas = await gridAreasTask;

            return calculations.Aggregate(new List<SettlementReport>(), (accumulator, calculation) =>
            {
                var settlementReports = calculation.GridAreaCodes
                    .Where(gridAreaCode => gridAreaCodes.Length == 0 || gridAreaCodes.Contains(gridAreaCode))
                    .Select(gridAreaCode => new SettlementReport(
                        calculation.CalculationId,
                        WholesaleCalculationType.BalanceFixing,
                        gridAreas.First(gridArea => gridArea.Code == gridAreaCode),
                        new Interval(
                            Instant.FromDateTimeOffset(calculation.PeriodStart),
                            Instant.FromDateTimeOffset(calculation.PeriodEnd)),
                        calculation.ExecutionTimeStart));

                accumulator.AddRange(settlementReports);
                return accumulator;
            });
        }

        public Task<ActorDto> GetSelectedActorAsync(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IMarketParticipantClient_V1 client)
        {
            var user = httpContextAccessor.HttpContext?.User;
            var associatedActor = user?.GetAssociatedActor() ?? throw new InvalidOperationException("No associated actor found.");
            return client.ActorGetAsync(associatedActor);
        }

        public Task<ActorDto> GetActorByIdAsync(
            Guid id,
            [Service] IMarketParticipantClient_V1 client) =>
            client.ActorGetAsync(id);

        public async Task<IEnumerable<ActorDto>> GetActorsAsync(
            [Service] IMarketParticipantClient_V1 client) =>
            await client.ActorGetAsync();

        public async Task<IEnumerable<ActorDto>> GetActorsForEicFunctionAsync(
            EicFunction[]? eicFunctions,
            [Service] IMarketParticipantClient_V1 client)
        {
            eicFunctions ??= Array.Empty<EicFunction>();
            var actors = await client.ActorGetAsync();

            return actors.Where(x => x.MarketRoles.Any(y => eicFunctions.Contains(y.EicFunction)));
        }

        public async Task<IEnumerable<ReadinessStatusDto>> GetEsettServiceStatusAsync(
            [Service] IESettExchangeClient_V1 client) => await client.StatusAsync();

        public async Task<ExchangeEventStatusReportResponse> GetEsettExchangeStatusReportAsync(
            [Service] IESettExchangeClient_V1 client) => await client.StatusReportAsync();

        public Task<ExchangeEventTrackingResult> GetEsettOutgoingMessageByIdAsync(
            string documentId,
            [Service] IESettExchangeClient_V1 client) =>
            client.EsettAsync(documentId);

        public Task<ExchangeEventSearchResponse> GetEsettExchangeEventsAsync(
            int pageNumber,
            int pageSize,
            Interval? periodInterval,
            Interval? createdInterval,
            string? gridAreaCode,
            Clients.ESettExchange.v1.CalculationType? calculationType,
            DocumentStatus? documentStatus,
            TimeSeriesType? timeSeriesType,
            string? documentId,
            ExchangeEventSortProperty sortProperty,
            Clients.ESettExchange.v1.SortDirection sortDirection,
            [Service] IESettExchangeClient_V1 client) =>
            client.SearchAsync(new ExchangeEventSearchFilter
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                PeriodFrom = periodInterval?.Start.ToDateTimeOffset(),
                PeriodTo = periodInterval?.End.ToDateTimeOffset(),
                GridAreaCode = gridAreaCode,
                CalculationType = calculationType,
                DocumentStatus = documentStatus,
                TimeSeriesType = timeSeriesType,
                DocumentId = documentId,
                CreatedFrom = createdInterval?.Start.ToDateTimeOffset(),
                CreatedTo = createdInterval?.End.ToDateTimeOffset(),
                SortDirection = sortDirection,
                SortProperty = sortProperty,
            });

        public Task<MeteringGridAreaImbalanceSearchResponse> GetMeteringGridAreaImbalanceAsync(
            int pageNumber,
            int pageSize,
            DateTimeOffset? createdFrom,
            DateTimeOffset? createdTo,
            string? gridAreaCode,
            string? documentId,
            MeteringGridAreaImbalanceSortProperty sortProperty,
            Clients.ESettExchange.v1.SortDirection sortDirection,
            [Service] IESettExchangeClient_V1 client) =>
            client.Search2Async(new MeteringGridAreaImbalanceSearchFilter
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                CreatedFrom = createdFrom,
                CreatedTo = createdTo,
                GridAreaCode = gridAreaCode,
                DocumentId = documentId,
                SortDirection = sortDirection,
                SortProperty = sortProperty,
            });

        public Task<BalanceResponsiblePageResult> BalanceResponsibleAsync(
            int pageNumber,
            int pageSize,
            BalanceResponsibleSortProperty sortProperty,
            Clients.ESettExchange.v1.SortDirection sortDirection,
            [Service] IESettExchangeClient_V1 client) =>
            client.BalanceResponsibleAsync(
                pageNumber,
                pageSize,
                sortProperty,
                sortDirection);

        public async Task<IEnumerable<ActorDto>> GetActorsByOrganizationIdAsync(
            Guid organizationId,
            [Service] IMarketParticipantClient_V1 client) =>
            await client.OrganizationActorAsync(organizationId);

        public Task<bool> EmailExistsAsync(
            string emailAddress,
            [Service] IMarketParticipantClient_V1 client) =>
            client.UserExistsAsync(emailAddress);

        public async Task<IEnumerable<string>> GetKnownEmailsAsync(
            [Service] IMarketParticipantClient_V1 client)
        {
            var users = await GetUserOverviewAsync(client).ConfigureAwait(false);
            return users.Users.Select(x => x.Email).ToList();
        }

        public async Task<AssociatedActors> GetAssociatedActorsAsync(
            string email,
            [Service] IMarketParticipantClient_V1 client)
        {
            var users = await GetUserOverviewAsync(client).ConfigureAwait(false);

            var user = users.Users.FirstOrDefault(x => string.Equals(email, x.Email, StringComparison.OrdinalIgnoreCase));

            if (user is null)
            {
                return new AssociatedActors
                {
                    Email = email,
                };
            }

            var associatedActors = await client.UserActorsGetAsync(user.Id).ConfigureAwait(false);

            return new AssociatedActors
            {
                Email = email,
                Actors = associatedActors.ActorIds,
            };
        }

        public async Task<IEnumerable<GridAreaOverviewItemDto>> GetGridAreaOverviewAsync([Service] IMarketParticipantClient_V1 client) =>
            await client.GridAreaOverviewAsync();

        public async Task<ImbalancePricesOverview> GetImbalancePricesOverviewAsync([Service] IImbalancePricesClient_V1 client)
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");

            var f = new DateTime(2021, 1, 1, 0, 0, 0);
            var t = new DateTime(2021, 2, 1, 0, 0, 0);
            var s = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0);

            var from = TimeZoneInfo.ConvertTime(new DateTimeOffset(f, tz.GetUtcOffset(f)), tz);
            var to = TimeZoneInfo.ConvertTime(new DateTimeOffset(t, tz.GetUtcOffset(t)), tz);
            var stop = TimeZoneInfo.ConvertTime(new DateTimeOffset(s, tz.GetUtcOffset(s)), tz);

            var tasks = new List<Task<ImbalancePricePeriod>>();

            while (from < stop)
            {
                tasks.Add(GetPricesAsync(from, to, PriceAreaCode.AreaCode1, client));
                tasks.Add(GetPricesAsync(from, to, PriceAreaCode.AreaCode2, client));
                f = f.AddMonths(1);
                t = t.AddMonths(1);
                from = TimeZoneInfo.ConvertTime(new DateTimeOffset(f, tz.GetUtcOffset(f)), tz);
                to = TimeZoneInfo.ConvertTime(new DateTimeOffset(t, tz.GetUtcOffset(t)), tz);
            }

            var imbalancePricePeriods = await Task.WhenAll(tasks);

            return new ImbalancePricesOverview
            {
                PricePeriods = imbalancePricePeriods.OrderByDescending(x => x.Name).ThenBy(x => x.PriceAreaCode),
            };

            static async Task<ImbalancePricePeriod> GetPricesAsync(DateTimeOffset from, DateTimeOffset to, PriceAreaCode priceAreaCode, IImbalancePricesClient_V1 client)
            {
                var status = await client.StatusAsync(from, to, priceAreaCode);
                return new ImbalancePricePeriod
                {
                    PriceAreaCode = priceAreaCode switch
                    {
                        PriceAreaCode.AreaCode1 => Controllers.MarketParticipant.Dto.PriceAreaCode.Dk1,
                        PriceAreaCode.AreaCode2 => Controllers.MarketParticipant.Dto.PriceAreaCode.Dk2,
                        _ => throw new ArgumentOutOfRangeException(nameof(priceAreaCode)),
                    },
                    Name = from,
                    Status = status switch
                    {
                        ImbalancePricePeriodStatus.NoPrices => ImbalancePriceStatus.NoData,
                        ImbalancePricePeriodStatus.Incomplete => ImbalancePriceStatus.InComplete,
                        ImbalancePricePeriodStatus.Complete => ImbalancePriceStatus.Complete,
                        _ => throw new ArgumentOutOfRangeException(nameof(status)),
                    },
                };
            }
        }

        public async Task<IEnumerable<ImbalancePricesDailyDto>> GetImbalancePricesForMonthAsync(
            int year,
            int month,
            Controllers.MarketParticipant.Dto.PriceAreaCode areaCode,
            [Service] IImbalancePricesClient_V1 client)
        {
            var parsedAreaCode = areaCode switch
            {
                Controllers.MarketParticipant.Dto.PriceAreaCode.Dk1 => PriceAreaCode.AreaCode1,
                Controllers.MarketParticipant.Dto.PriceAreaCode.Dk2 => PriceAreaCode.AreaCode2,
                _ => throw new ArgumentOutOfRangeException(nameof(areaCode)),
            };

            return await client.GetByMonthAsync(
                year,
                month,
                parsedAreaCode)
                .ConfigureAwait(false);
        }

        public async Task<GetUserProfileResponse> GetUserProfileAsync([Service] IMarketParticipantClient_V1 client)
        {
            return await client.UserUserprofileGetAsync().ConfigureAwait(false);
        }

        public async Task<CVROrganizationResult> SearchOrganizationInCVRAsync([Service] IMarketParticipantClient_V1 client, string cvr)
        {
            try
            {
                using var cts = new System.Threading.CancellationTokenSource();
                cts.CancelAfter(15000);

                var organizationIdentity = await client.OrganizationIdentityAsync(cvr, cts.Token).ConfigureAwait(false);

                return organizationIdentity.OrganizationFound
                    ? new CVROrganizationResult
                    {
                        HasResult = true,
                        Name = organizationIdentity.OrganizationIdentity!.Name,
                    }
                    : new CVROrganizationResult
                    {
                        HasResult = false,
                    };
            }
            catch (Exception)
            {
                return new CVROrganizationResult
                {
                    HasResult = false,
                };
            }
        }

        private static Task<GetUserOverviewResponse> GetUserOverviewAsync(IMarketParticipantClient_V1 client)
        {
            return client.UserOverviewUsersSearchAsync(
                1,
                int.MaxValue,
                UserOverviewSortProperty.Email,
                Clients.MarketParticipant.v1.SortDirection.Asc,
                new UserOverviewFilterDto
                {
                    UserStatus = new List<UserStatus>(),
                    UserRoleIds = new List<Guid>(),
                });
        }
    }
}
