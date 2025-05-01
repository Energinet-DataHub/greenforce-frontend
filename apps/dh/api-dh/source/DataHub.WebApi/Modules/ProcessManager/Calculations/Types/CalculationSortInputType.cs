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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;

public class CalculationSortInputType : SortInputType<ICalculationsQueryResultV1>
{
    protected override void Configure(ISortInputTypeDescriptor<ICalculationsQueryResultV1> descriptor)
    {
        descriptor
            .Name("CalculationSortInput")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.GetCalculationType()).Name("calculationType");
        descriptor.Field(f => f.GetLifecycle().ToProcessState()).Name("status");
        descriptor.Field(f => f.GetExecutionType()).Name("executionType");
        descriptor.Field(f => f.GetPeriodSortProperty()).Name("period");
        descriptor
            .Field(f => f.GetLifecycle().StartedAt ?? f.GetLifecycle().ScheduledToRunAt ?? f.GetLifecycle().CreatedAt)
            .Name("executionTime");
    }
}
