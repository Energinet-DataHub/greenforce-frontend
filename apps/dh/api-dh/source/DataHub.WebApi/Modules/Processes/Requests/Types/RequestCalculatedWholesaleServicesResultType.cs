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
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

public class RequestCalculatedWholesaleServicesResultType : ObjectType<RequestCalculatedWholesaleServicesResult>
{
    protected override void Configure(
        IObjectTypeDescriptor<RequestCalculatedWholesaleServicesResult> descriptor)
    {
        descriptor
            .Name("RequestCalculatedWholesaleServicesResult")
            .BindFieldsExplicitly()
            .Implements<ActorRequestQueryResultType>();

        descriptor
            .Field(f => f.GetPriceType())
            .Name("priceType");
    }
}
