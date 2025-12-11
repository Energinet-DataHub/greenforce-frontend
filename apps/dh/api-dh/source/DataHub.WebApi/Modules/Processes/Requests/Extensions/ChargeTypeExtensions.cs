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

using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Extensions;

public static class ChargeTypeExtensions
{
    public static ChargeTypeV1 MapToRequestWholesaleSettlementV1(this ChargeType source)
    {
        return source switch
        {
            ChargeType.Fee => ChargeTypeV1.Fee,
            ChargeType.Subscription => ChargeTypeV1.Subscription,
            ChargeType.Tariff => ChargeTypeV1.Tariff,
        };
    }

    public static ChargeTypeV1? MapToRequestWholesaleSettlementV1(this ChargeType? source)
    {
        return source?.MapToRequestWholesaleSettlementV1();
    }
}
