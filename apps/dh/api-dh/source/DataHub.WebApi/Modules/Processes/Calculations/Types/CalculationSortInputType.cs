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
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Types;

public class CalculationSortInputType : SortInputType<IOrchestrationInstanceTypedDto<ICalculation>>
{
    protected override void Configure(ISortInputTypeDescriptor<IOrchestrationInstanceTypedDto<ICalculation>> descriptor)
    {
        descriptor
            .Name("CalculationSortInput")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.ParameterValue.CalculationType).Name("calculationType");
        descriptor.Field(f => f.Lifecycle.StartedAt ?? f.Lifecycle.ScheduledToRunAt).Name("executionTime");
        descriptor.Field(f => f.Lifecycle.ToProcessState()).Name("status");
        descriptor.Field(f => f.ParameterValue.ExecutionType).Name("executionType");
        descriptor.Field(f => f.ParameterValue.PeriodSortProperty).Name("period");
    }
}
