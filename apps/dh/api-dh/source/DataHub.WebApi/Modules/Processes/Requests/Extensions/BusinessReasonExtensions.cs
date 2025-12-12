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

using Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;
using RequestAggregatedMeasureDataBusinessReasonV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestAggregatedMeasureData.V1.BusinessReasonV1;
using RequestWholesaleSettlementBusinessReasonV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1.BusinessReasonV1;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Extensions;

public static class BusinessReasonExtensions
{
    public static RequestWholesaleSettlementBusinessReasonV1 MapToRequestWholesaleSettlementV1(this BusinessReason source)
    {
        return source switch
        {
            BusinessReason.BalanceFixing => throw new ArgumentOutOfRangeException(nameof(source), source, null),
            BusinessReason.PreliminaryAggregation => throw new ArgumentOutOfRangeException(nameof(source), source, null),
            BusinessReason.Correction => RequestWholesaleSettlementBusinessReasonV1.Correction,
            BusinessReason.WholesaleFixing => RequestWholesaleSettlementBusinessReasonV1.WholesaleFixing,
        };
    }

    public static RequestWholesaleSettlementBusinessReasonV1? MapToRequestWholesaleSettlementV1(this BusinessReason? source)
    {
        return source?.MapToRequestWholesaleSettlementV1();
    }

    public static RequestAggregatedMeasureDataBusinessReasonV1 MapToRequestAggregatedMeasureDataV1(this BusinessReason source)
    {
        return source switch
        {
            BusinessReason.BalanceFixing => RequestAggregatedMeasureDataBusinessReasonV1.BalanceFixing,
            BusinessReason.Correction => RequestAggregatedMeasureDataBusinessReasonV1.Correction,
            BusinessReason.PreliminaryAggregation => RequestAggregatedMeasureDataBusinessReasonV1.PreliminaryAggregation,
            BusinessReason.WholesaleFixing => RequestAggregatedMeasureDataBusinessReasonV1.WholesaleFixing,
        };
    }

    public static RequestAggregatedMeasureDataBusinessReasonV1? MapToRequestAggregatedMeasureDataV1(this BusinessReason? source)
    {
        return source?.MapToRequestAggregatedMeasureDataV1();
    }
}
