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

using ModelMeteringPointType = Energinet.DataHub.WebApi.Modules.Common.Enums.MeteringPointType;
using ModelSettlementMethod = Energinet.DataHub.WebApi.Modules.Processes.Requests.Models.SettlementMethod;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record MeteringPointType(
    string Name,
    ModelMeteringPointType? EvaluationPoint,
    ModelSettlementMethod? SettlementMethod)
{
    public static readonly MeteringPointType All = new(nameof(All), null, null);
    public static readonly MeteringPointType Production = new(nameof(Production), ModelMeteringPointType.Production, null);
    public static readonly MeteringPointType FlexConsumption = new(nameof(FlexConsumption), ModelMeteringPointType.Consumption, ModelSettlementMethod.Flex);
    public static readonly MeteringPointType TotalConsumption = new(nameof(TotalConsumption), ModelMeteringPointType.Consumption, null);
    public static readonly MeteringPointType NonProfiledConsumption = new(nameof(NonProfiledConsumption), ModelMeteringPointType.Consumption, ModelSettlementMethod.NonProfiled);
    public static readonly MeteringPointType Exchange = new(nameof(Exchange), ModelMeteringPointType.Exchange, null);

    public override string ToString() => Name;

    public static MeteringPointType? FromSerialized(string? evaluationPoint, string? settlementMethod) =>
        evaluationPoint switch
        {
            "" or null when string.IsNullOrEmpty(settlementMethod) => All,
            nameof(ModelMeteringPointType.Production) => Production,
            nameof(ModelMeteringPointType.Exchange) => Exchange,
            nameof(ModelMeteringPointType.Consumption) => settlementMethod switch
            {
                nameof(ModelSettlementMethod.Flex) => FlexConsumption,
                nameof(ModelSettlementMethod.NonProfiled) => NonProfiledConsumption,
                "" or null => TotalConsumption,
                _ => null,
            },
            _ => null,
        };
}
