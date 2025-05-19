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

public abstract record MeteringPointType(
    string Name,
    EdiTypes.MeteringPointType2? EvaluationPoint,
    EdiTypes.SettlementMethod? SettlementMethod)
{
    public static readonly MeteringPointType Production = new ProductionType();
    public static readonly MeteringPointType FlexConsumption = new FlexConsumptionType();
    public static readonly MeteringPointType TotalConsumption = new TotalConsumptionType();
    public static readonly MeteringPointType NonProfiledConsumption = new NonProfiledConsumptionType();
    public static readonly MeteringPointType Exchange = new ExchangeType();

    private record ProductionType()
        : MeteringPointType("PRODUCTION", EdiTypes.MeteringPointType2.Production, null);

    private record FlexConsumptionType()
        : MeteringPointType("FLEX_CONSUMPTION", EdiTypes.MeteringPointType2.Consumption, EdiTypes.SettlementMethod.Flex);

    private record TotalConsumptionType()
        : MeteringPointType("TOTAL_CONSUMPTION", EdiTypes.MeteringPointType2.Consumption, null);

    private record NonProfiledConsumptionType()
        : MeteringPointType("NON_PROFILED_CONSUMPTION", EdiTypes.MeteringPointType2.Consumption, EdiTypes.SettlementMethod.NonProfiled);

    private record ExchangeType()
        : MeteringPointType("EXCHANGE", EdiTypes.MeteringPointType2.Exchange, null);
}
