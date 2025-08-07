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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.Reports.Abstractions.Model;
using Energinet.DataHub.Reports.Abstractions.Model.SettlementReport;
using Energinet.DataHub.Reports.Client;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Client;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Models;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports;

public static class SettlementReportOperations
{
    [Query]
    [UseRevisionLog]
    public static async Task<RequestedSettlementReportDto?> GetSettlementReportByIdAsync(
        string id,
        ISettlementReportsClient client,
        CancellationToken ct) =>
        await client.GetSettlementReportByIdAsync(id, ct);

    [Query]
    [UseRevisionLog]
    public static async Task<IEnumerable<RequestedSettlementReportDto>> GetSettlementReportsAsync(
        ISettlementReportClient client,
        CancellationToken ct) => await client.GetAsync(ct);

    [Query]
    [UseRevisionLog]
    public static async Task<Dictionary<string, List<SettlementReportApplicableCalculation>>>
        GetSettlementReportGridAreaCalculationsForPeriodAsync(
            CalculationType calculationType,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            string[] gridAreaId,
            Interval calculationPeriod,
            ICalculationsClient calculationsClient,
            IMarketParticipantClient_V1 marketParticipantClient,
            IGridAreaByIdDataLoader gridAreaDataLoader)
    {
        if (gridAreaId.Length == 0)
        {
            return [];
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedMarketParticipant()
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

        var calculationTypeQueryParameter = calculationType switch
        {
            CalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
            CalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
            CalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
            CalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
            CalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
            CalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
        };

        var calculationsQuery = new CalculationsQueryInput(
            gridAreaId,
            ProcessState.Succeeded,
            CalculationExecutionType.External,
            [calculationTypeQueryParameter],
            calculationPeriod);

        var currentCalculations = await calculationsClient
             .QueryCalculationsAsync(calculationsQuery)
             .ConfigureAwait(false);

        var calculations = currentCalculations
            .OfType<WholesaleCalculationResultV1>()
            .SelectMany(calculation => calculation.ParameterValue.GridAreaCodes.Select(gridArea =>
                new SettlementReportApplicableCalculation(
                    GetCalculationId(calculation),
                    calculation.Lifecycle.CreatedAt,
                    calculation.ParameterValue.PeriodStartDate,
                    calculation.ParameterValue.PeriodEndDate,
                    gridArea)));

        return calculations
            .GroupBy(calculation => calculation.GridAreaCode)
            .Where(group => gridAreaId.Contains(group.Key))
            .ToDictionary(
                group => group.Key,
                group => group.DistinctBy(calculation => calculation.CalculationId).ToList());
    }

    [Mutation]
    [UseRevisionLog]
    public static async Task<bool> RequestSettlementReportAsync(
        RequestSettlementReportInput requestSettlementReportInput,
        IMarketParticipantClient_V1 marketParticipantClient,
        ISettlementReportClient client,
        CancellationToken ct)
    {
        if (requestSettlementReportInput.RequestAsMarketRole is null)
        {
            throw new ArgumentException("Invalid market role for settlement report request.", nameof(requestSettlementReportInput.RequestAsMarketRole));
        }

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
    [UseRevisionLog]
    public static async Task<bool> CancelSettlementReportAsync(
        ReportRequestId requestId,
        ISettlementReportClient settlementReportsClient,
        CancellationToken ct)
    {
        await settlementReportsClient.CancelAsync(requestId, ct);
        return true;
    }

    private static Guid GetCalculationId(
        WholesaleCalculationResultV1 calculation)
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
