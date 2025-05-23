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

using EdiTypes = Energinet.DataHub.Edi.B2CWebApp.Clients.v1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record MeteringPointType(
    string Name,
    EdiTypes.MeteringPointType2? EvaluationPoint,
    EdiTypes.SettlementMethod? SettlementMethod)
{
    public static readonly MeteringPointType All = new MeteringPointType(nameof(All), null, null);
    public static readonly MeteringPointType Production = new MeteringPointType(nameof(Production), EdiTypes.MeteringPointType2.Production, null);
    public static readonly MeteringPointType FlexConsumption = new MeteringPointType(nameof(FlexConsumption), EdiTypes.MeteringPointType2.Consumption, EdiTypes.SettlementMethod.Flex);
    public static readonly MeteringPointType TotalConsumption = new MeteringPointType(nameof(TotalConsumption), EdiTypes.MeteringPointType2.Consumption, null);
    public static readonly MeteringPointType NonProfiledConsumption = new MeteringPointType(nameof(NonProfiledConsumption), EdiTypes.MeteringPointType2.Consumption, EdiTypes.SettlementMethod.NonProfiled);
    public static readonly MeteringPointType Exchange = new MeteringPointType(nameof(Exchange), EdiTypes.MeteringPointType2.Exchange, null);

    public override string ToString() => Name;

    public static MeteringPointType? FromSerialized(string? evaluationPoint, string? settlementMethod) =>
        evaluationPoint switch
        {
            "" or null when string.IsNullOrEmpty(settlementMethod) => All,
            nameof(EdiTypes.MeteringPointType2.Production) => Production,
            nameof(EdiTypes.MeteringPointType2.Exchange) => Exchange,
            nameof(EdiTypes.MeteringPointType2.Consumption) => settlementMethod switch
            {
                nameof(EdiTypes.SettlementMethod.Flex) => FlexConsumption,
                nameof(EdiTypes.SettlementMethod.NonProfiled) => NonProfiledConsumption,
                "" or null => TotalConsumption,
                _ => null,
            },
            _ => null,
        };
}
