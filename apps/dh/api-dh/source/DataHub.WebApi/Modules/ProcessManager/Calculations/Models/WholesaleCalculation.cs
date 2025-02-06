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
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;

public record WholesaleCalculation(
    CalculationType CalculationType,
    CalculationExecutionType ExecutionType,
    string[] GridAreaCodes,
    Interval? Period = null) : ICalculation
{
    public SearchCalculationType SearchCalculationType { get; } = CalculationType.ToSearchCalculationType();

    public DateTimeOffset? PeriodSortProperty { get; } = Period?.Start.ToDateTimeOffset();

    public static WholesaleCalculation FromCalculationInputV1(CalculationInputV1 input) =>
        new(
            CalculationType: input.CalculationType,
            ExecutionType: input.IsInternalCalculation ? CalculationExecutionType.Internal : CalculationExecutionType.External,
            GridAreaCodes: input.GridAreaCodes.ToArray(),
            Period: new Interval(input.PeriodStartDate.ToInstant(), input.PeriodEndDate.ToInstant()));
}
