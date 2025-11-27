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
using ChargeInformation = Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record ChargeType(
    string Name,
    ChargeInformation.ChargeType Type,
    bool IsFee)
{
    public static readonly ChargeType Tariff = new ChargeType(nameof(Tariff), ChargeInformation.ChargeType.Tariff, false);
    public static readonly ChargeType TariffTax = new ChargeType(nameof(TariffTax), ChargeInformation.ChargeType.Tariff, true);
    public static readonly ChargeType Subscription = new ChargeType(nameof(Subscription), ChargeInformation.ChargeType.Subscription, false);
    public static readonly ChargeType Fee = new ChargeType(nameof(Fee), ChargeInformation.ChargeType.Fee, false);

    public override string ToString() => Name;

    public static ChargeType Make(ChargeInformation.ChargeType chargeType, bool isTax) =>
        chargeType switch
        {
            ChargeInformation.ChargeType.Tariff when isTax is true => ChargeType.TariffTax,
            ChargeInformation.ChargeType.Tariff => ChargeType.Tariff,
            ChargeInformation.ChargeType.Subscription => ChargeType.Subscription,
            ChargeInformation.ChargeType.Fee => ChargeType.Fee,
        };
}
