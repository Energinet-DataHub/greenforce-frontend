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
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.Types;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Types;

public class CalculationInterfaceType : InterfaceType<ICalculationsQueryResultV1>
{
    protected override void Configure(
        IInterfaceTypeDescriptor<ICalculationsQueryResultV1> descriptor)
    {
        descriptor
            .Name("Calculation")
            .BindFieldsExplicitly()
            .Implements<OrchestrationInstanceType>();

        descriptor
            .Field("executionType")
            .Resolve(c => c.Parent<ICalculationsQueryResultV1>().GetExecutionType());

        descriptor
            .Field("calculationType")
            .Resolve(c => c.Parent<ICalculationsQueryResultV1>().GetCalculationType());
    }
}
