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
using NodaTime;
using NodaTime.Extensions;

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

    static partial void Configure(
        IObjectTypeDescriptor<WholesaleCalculationResultV1> descriptor)
    {
        descriptor
            .Name("WholesaleAndEnergyCalculation")
            .BindFieldsExplicitly()
            .Implements<CalculationInterfaceType>();
    }
}
