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
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;

public static class ICalculationsQueryResultV1Extensions
{
    public static OrchestrationInstanceTypedDto AsOrchestrationInstance(
        this ICalculationsQueryResultV1 result) =>
        (OrchestrationInstanceTypedDto)result;

    public static Guid GetId(this ICalculationsQueryResultV1 result) =>
        result.AsOrchestrationInstance().Id;

    public static OrchestrationInstanceLifecycleDto GetLifecycle(
        this ICalculationsQueryResultV1 result) =>
        result.AsOrchestrationInstance().Lifecycle;

    public static CalculationExecutionType GetExecutionType(this ICalculationsQueryResultV1 result) => result switch
    {
        WholesaleCalculationResultV1 c =>
            c.ParameterValue.IsInternalCalculation
                ? CalculationExecutionType.Internal
                : CalculationExecutionType.External,
        _ => CalculationExecutionType.External,
    };

    public static CalculationTypeQueryParameterV1 GetCalculationType(this ICalculationsQueryResultV1 result) => result switch
    {
        WholesaleCalculationResultV1 c =>
            c.ParameterValue.CalculationType switch
            {
                CalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
                CalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
                CalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
                CalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
                CalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
                CalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
            },
        ElectricalHeatingCalculationResultV1 => CalculationTypeQueryParameterV1.ElectricalHeating,
        CapacitySettlementCalculationResultV1 => CalculationTypeQueryParameterV1.CapacitySettlement,
        NetConsumptionCalculationResultV1 => CalculationTypeQueryParameterV1.NetConsumption,
        _ => throw new InvalidOperationException("Unknown ICalculationsQueryResultV1 type"),
    };

    public static string GetPeriodSortProperty(this ICalculationsQueryResultV1 result) => result switch
    {
        WholesaleCalculationResultV1 c => c.ParameterValue.PeriodStartDate.ToString("yyyy-MM-dd"),
        CapacitySettlementCalculationResultV1 c =>
            new YearMonth((int)c.ParameterValue.Year, (int)c.ParameterValue.Month).ToString("yyyy-MM-01", null),
        ElectricalHeatingCalculationResultV1 or
        NetConsumptionCalculationResultV1 or
        _ => string.Empty,
    };
}
