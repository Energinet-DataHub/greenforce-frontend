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

using ModelBusinessReason = Energinet.DataHub.WebApi.Model.BusinessReason;
using ModelSettlementVersion = Energinet.DataHub.WebApi.Model.SettlementVersion;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record RequestCalculationType(
    string Name,
    ModelBusinessReason BusinessReason,
    ModelSettlementVersion? SettlementVersion)
{
    public static readonly RequestCalculationType Aggregation = new(nameof(Aggregation), ModelBusinessReason.PreliminaryAggregation, null);
    public static readonly RequestCalculationType BalanceFixing = new(nameof(BalanceFixing), ModelBusinessReason.BalanceFixing, null);
    public static readonly RequestCalculationType WholesaleFixing = new(nameof(WholesaleFixing), ModelBusinessReason.WholesaleFixing, null);
    public static readonly RequestCalculationType FirstCorrection = new(nameof(FirstCorrection), ModelBusinessReason.Correction, ModelSettlementVersion.FirstCorrection);
    public static readonly RequestCalculationType SecondCorrection = new(nameof(SecondCorrection), ModelBusinessReason.Correction, ModelSettlementVersion.SecondCorrection);
    public static readonly RequestCalculationType ThirdCorrection = new(nameof(ThirdCorrection), ModelBusinessReason.Correction, ModelSettlementVersion.ThirdCorrection);
    public static readonly RequestCalculationType LatestCorrection = new(nameof(ThirdCorrection), ModelBusinessReason.Correction, null);

    public override string ToString() => Name;

    public static RequestCalculationType? FromSerialized(string businessReason, string? settlementVersion) =>
        businessReason switch
        {
            nameof(ModelBusinessReason.PreliminaryAggregation) => Aggregation,
            nameof(ModelBusinessReason.BalanceFixing) => BalanceFixing,
            nameof(ModelBusinessReason.WholesaleFixing) => WholesaleFixing,
            nameof(ModelBusinessReason.Correction) => settlementVersion switch
            {
                nameof(ModelSettlementVersion.FirstCorrection) => FirstCorrection,
                nameof(ModelSettlementVersion.SecondCorrection) => SecondCorrection,
                nameof(ModelSettlementVersion.ThirdCorrection) => ThirdCorrection,
                "" or null => LatestCorrection,
                _ => null, // invalid/unknown
            },
            _ => null, // invalid/unknown
        };
}
