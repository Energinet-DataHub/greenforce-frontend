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

using Energinet.DataHub.WebApi.Model;
using RequestAggregatedMeasureDataSettlementVersionV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestAggregatedMeasureData.V1.SettlementVersionV1;
using RequestWholesaleSettlementSettlementVersionV1 = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1.SettlementVersionV1;

namespace Energinet.DataHub.WebApi.Mapper;

public static class SettlementVersionExtensions
{
    public static RequestWholesaleSettlementSettlementVersionV1 MapToRequestWholesaleSettlementV1(this SettlementVersion source)
    {
        return source switch
        {
            SettlementVersion.FirstCorrection => RequestWholesaleSettlementSettlementVersionV1.FirstCorrection,
            SettlementVersion.SecondCorrection => RequestWholesaleSettlementSettlementVersionV1.SecondCorrection,
            SettlementVersion.ThirdCorrection => RequestWholesaleSettlementSettlementVersionV1.ThirdCorrection,
        };
    }

    public static RequestWholesaleSettlementSettlementVersionV1? MapToRequestWholesaleSettlementV1(this SettlementVersion? source)
    {
        return source?.MapToRequestWholesaleSettlementV1();
    }

    public static RequestAggregatedMeasureDataSettlementVersionV1 MapToRequestAggregatedMeasureDataV1(this SettlementVersion source)
    {
        return source switch
        {
            SettlementVersion.FirstCorrection => RequestAggregatedMeasureDataSettlementVersionV1.FirstCorrection,
            SettlementVersion.SecondCorrection => RequestAggregatedMeasureDataSettlementVersionV1.SecondCorrection,
            SettlementVersion.ThirdCorrection => RequestAggregatedMeasureDataSettlementVersionV1.ThirdCorrection,
        };
    }

    public static RequestAggregatedMeasureDataSettlementVersionV1? MapToRequestAggregatedMeasureDataV1(this SettlementVersion? source)
    {
        return source?.MapToRequestAggregatedMeasureDataV1();
    }
}
