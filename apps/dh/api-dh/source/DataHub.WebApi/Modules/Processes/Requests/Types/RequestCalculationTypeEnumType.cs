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
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

public class RequestCalculationTypeEnumType : EnumType<RequestCalculationType>
{
    protected override void Configure(IEnumTypeDescriptor<RequestCalculationType> descriptor)
    {
        descriptor
            .Name("RequestCalculationType")
            .BindValuesExplicitly();

        descriptor
            .Value(RequestCalculationType.Aggregation)
            .Name(RequestCalculationType.Aggregation.Name);

        descriptor
            .Value(RequestCalculationType.BalanceFixing)
            .Name(RequestCalculationType.BalanceFixing.Name);

        descriptor
            .Value(RequestCalculationType.WholesaleFixing)
            .Name(RequestCalculationType.WholesaleFixing.Name);

        descriptor
            .Value(RequestCalculationType.FirstCorrection)
            .Name(RequestCalculationType.FirstCorrection.Name);

        descriptor
            .Value(RequestCalculationType.SecondCorrection)
            .Name(RequestCalculationType.SecondCorrection.Name);

        descriptor
            .Value(RequestCalculationType.ThirdCorrection)
            .Name(RequestCalculationType.ThirdCorrection.Name);
    }
}
