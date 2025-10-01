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

using Energinet.DataHub.WebApi.Modules.Charges.Models;

namespace Energinet.DataHub.WebApi.Modules.Charges.Extensions;

public static class ChargeDtoExtensions
{
    public static ChargeStatus GetStatus(this ChargeDto charge)
    {
        if (charge.ValidFromDateTime == charge.ValidToDateTime.GetValueOrDefault())
        {
            return ChargeStatus.Cancelled;
        }

        if (charge.ValidFromDateTime > DateTimeOffset.Now && charge.HasAnyPrices == false)
        {
            return ChargeStatus.Awaiting;
        }

        if (charge.ValidFromDateTime < DateTimeOffset.Now && (charge.ValidToDateTime.HasValue == false || charge.ValidToDateTime.Value > DateTimeOffset.Now) && charge.HasAnyPrices == false)
        {
            return ChargeStatus.MissingPriceSeries;
        }

        if (charge.ValidFromDateTime < DateTimeOffset.Now && (charge.ValidToDateTime.HasValue == false || charge.ValidToDateTime.Value > DateTimeOffset.Now) && charge.HasAnyPrices)
        {
            return ChargeStatus.Current;
        }

        if (charge.ValidFromDateTime < DateTimeOffset.Now && charge.ValidToDateTime.HasValue && charge.ValidToDateTime.Value < DateTimeOffset.Now)
        {
            return ChargeStatus.Closed;
        }

        return ChargeStatus.Invalid;
    }
}
