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

using Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Request;

public class RequestWholesaleSettlementType
    : ObjectType<OrchestrationInstance<RequestWholesaleSettlement>>
{
    protected override void Configure(
        IObjectTypeDescriptor<OrchestrationInstance<RequestWholesaleSettlement>> descriptor)
    {
        descriptor
            .Name("RequestWholesaleSettlement")
            .BindFieldsExplicitly()
            .Implements<OrchestrationType<IRequest>>();

        descriptor.Field(f => f.ParameterValue.CalculationType);
        descriptor.Field(f => f.ParameterValue.PriceType);

        descriptor
            .Field(f => new Interval(
                Instant.FromDateTimeOffset(f.ParameterValue.PeriodStart),
                Instant.FromDateTimeOffset(f.ParameterValue.PeriodEnd)))
            .Name("period");
    }
}
