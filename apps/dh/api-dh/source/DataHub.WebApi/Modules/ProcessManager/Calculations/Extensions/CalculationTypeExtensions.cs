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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using EdiCalculationType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;

public static class CalculationTypeExtensions
{
    public static CalculationTypes ToBrs_023_027(this CalculationType calculationType) =>
        calculationType switch
        {
            CalculationType.Aggregation => CalculationTypes.Aggregation,
            CalculationType.BalanceFixing => CalculationTypes.BalanceFixing,
            CalculationType.WholesaleFixing => CalculationTypes.WholesaleFixing,
            CalculationType.FirstCorrectionSettlement => CalculationTypes.FirstCorrectionSettlement,
            CalculationType.SecondCorrectionSettlement => CalculationTypes.SecondCorrectionSettlement,
            CalculationType.ThirdCorrectionSettlement => CalculationTypes.ThirdCorrectionSettlement,
        };

    public static CalculationType FromBrs_023_027(this CalculationTypes calculationType) =>
        calculationType switch
        {
            CalculationTypes.Aggregation => CalculationType.Aggregation,
            CalculationTypes.BalanceFixing => CalculationType.BalanceFixing,
            CalculationTypes.WholesaleFixing => CalculationType.WholesaleFixing,
            CalculationTypes.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            CalculationTypes.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            CalculationTypes.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
        };

    public static EdiCalculationType ToEdiCalculationType(this CalculationType calculationType) =>
        calculationType switch
        {
            CalculationType.Aggregation => EdiCalculationType.PreliminaryAggregation,
            CalculationType.BalanceFixing => EdiCalculationType.BalanceFixing,
            CalculationType.WholesaleFixing => EdiCalculationType.WholesaleFixing,
            CalculationType.FirstCorrectionSettlement => EdiCalculationType.FirstCorrection,
            CalculationType.SecondCorrectionSettlement => EdiCalculationType.SecondCorrection,
            CalculationType.ThirdCorrectionSettlement => EdiCalculationType.ThirdCorrection,
        };
}
