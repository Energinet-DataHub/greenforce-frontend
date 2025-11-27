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

using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestAggregatedMeasureData.V1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record MeteringPointType(
    string Name,
    MeteringPointTypeV1? EvaluationPoint,
    SettlementMethodV1? SettlementMethod)
{
    public static readonly MeteringPointType All = new MeteringPointType(nameof(All), null, null);
    public static readonly MeteringPointType Production = new MeteringPointType(nameof(Production), MeteringPointTypeV1.Production, null);
    public static readonly MeteringPointType FlexConsumption = new MeteringPointType(nameof(FlexConsumption), MeteringPointTypeV1.Consumption, SettlementMethodV1.Flex);
    public static readonly MeteringPointType TotalConsumption = new MeteringPointType(nameof(TotalConsumption), MeteringPointTypeV1.Consumption, null);
    public static readonly MeteringPointType NonProfiledConsumption = new MeteringPointType(nameof(NonProfiledConsumption), MeteringPointTypeV1.Consumption, SettlementMethodV1.NonProfiled);
    public static readonly MeteringPointType Exchange = new MeteringPointType(nameof(Exchange), MeteringPointTypeV1.Exchange, null);

    public override string ToString() => Name;

    public static MeteringPointType? FromSerialized(string? evaluationPoint, string? settlementMethod) =>
        evaluationPoint switch
        {
            "" or null when string.IsNullOrEmpty(settlementMethod) => All,
            nameof(MeteringPointTypeV1.Production) => Production,
            nameof(MeteringPointTypeV1.Exchange) => Exchange,
            nameof(MeteringPointTypeV1.Consumption) => settlementMethod switch
            {
                nameof(SettlementMethodV1.Flex) => FlexConsumption,
                nameof(SettlementMethodV1.NonProfiled) => NonProfiledConsumption,
                "" or null => TotalConsumption,
                _ => null,
            },
            _ => null,
        };
}
