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

using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports;
using NodaTime;
using NodaTime.Extensions;
using CalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;
using SettlementReport = Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports.SettlementReport;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<SettlementReport>> GetSettlementReportsAsync(
        [Service] ISettlementReportsClient settlementReportsClient)
    {
        var settlementReports = new List<SettlementReport>();

        foreach (var report in await settlementReportsClient.GetAsync(default))
        {
            settlementReports.Add(MapReport(report));
        }

        return settlementReports;
    }

    public async Task<Dictionary<string, List<RequestSettlementReportGridAreaCalculation>>> GetSettlementReportGridAreaCalculationsForPeriodAsync(
        CalculationType calculationType,
        string[] gridAreaId,
        Interval calculationPeriod,
        [Service] IWholesaleClient_V3 client)
    {
        var gridAreaCalculations = new Dictionary<string, List<RequestSettlementReportGridAreaCalculation>>();
        var calculations = await client.GetApplicableCalculationsAsync(
            calculationType,
            calculationPeriod.Start.ToDateTimeOffset(),
            calculationPeriod.End.ToDateTimeOffset(),
            gridAreaId);

        foreach (var calculation in calculations)
        {
            if (!gridAreaCalculations.TryGetValue(calculation.GridAreaCode, out var list))
            {
                gridAreaCalculations[calculation.GridAreaCode] = list = [];
            }

            list.Add(new RequestSettlementReportGridAreaCalculation(
                calculation.CalculationId,
                calculation.CalculationTime,
                calculation.GridAreaCode));
        }

        return gridAreaCalculations;
    }

    public async Task<SettlementReport> GetSettlementReportAsync(
        SettlementReportRequestId requestId,
        [Service] ISettlementReportsClient settlementReportsClient)
    {
        var report = (await settlementReportsClient.GetAsync(default)).First(r => r.RequestId == requestId);

        return MapReport(report);
    }

    private static SettlementReport MapReport(RequestedSettlementReportDto report)
    {
        var settlementReportStatusType = report.Status switch
        {
            SettlementReportStatus.InProgress => SettlementReportStatusType.InProgress,
            SettlementReportStatus.Completed => SettlementReportStatusType.Completed,
            SettlementReportStatus.Failed => SettlementReportStatusType.Error,
            SettlementReportStatus.Canceled => SettlementReportStatusType.Canceled,
            _ => SettlementReportStatusType.Error,
        };

        return new SettlementReport(
                Id: report.RequestId.Id,
                RequestedByActorId: report.RequestedByActorId,
                CalculationType: report.CalculationType,
                Period: new Interval(report.PeriodStart.ToInstant(), report.PeriodEnd.ToInstant()),
                NumberOfGridAreasInReport: report.GridAreaCount,
                IncludesBasisData: report.ContainsBasisData,
                StatusMessage: string.Empty,
                Progress: report.Progress,
                StatusType: settlementReportStatusType,
                ExecutionTime: new Interval(Instant.FromDateTimeOffset(report.CreatedDateTime), report.EndedDateTime != null ? Instant.FromDateTimeOffset(report.EndedDateTime.Value) : null),
                FromApi: report.JobId is not null,
                CombineResultInASingleFile: !report.SplitReportPerGridArea,
                IncludeMonthlyAmount: report.IncludeMonthlyAmount,
                GridAreas: report.GridAreas.Select(ga => ga.Key).ToArray());
    }
}
