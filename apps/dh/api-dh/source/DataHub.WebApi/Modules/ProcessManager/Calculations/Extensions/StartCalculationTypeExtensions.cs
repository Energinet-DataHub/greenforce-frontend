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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;

public static class StartCalculationTypeExtensions
{
    public static CalculationType? ToNullableBrs_023_027(this StartCalculationType startCalculationType) =>
        startCalculationType switch
        {
            StartCalculationType.Aggregation => CalculationType.Aggregation,
            StartCalculationType.BalanceFixing => CalculationType.BalanceFixing,
            StartCalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            StartCalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            StartCalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            StartCalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
            StartCalculationType.CapacitySettlement => null,
        };

    public static CalculationTypeQueryParameterV1 ToQueryParameterV1(this StartCalculationType startCalculationType) =>
        startCalculationType switch
        {
            StartCalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
            StartCalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
            StartCalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
            StartCalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
            StartCalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
            StartCalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
            StartCalculationType.CapacitySettlement => CalculationTypeQueryParameterV1.CapacitySettlement,
        };
}
