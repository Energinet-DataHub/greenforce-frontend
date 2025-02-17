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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class RequestSortType : SortInputType<IActorRequestQueryResult>
{
    protected override void Configure(
        ISortInputTypeDescriptor<IActorRequestQueryResult> descriptor)
    {
        descriptor
            .Name("RequestSortInput")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.GetLifecycle().State).Name("state");
        descriptor.Field(f => f.GetLifecycle().CreatedAt).Name("createdAt");
        descriptor.Field(f => f.GetLifecycle().CreatedBy.GetSortableString()).Name("createdBy");
        descriptor.Field(f => f.GetCalculationType()).Name("calculationType");
        descriptor.Field(f => f.GetPeriodStart()).Name("period");
        descriptor
            .Field(f => f.GetMeteringPointTypeOrPriceTypeSortProperty())
            .Name("meteringPointTypeOrPriceType");
    }
}
