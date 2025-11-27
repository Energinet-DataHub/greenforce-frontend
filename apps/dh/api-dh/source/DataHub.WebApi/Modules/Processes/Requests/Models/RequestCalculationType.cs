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

using Energinet.DataHub.EDI.B2CClient.Abstractions.Common;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public record RequestCalculationType(
    string Name,
    BusinessReasonV1 BusinessReason,
    SettlementVersionV1? SettlementVersion)
{
    public static readonly RequestCalculationType Aggregation = new RequestCalculationType(nameof(Aggregation), BusinessReasonV1.PreliminaryAggregation, null);
    public static readonly RequestCalculationType BalanceFixing = new RequestCalculationType(nameof(BalanceFixing), BusinessReasonV1.BalanceFixing, null);
    public static readonly RequestCalculationType WholesaleFixing = new RequestCalculationType(nameof(WholesaleFixing), BusinessReasonV1.WholesaleFixing, null);
    public static readonly RequestCalculationType FirstCorrection = new RequestCalculationType(nameof(FirstCorrection), BusinessReasonV1.Correction, SettlementVersionV1.FirstCorrection);
    public static readonly RequestCalculationType SecondCorrection = new RequestCalculationType(nameof(SecondCorrection), BusinessReasonV1.Correction, SettlementVersionV1.SecondCorrection);
    public static readonly RequestCalculationType ThirdCorrection = new RequestCalculationType(nameof(ThirdCorrection), BusinessReasonV1.Correction, SettlementVersionV1.ThirdCorrection);
    public static readonly RequestCalculationType LatestCorrection = new RequestCalculationType(nameof(ThirdCorrection), BusinessReasonV1.Correction, null);

    public override string ToString() => Name;

    public static RequestCalculationType? FromSerialized(string businessReason, string? settlementVersion) =>
        businessReason switch
        {
            nameof(BusinessReasonV1.PreliminaryAggregation) => Aggregation,
            nameof(BusinessReasonV1.BalanceFixing) => BalanceFixing,
            nameof(BusinessReasonV1.WholesaleFixing) => WholesaleFixing,
            nameof(BusinessReasonV1.Correction) => settlementVersion switch
            {
                nameof(SettlementVersionV1.FirstCorrection) => FirstCorrection,
                nameof(SettlementVersionV1.SecondCorrection) => SecondCorrection,
                nameof(SettlementVersionV1.ThirdCorrection) => ThirdCorrection,
                "" or null => LatestCorrection,
                _ => null, // invalid/unknown
            },
            _ => null, // invalid/unknown
        };
}
