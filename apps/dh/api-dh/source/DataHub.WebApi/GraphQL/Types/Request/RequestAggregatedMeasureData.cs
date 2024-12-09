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

using Energinet.DataHub.WebApi.GraphQL.Enums;
using EdiMeteringPointType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointType;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Request;

public record RequestAggregatedMeasureData(
    Clients.Wholesale.v3.CalculationType CalculationType,
    DateTimeOffset PeriodStart,
    DateTimeOffset PeriodEnd,
    EdiMeteringPointType? MeteringPointType) : IRequest
{
    public RequestCalculationDataType RequestCalculationDataType => MeteringPointType switch
    {
        EdiMeteringPointType.Production => RequestCalculationDataType.Production,
        EdiMeteringPointType.FlexConsumption => RequestCalculationDataType.FlexConsumption,
        EdiMeteringPointType.TotalConsumption => RequestCalculationDataType.TotalConsumption,
        EdiMeteringPointType.NonProfiledConsumption => RequestCalculationDataType.NonProfiledConsumption,
        EdiMeteringPointType.Exchange => RequestCalculationDataType.Exchange,
        null => RequestCalculationDataType.AllEnergy,
        _ => throw new InvalidOperationException(),
    };
}
