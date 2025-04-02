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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Types;

[ObjectType<OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation>>]
public static partial class WholesaleAndEnergyCalculationNode
{
    public static async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation> f,
        IGridAreaByCodeDataLoader dataLoader) => (await Task
         .WhenAll(f.ParameterValue.GridAreaCodes.Select(c => dataLoader.LoadRequiredAsync(c))))
         .OrderBy(g => g.Code);

    static partial void Configure(
        IObjectTypeDescriptor<OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation>> descriptor)
    {
        descriptor
            .Name("WholesaleAndEnergyCalculation")
            .BindFieldsExplicitly()
            .Implements<CalculationInterfaceType>();

        descriptor
            .Field(f => f.ParameterValue.Period)
            .Name("period");

        descriptor
            .Field(f => f.ParameterValue.ExecutionType)
            .Name("executionType");
    }
}
