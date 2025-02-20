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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Types;
using NodaTime;

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
            WholesaleAndEnergyCalculationType calculationType,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            string[] gridAreaId,
            Interval calculationPeriod,
            IWholesaleClient_V3 legacyClient,
            ICalculationsClient calculationsClient,
            IMarketParticipantClient_V1 marketParticipantClient,
            IGridAreaByIdDataLoader gridAreaDataLoader)
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
            [calculationType.FromWholesaleAndEnergyCalculationType()],
            calculationPeriod);

        IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>> currentCalculations;

        // This is a workaround for requiring 'calculations:manage' when calculationsClient is a WholesaleClientAdapter.
        var useProcessManager = configuration.IsFeatureEnabled(nameof(FeatureFlags.Names.UseProcessManager));
        if (useProcessManager)
        {
            currentCalculations = await calculationsClient
                .QueryCalculationsAsync(calculationsQuery)
                .ConfigureAwait(false);
        }
        else
        {
            currentCalculations = [];
        }

        var wholesaleAndEnergyCalculations = currentCalculations
            .Select(calculation => calculation switch
            {
                IOrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation> wholesaleCalculation =>
                    wholesaleCalculation,
                _ => null,
            })
            .Where(c => c is not null)
            .Select(c => c!);

        var legacyCalculations = await legacyClient.GetApplicableCalculationsAsync(
            calculationType,
            calculationPeriod.Start.ToDateTimeOffset(),
            calculationPeriod.End.ToDateTimeOffset(),
            gridAreaId);

        var mappedCalculations = wholesaleAndEnergyCalculations
            .SelectMany(calculation => calculation.ParameterValue.GridAreaCodes.Select(gridArea => new SettlementReportApplicableCalculationDto
            {
                CalculationId = calculation.Id,
                CalculationTime = calculation.Lifecycle.CreatedAt,
                GridAreaCode = gridArea,
                PeriodStart = calculation.ParameterValue.Period.Start.ToDateTimeOffset(),
                PeriodEnd = calculation.ParameterValue.Period.End.ToDateTimeOffset(),
            }));

        return mappedCalculations
            .Union(legacyCalculations)
            .GroupBy(calculation => calculation.GridAreaCode)
            .Where(group => gridAreaId.Contains(group.Key))
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
