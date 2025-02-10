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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Types;
using NodaTime;
using CalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports;

public static class SettlementReportOperations
{
    [Query]
    public static async Task<RequestedSettlementReportDto> GetSettlementReportByIdAsync(
        SettlementReportRequestId requestId,
        ISettlementReportsClient client,
        CancellationToken ct) =>
        (await client.GetAsync(ct)).First(r => r.RequestId == requestId);

    [Query]
    public static async Task<IEnumerable<RequestedSettlementReportDto>> GetSettlementReportsAsync(
        ISettlementReportsClient client,
        CancellationToken ct) => await client.GetAsync(ct);

    [Query]
    public static async Task<Dictionary<string, List<SettlementReportApplicableCalculationDto>>>
        GetSettlementReportGridAreaCalculationsForPeriodAsync(
            IHttpContextAccessor httpContextAccessor,
            CalculationType calculationType,
            string[] gridAreaId,
            Interval calculationPeriod,
            IWholesaleClient_V3 legacyClient,
            ICalculationsClient calculationsClient,
            IMarketParticipantClient_V1 marketParticipantClient,
            GridAreaByIdBatchDataLoader gridAreaDataLoader)
    {
        if (gridAreaId.Length == 0)
        {
            return [];
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                           ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId)
            .ConfigureAwait(false);

        if (currentActor.MarketRole.EicFunction == EicFunction.GridAccessProvider)
        {
            var ownedGridAreas = await gridAreaDataLoader
                .LoadAsync(currentActor.MarketRole.GridAreas.Select(ga => ga.Id).ToList())
                .ConfigureAwait(false);

            if (gridAreaId.Any(code => !ownedGridAreas.Select(ga => ga?.Code).Contains(code)))
            {
                throw new UnauthorizedAccessException("Access denied to requested grid area.");
            }
        }

        // Calculations can be managed in two places: Wholesale and Process Manager.
        // When Process Manager is enabled, all new calculations are managed by it.
        // But settlement reports need to know about completed calculations from before the switch.
        // The solution is therefore to query both sources and union the result.
        var calculationsQuery = new CalculationsQueryInput(
            gridAreaId,
            ProcessState.Succeeded,
            CalculationExecutionType.External,
            [calculationType],
            calculationPeriod);

        var currentCalculations = await calculationsClient
            .QueryCalculationsAsync(calculationsQuery)
            .ConfigureAwait(false);

        var legacyCalculations = await legacyClient.GetApplicableCalculationsAsync(
            calculationType.FromBrs_023_027(),
            calculationPeriod.Start.ToDateTimeOffset(),
            calculationPeriod.End.ToDateTimeOffset(),
            gridAreaId);

        var mappedCalculations = currentCalculations
            .SelectMany(calculation => calculation.ParameterValue.GridAreaCodes.Select(gridArea => new SettlementReportApplicableCalculationDto
            {
                CalculationId = calculation.Id,
                CalculationTime = calculation.Lifecycle.CreatedAt,
                GridAreaCode = gridArea,
                PeriodStart = calculation.ParameterValue.PeriodStartDate,
                PeriodEnd = calculation.ParameterValue.PeriodEndDate,
            }));

        return mappedCalculations
            .Union(legacyCalculations)
            .GroupBy(calculation => calculation.GridAreaCode)
            .ToDictionary(
                group => group.Key,
                group => group.DistinctBy(calculation => calculation.CalculationId).ToList());
    }

    [Mutation]
    public static async Task<bool> RequestSettlementReportAsync(
        RequestSettlementReportInput requestSettlementReportInput,
        IMarketParticipantClient_V1 marketParticipantClient,
        ISettlementReportsClient client,
        CancellationToken ct)
    {
        var requestAsActor = Guid.TryParse(requestSettlementReportInput.RequestAsActorId, out var actorNumber)
            ? await marketParticipantClient.ActorGetAsync(actorNumber)
            : null;

        var requestFilter = new SettlementReportRequestFilterDto(
            requestSettlementReportInput.GridAreasWithCalculations.ToDictionary(
                x => x.GridAreaCode,
                y => y.CalculationId.HasValue ? new CalculationId(y.CalculationId.Value) : null),
            requestSettlementReportInput.Period.Start.ToDateTimeOffset(),
            requestSettlementReportInput.Period.End.ToDateTimeOffset(),
            requestSettlementReportInput.CalculationType,
            requestSettlementReportInput.EnergySupplier,
            requestSettlementReportInput.CsvLanguage);

        await client.RequestAsync(
            new SettlementReportRequestDto(
                !requestSettlementReportInput.CombineResultInASingleFile,
                requestSettlementReportInput.PreventLargeTextFiles,
                requestSettlementReportInput.IncludeBasisData,
                requestSettlementReportInput.IncludeMonthlySums,
                requestFilter,
                requestAsActor?.ActorNumber.Value,
                requestSettlementReportInput.RequestAsMarketRole),
            ct);

        return true;
    }

    [Mutation]
    public static async Task<bool> CancelSettlementReportAsync(
        SettlementReportRequestId requestId,
        ISettlementReportsClient settlementReportsClient,
        CancellationToken ct)
    {
        await settlementReportsClient.CancelAsync(requestId, ct);
        return true;
    }
}
