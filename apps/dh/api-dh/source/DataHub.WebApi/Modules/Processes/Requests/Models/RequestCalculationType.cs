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

public record RequestCalculationType(
    string Name,
    EdiTypes.BusinessReason BusinessReason,
    EdiTypes.SettlementVersion? SettlementVersion)
{
    public static readonly RequestCalculationType Aggregation = new RequestCalculationType(nameof(Aggregation), EdiTypes.BusinessReason.PreliminaryAggregation, null);
    public static readonly RequestCalculationType BalanceFixing = new RequestCalculationType(nameof(BalanceFixing), EdiTypes.BusinessReason.BalanceFixing, null);
    public static readonly RequestCalculationType WholesaleFixing = new RequestCalculationType(nameof(WholesaleFixing), EdiTypes.BusinessReason.WholesaleFixing, null);
    public static readonly RequestCalculationType FirstCorrection = new RequestCalculationType(nameof(FirstCorrection), EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.FirstCorrection);
    public static readonly RequestCalculationType SecondCorrection = new RequestCalculationType(nameof(SecondCorrection), EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.SecondCorrection);
    public static readonly RequestCalculationType ThirdCorrection = new RequestCalculationType(nameof(ThirdCorrection), EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.ThirdCorrection);
    public static readonly RequestCalculationType LatestCorrection = new RequestCalculationType(nameof(ThirdCorrection), EdiTypes.BusinessReason.Correction, null);

    public override string ToString() => Name;

    public static RequestCalculationType? FromSerialized(string businessReason, string? settlementVersion) =>
        businessReason switch
        {
            nameof(EdiTypes.BusinessReason.PreliminaryAggregation) => Aggregation,
            nameof(EdiTypes.BusinessReason.BalanceFixing) => BalanceFixing,
            nameof(EdiTypes.BusinessReason.WholesaleFixing) => WholesaleFixing,
            nameof(EdiTypes.BusinessReason.Correction) => settlementVersion switch
            {
                nameof(EdiTypes.SettlementVersion.FirstCorrection) => FirstCorrection,
                nameof(EdiTypes.SettlementVersion.SecondCorrection) => SecondCorrection,
                nameof(EdiTypes.SettlementVersion.ThirdCorrection) => ThirdCorrection,
                "" or null => LatestCorrection,
                _ => null, // invalid/unknown
            },
            _ => null, // invalid/unknown
        };
}
