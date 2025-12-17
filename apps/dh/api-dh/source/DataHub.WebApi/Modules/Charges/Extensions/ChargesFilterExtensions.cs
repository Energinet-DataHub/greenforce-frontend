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

using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using VatClassification = Energinet.DataHub.Charges.Abstractions.Shared.VatClassificationDto;

public static class ChagesFilterExtensions
{
    public static IEnumerable<Charge> FilterOnActors(
            this IEnumerable<Charge> charges,
            string[]? actorIds)
    {
        if (actorIds?.Any() == true)
        {
            return charges.Where(charge =>
                actorIds.Contains(charge.ChargeIdentifierDto.Owner));
        }

        return charges;
    }

    public static IEnumerable<Charge> FilterOnTypes(
            this IEnumerable<Charge> charges,
            ChargeType[]? chargeTypes)
    {
        if (chargeTypes?.Any() == true)
        {
            return charges.Where(charge =>
                chargeTypes.Any(type => type == ChargeType.Make(charge.ChargeIdentifierDto.TypeDto, charge.TaxIndicator)));
        }

        return charges;
    }

    public static IEnumerable<Charge> FilterOnVatClassification(
            this IEnumerable<Charge> charges,
            string[]? moreOptions)
    {
        if (moreOptions?.Any(x => x == "vat-true") == true)
        {
            charges = charges.Where(charge => charge.GetCurrentPeriod()?.VatClassificationDto == VatClassification.Vat25);
        }

        if (moreOptions?.Any(x => x == "vat-false") == true)
        {
            charges = charges.Where(charge => charge.GetCurrentPeriod()?.VatClassificationDto == VatClassification.NoVat);
        }

        return charges;
    }

    public static IEnumerable<Charge> FilterOnTransparentInvoicing(
            this IEnumerable<Charge> charges,
            string[]? moreOptions)
    {
        if (moreOptions?.Any(x => x == "transparentInvoicing-true") == true)
        {
            charges = charges.Where(charge => charge.GetCurrentPeriod()?.TransparentInvoicing == true);
        }

        if (moreOptions?.Any(x => x == "transparentInvoicing-false") == true)
        {
            charges = charges.Where(charge => charge.GetCurrentPeriod()?.TransparentInvoicing == false);
        }

        return charges;
    }

    public static IEnumerable<Charge> FilterOnStatuses(
            this IEnumerable<Charge> charges,
            ChargeStatus[]? statuses,
            CancellationToken ct)
    {
        if (statuses?.Any() == true)
        {
            return charges.Where(charge => statuses.Contains(charge.GetChargeStatus()));
        }

        return charges;
    }
}
