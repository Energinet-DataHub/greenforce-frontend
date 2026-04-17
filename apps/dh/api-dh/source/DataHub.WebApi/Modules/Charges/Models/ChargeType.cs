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
//
using ExternalChargeType = Energinet.DataHub.Charges.Abstractions.Shared.ChargeTypeDto;
using RequestChangeBillingMasterDataChargeType = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeBillingMasterData.V1.Models.ChargeTypeV1;
using RequestChangeOfPriceListChargeType = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Models.ChargeTypeV2;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record ChargeType(
    string Name,
    ExternalChargeType Type,
    bool IsTax,
    int SortOrder)
{
    public static readonly ChargeType Tariff = new(nameof(Tariff), ExternalChargeType.Tariff, false, 1);
    public static readonly ChargeType TariffTax = new(nameof(TariffTax), ExternalChargeType.Tariff, true, 2);
    public static readonly ChargeType Fee = new(nameof(Fee), ExternalChargeType.Fee, false, 3);
    public static readonly ChargeType Subscription = new(nameof(Subscription), ExternalChargeType.Subscription, false, 4);

    public override string ToString() => Name;

    public static ChargeType Make(ExternalChargeType chargeType, bool isTax) =>
        chargeType switch
        {
            ExternalChargeType.Tariff when isTax => TariffTax,
            ExternalChargeType.Tariff => Tariff,
            ExternalChargeType.Subscription => Subscription,
            ExternalChargeType.Fee => Fee,
        };

    public RequestChangeOfPriceListChargeType ToRequestChangeOfPriceListChargeType() => Type switch
    {
        ExternalChargeType.Tariff => RequestChangeOfPriceListChargeType.D01,
        ExternalChargeType.Subscription => RequestChangeOfPriceListChargeType.D02,
        ExternalChargeType.Fee => RequestChangeOfPriceListChargeType.D03,
    };

    public RequestChangeBillingMasterDataChargeType ToRequestChangeBillingMasterDataChargeType() => Type switch
    {
        ExternalChargeType.Tariff => RequestChangeBillingMasterDataChargeType.Tariff,
        ExternalChargeType.Subscription => RequestChangeBillingMasterDataChargeType.Subscription,
        ExternalChargeType.Fee => RequestChangeBillingMasterDataChargeType.Fee,
    };
}
