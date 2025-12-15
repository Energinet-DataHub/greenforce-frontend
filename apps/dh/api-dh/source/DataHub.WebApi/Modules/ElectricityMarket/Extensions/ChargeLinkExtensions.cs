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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;

public static class ChargeLinkExtensions
{
    public static ChargeLinkPeriodDto? GetCurrentPeriod(this ChargeLinkDto chargeLink)
    {
        return chargeLink.ChargeLinkPeriods
            .Where(IsCurrent)
            .OrderBy(p => p.From)
            .FirstOrDefault();
    }

    public static bool IsCurrent(this ChargeLinkPeriodDto period) =>
        period.From.ToDateTimeOffset() <= DateTimeOffset.Now && (period.To == null || period.To?.ToDateTimeOffset() > DateTimeOffset.Now);
}
