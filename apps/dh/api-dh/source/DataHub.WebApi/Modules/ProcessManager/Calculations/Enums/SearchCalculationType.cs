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

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;

public enum SearchCalculationType
{
    Aggregation,
    BalanceFixing,
    WholesaleFixing,
    FirstCorrectionSettlement,
    SecondCorrectionSettlement,
    ThirdCorrectionSettlement,
    ElectricalHeating,
}

public static class SearchCalculationTypeExtensions
{
    public static SearchCalculationType ToSearchCalculationType(
        this CalculationType calculationType) => calculationType switch
        {
            CalculationType.Aggregation => SearchCalculationType.Aggregation,
            CalculationType.BalanceFixing => SearchCalculationType.BalanceFixing,
            CalculationType.WholesaleFixing => SearchCalculationType.WholesaleFixing,
            CalculationType.FirstCorrectionSettlement => SearchCalculationType.FirstCorrectionSettlement,
            CalculationType.SecondCorrectionSettlement => SearchCalculationType.SecondCorrectionSettlement,
            CalculationType.ThirdCorrectionSettlement => SearchCalculationType.ThirdCorrectionSettlement,
        };

    public static CalculationType Unsafe_ToBrs_023_027(this SearchCalculationType searchCalculationType) =>
        searchCalculationType switch
        {
            SearchCalculationType.Aggregation => CalculationType.Aggregation,
            SearchCalculationType.BalanceFixing => CalculationType.BalanceFixing,
            SearchCalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            SearchCalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            SearchCalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            SearchCalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
            SearchCalculationType.ElectricalHeating =>
                throw new InvalidOperationException("ElectricalHeating is not part of BRS_023_027"),
        };
}
