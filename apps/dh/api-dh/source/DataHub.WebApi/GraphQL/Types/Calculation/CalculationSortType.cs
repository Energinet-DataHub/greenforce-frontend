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

using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

public class CalculationSortType : SortInputType<CalculationDto>
{
    protected override void Configure(ISortInputTypeDescriptor<CalculationDto> descriptor)
    {
        descriptor.Name("CalculationSortInput");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.CalculationType);
        descriptor.Field(f => f.IsInternalCalculation);
        descriptor.Field(f => f.ExecutionTimeStart ?? f.ScheduledAt).Name("executionTime");
        descriptor.Field(f => f.OrchestrationState).Name("status");
        descriptor.Field(f => f.PeriodStart).Name("period");
        descriptor
            .Field(f => f.IsInternalCalculation ? CalculationExecutionType.Internal : CalculationExecutionType.External)
            .Name("executionType");
    }
}
