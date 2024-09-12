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

using Energinet.DataHub.WebApi.Clients.SettlementReports.v1;
using Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<bool> RequestSettlementReporAPIAsync(
        RequestSettlementReportInput requestSettlementReportInput,
        [Service] ISettlementReportsClient_V1 client)
    {
        var requestFilter = new SettlementReportRequestFilterDto()
        {
            GridAreas = requestSettlementReportInput.GridAreasWithCalculations.ToDictionary(
                x => x.GridAreaCode,
                y => y.CalculationId.HasValue ? new CalculationId() { Id = y.CalculationId.Value } : null!),
            PeriodStart = requestSettlementReportInput.Period.Start.ToDateTimeOffset(),
            PeriodEnd = requestSettlementReportInput.Period.End.ToDateTimeOffset(),
            CalculationType = MapCalculationType(requestSettlementReportInput.CalculationType),
            EnergySupplier = requestSettlementReportInput.EnergySupplier,
            CsvFormatLocale = requestSettlementReportInput.CsvLanguage,
        };

        await client.RequestSettlementReportAsync(
            new SettlementReportRequestDto()
            {
                SplitReportPerGridArea = !requestSettlementReportInput.CombineResultInASingleFile,
                PreventLargeTextFiles = requestSettlementReportInput.PreventLargeTextFiles,
                IncludeMonthlyAmount = requestSettlementReportInput.IncludeMonthlySums,
                IncludeBasisData = requestSettlementReportInput.IncludeBasisData,
                Filter = requestFilter,
            },
            default);

        return await Task.FromResult(true);
    }

    private CalculationType MapCalculationType(Clients.Wholesale.v3.CalculationType calculationType)
    {
        return calculationType switch
        {
            Clients.Wholesale.v3.CalculationType.BalanceFixing => CalculationType.BalanceFixing,
            Clients.Wholesale.v3.CalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            Clients.Wholesale.v3.CalculationType.Aggregation => CalculationType.Aggregation,
            Clients.Wholesale.v3.CalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            Clients.Wholesale.v3.CalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            Clients.Wholesale.v3.CalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
            _ => throw new ArgumentOutOfRangeException(nameof(calculationType), calculationType, null),
        };
    }
}
