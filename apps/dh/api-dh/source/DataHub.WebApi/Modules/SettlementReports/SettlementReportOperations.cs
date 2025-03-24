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

using System.Text.Json;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
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

        IEnumerable<SettlementReportApplicableCalculationDto> calculations;

        // This is a workaround for requiring 'calculations:manage' when calculationsClient is a WholesaleClientAdapter.
        var useProcessManager = configuration.IsFeatureEnabled(nameof(FeatureFlags.Names.UseProcessManager));
        if (useProcessManager)
        {
            var calculationsQuery = new CalculationsQueryInput(
                gridAreaId,
                ProcessState.Succeeded,
                CalculationExecutionType.External,
                [calculationType.FromWholesaleAndEnergyCalculationType()],
                calculationPeriod);

            var currentCalculations = await calculationsClient
                 .QueryCalculationsAsync(calculationsQuery)
                 .ConfigureAwait(false);

            calculations = currentCalculations
                .OfType<IOrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation>>()
                .SelectMany(calculation => calculation.ParameterValue.GridAreaCodes.Select(gridArea =>
                    new SettlementReportApplicableCalculationDto
                    {
                        CalculationId = GetCalculationId(calculation),
                        CalculationTime = calculation.Lifecycle.CreatedAt,
                        GridAreaCode = gridArea,
                        PeriodStart = calculation.ParameterValue.Period.Start.ToDateTimeOffset(),
                        PeriodEnd = calculation.ParameterValue.Period.End.ToDateTimeOffset(),
                    }));
        }
        else
        {
            calculations = await legacyClient.GetApplicableCalculationsAsync(
                calculationType,
                calculationPeriod.Start.ToDateTimeOffset(),
                calculationPeriod.End.ToDateTimeOffset(),
                gridAreaId);
        }

        return calculations
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

    private static Guid GetCalculationId(
        IOrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation> calculation)
    {
        if (calculation.CustomState.Contains(nameof(MigrateCalculationsFromWholesaleCustomStateV1.MigratedWholesaleCalculationId)))
        {
            var calculationCustomState = JsonSerializer.Deserialize<MigrateCalculationsFromWholesaleCustomStateV1>(calculation.CustomState)
                ?? throw new InvalidOperationException($"Cannot deserialize custom state to MigrateCalculationsFromWholesaleCustomStateV1 (CalculationId={calculation.Id}).");
            return calculationCustomState.MigratedWholesaleCalculationId;
        }

        return calculation.Id;
    }

    /// <summary>
    /// This type was exposed from the Process Manager package, but it is no longer a part of the package since
    /// the "MigrateCalculationsFromWholesale" internal process has been completely deleted from the Process Manager.
    /// This type is kept here to be able to deserialize the custom state of calculations that was migrated from Wholesale.
    /// </summary>
    private record MigrateCalculationsFromWholesaleCustomStateV1(
        Guid MigratedWholesaleCalculationId);
}
