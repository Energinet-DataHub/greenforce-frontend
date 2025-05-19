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

public abstract record RequestCalculationType(
    string Name,
    EdiTypes.BusinessReason BusinessReason,
    EdiTypes.SettlementVersion? SettlementVersion)
{
    public static readonly RequestCalculationType Aggregation = new AggregationRequest();
    public static readonly RequestCalculationType BalanceFixing = new BalanceFixingRequest();
    public static readonly RequestCalculationType WholesaleFixing = new WholesaleFixingRequest();
    public static readonly RequestCalculationType FirstCorrection = new FirstCorrectionRequest();
    public static readonly RequestCalculationType SecondCorrection = new SecondCorrectionRequest();
    public static readonly RequestCalculationType ThirdCorrection = new ThirdCorrectionRequest();

    private record AggregationRequest() : RequestCalculationType("AGGREGATION", EdiTypes.BusinessReason.PreliminaryAggregation, null);

    private record BalanceFixingRequest() : RequestCalculationType("BALANCE_FIXING", EdiTypes.BusinessReason.BalanceFixing, null);

    private record WholesaleFixingRequest() : RequestCalculationType("WHOLESALE_FIXING", EdiTypes.BusinessReason.WholesaleFixing, null);

    private record FirstCorrectionRequest() : RequestCalculationType("FIRST_CORRECTION_SETTLEMENT", EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.FirstCorrection);

    private record SecondCorrectionRequest() : RequestCalculationType("SECOND_CORRECTION_SETTLEMENT", EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.SecondCorrection);

    private record ThirdCorrectionRequest() : RequestCalculationType("THIRD_CORRECTION_SETTLEMENT", EdiTypes.BusinessReason.Correction, EdiTypes.SettlementVersion.ThirdCorrection);

    public static RequestCalculationType? FromValues(string businessReason, string? settlementVersion) =>
        (businessReason, settlementVersion) switch
        {
            ("D03", null) => Aggregation,
            ("D04", null) => BalanceFixing,
            ("D05", null) => WholesaleFixing,
            ("D32", "D01") => FirstCorrection,
            ("D32", "D02") => SecondCorrection,
            ("D32", "D03") => ThirdCorrection,
            _ => null,
        };
}
