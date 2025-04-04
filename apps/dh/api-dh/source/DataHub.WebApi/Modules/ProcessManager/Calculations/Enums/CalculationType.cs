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
using ProcessManagerCalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;

public enum CalculationType
{
    Aggregation,
    BalanceFixing,
    WholesaleFixing,
    FirstCorrectionSettlement,
    SecondCorrectionSettlement,
    ThirdCorrectionSettlement,
    ElectricalHeating,
}

public static class CalculationTypeExtensions
{
    public static CalculationTypeQueryParameterV1 FromWholesaleAndEnergyCalculationTypeQueryParameter(
        this WholesaleAndEnergyCalculationType calculationType) =>
        calculationType switch
        {
            WholesaleAndEnergyCalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
            WholesaleAndEnergyCalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
            WholesaleAndEnergyCalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
            WholesaleAndEnergyCalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
            WholesaleAndEnergyCalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
            WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
        };

    public static CalculationType FromWholesaleAndEnergyCalculationType(
        this WholesaleAndEnergyCalculationType calculationType) =>
        calculationType switch
        {
            WholesaleAndEnergyCalculationType.Aggregation => CalculationType.Aggregation,
            WholesaleAndEnergyCalculationType.BalanceFixing => CalculationType.BalanceFixing,
            WholesaleAndEnergyCalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            WholesaleAndEnergyCalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            WholesaleAndEnergyCalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
        };

    public static CalculationType FromProcessManagerCalculationType(
        this ProcessManagerCalculationType calculationType) =>
        calculationType switch
        {
            ProcessManagerCalculationType.Aggregation => CalculationType.Aggregation,
            ProcessManagerCalculationType.BalanceFixing => CalculationType.BalanceFixing,
            ProcessManagerCalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            ProcessManagerCalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrectionSettlement,
            ProcessManagerCalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrectionSettlement,
            ProcessManagerCalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrectionSettlement,
        };

    public static ProcessManagerCalculationType Unsafe_ToProcessManagerCalculationType(
        this CalculationType calculationType) =>
        calculationType switch
        {
            CalculationType.Aggregation => ProcessManagerCalculationType.Aggregation,
            CalculationType.BalanceFixing => ProcessManagerCalculationType.BalanceFixing,
            CalculationType.WholesaleFixing => ProcessManagerCalculationType.WholesaleFixing,
            CalculationType.FirstCorrectionSettlement => ProcessManagerCalculationType.FirstCorrectionSettlement,
            CalculationType.SecondCorrectionSettlement => ProcessManagerCalculationType.SecondCorrectionSettlement,
            CalculationType.ThirdCorrectionSettlement => ProcessManagerCalculationType.ThirdCorrectionSettlement,
            CalculationType.ElectricalHeating =>
                throw new InvalidOperationException("Electrical heating is not a wholesale or energy calculation."),
        };
}
