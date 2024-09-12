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
using Energinet.DataHub.WebApi.Clients.SettlementReports.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using NodaTime;
using NodaTime.Extensions;
using SettlementReport = Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports.SettlementReport;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<SettlementReport>> GetSettlementReportsApiAsync(
        [Service] IMarketParticipantClient_V1 marketParticipantClient,
        [Service] ISettlementReportsClient_V1 settlementReportsClient)
    {
        var settlementReports = new List<SettlementReport>();

        foreach (var report in await settlementReportsClient.ListAsync(default))
        {
            var actor = await marketParticipantClient.ActorGetAsync(report.RequestedByActorId);
            var settlementReportStatusType = report.Status switch
            {
                Clients.SettlementReports.v1.SettlementReportStatus.InProgress => SettlementReportStatusType.InProgress,
                Clients.SettlementReports.v1.SettlementReportStatus.Completed => SettlementReportStatusType.Completed,
                Clients.SettlementReports.v1.SettlementReportStatus.Failed => SettlementReportStatusType.Error,
                _ => SettlementReportStatusType.Error,
            };
            settlementReports.Add(new SettlementReport(
                report.RequestId!.Id,
                actor,
                MapCalculationType(report.CalculationType),
                new Interval(report.PeriodStart.ToInstant(), report.PeriodEnd.ToInstant()),
                report.GridAreaCount,
                report.ContainsBasisData,
                string.Empty,
                report.Progress,
                settlementReportStatusType,
                new Interval(Instant.FromDateTimeOffset(report.CreatedDateTime), report.EndedDateTime != null ? Instant.FromDateTimeOffset(report.EndedDateTime.Value) : null)));
        }

        return await Task.FromResult(settlementReports);
    }

    private Clients.Wholesale.v3.CalculationType MapCalculationType(CalculationType calculationType)
    {
        return calculationType switch
        {
            CalculationType.BalanceFixing => Clients.Wholesale.v3.CalculationType.BalanceFixing,
            CalculationType.WholesaleFixing => Clients.Wholesale.v3.CalculationType.WholesaleFixing,
            CalculationType.Aggregation => Clients.Wholesale.v3.CalculationType.Aggregation,
            CalculationType.FirstCorrectionSettlement => Clients.Wholesale.v3.CalculationType.FirstCorrectionSettlement,
            CalculationType.SecondCorrectionSettlement => Clients.Wholesale.v3.CalculationType.SecondCorrectionSettlement,
            CalculationType.ThirdCorrectionSettlement => Clients.Wholesale.v3.CalculationType.ThirdCorrectionSettlement,
            _ => throw new ArgumentOutOfRangeException(nameof(calculationType), calculationType, null),
        };
    }
}
