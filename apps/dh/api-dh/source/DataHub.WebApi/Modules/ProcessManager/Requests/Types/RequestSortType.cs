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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Extensions;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class RequestSortType : SortInputType<IOrchestrationInstanceTypedDto<IRequest>>
{
    protected override void Configure(
        ISortInputTypeDescriptor<IOrchestrationInstanceTypedDto<IRequest>> descriptor)
    {
        descriptor
            .Name("RequestSortInput")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.Lifecycle.CreatedAt).Name("createdAt");
        descriptor.Field(f => f.Lifecycle.State).Name("state");
        descriptor.Field(f => f.Lifecycle.CreatedBy.GetGuid()).Name("createdBy");
        descriptor.Field(f => f.ParameterValue.CalculationType).Name("calculationType");
        descriptor.Field(f => f.ParameterValue.Period.Start).Name("period");
        descriptor
            .Field(f => f.ParameterValue.MeteringPointTypeOrPriceTypeSortProperty)
            .Name("meteringPointTypeOrPriceType");
    }
}
