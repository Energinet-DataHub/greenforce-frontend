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

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

public abstract record RequestCalculationType(
    string Name,
    string BusinessReason,
    string? SettlementVersion)
{
    public static readonly RequestCalculationType Aggregation = new AggregationType();
    public static readonly RequestCalculationType BalanceFixing = new BalanceFixingType();
    public static readonly RequestCalculationType WholesaleFixing = new WholesaleFixingType();
    public static readonly RequestCalculationType FirstCorrection = new FirstCorrectionType();
    public static readonly RequestCalculationType SecondCorrection = new SecondCorrectionType();
    public static readonly RequestCalculationType ThirdCorrection = new ThirdCorrectionType();

    private sealed record AggregationType()
        : RequestCalculationType("AGGREGATION", "D03", null);

    private sealed record BalanceFixingType()
        : RequestCalculationType("BALANCE_FIXING", "D04", null);

    private sealed record WholesaleFixingType()
        : RequestCalculationType("WHOLESALE_FIXING", "D05", null);

    private sealed record FirstCorrectionType()
        : RequestCalculationType("FIRST_CORRECTION_SETTLEMENT", "D32", "D01");

    private sealed record SecondCorrectionType()
        : RequestCalculationType("SECOND_CORRECTION_SETTLEMENT", "D32", "D02");

    private sealed record ThirdCorrectionType()
        : RequestCalculationType("THIRD_CORRECTION_SETTLEMENT", "D32", "D03");

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
