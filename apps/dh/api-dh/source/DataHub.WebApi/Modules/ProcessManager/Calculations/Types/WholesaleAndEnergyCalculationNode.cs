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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using NodaTime;
using NodaTime.Extensions;
using BRS_023_027_CalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;

[ObjectType<WholesaleCalculationResultV1>]
public static partial class WholesaleAndEnergyCalculationNode
{
    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] WholesaleCalculationResultV1 f,
        IGridAreaByCodeDataLoader dataLoader) => (await Task
         .WhenAll(f.ParameterValue.GridAreaCodes.Select(c => dataLoader.LoadRequiredAsync(c))))
         .OrderBy(g => g.Code);

    public static Interval Period([Parent] WholesaleCalculationResultV1 f) =>
        new Interval(
            f.ParameterValue.PeriodStartDate.ToInstant(),
            f.ParameterValue.PeriodEndDate.ToInstant());

    public static CalculationTypeQueryParameterV1 CalculationType(
        [Parent] WholesaleCalculationResultV1 f) =>
        f.ParameterValue.CalculationType switch
        {
            BRS_023_027_CalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
            BRS_023_027_CalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
            BRS_023_027_CalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
            BRS_023_027_CalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
            BRS_023_027_CalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
            BRS_023_027_CalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
        };

    public static CalculationExecutionType ExecutionType(
        [Parent] WholesaleCalculationResultV1 f) =>
        f.ParameterValue.IsInternalCalculation
            ? CalculationExecutionType.Internal
            : CalculationExecutionType.External;

    static partial void Configure(
        IObjectTypeDescriptor<WholesaleCalculationResultV1> descriptor)
    {
        descriptor
            .Name("WholesaleAndEnergyCalculation")
            .BindFieldsExplicitly()
            .Implements<CalculationInterfaceType>();
    }
}
