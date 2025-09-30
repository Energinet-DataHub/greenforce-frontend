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
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeDto>]
public static partial class ChargesNode
{
    private static readonly string[] _chargeOwners = { "ABC123", "XYZ456", "DEF789", "GHI012" };
    private static readonly string[] _chargeOwnerNames = { "Energy Provider A", "Grid Company B", "Utility Services C", "Power Distribution D" };
    private static readonly string[] _chargeDescriptions =
    {
        "Standard grid payment",
        "System utilization fee",
        "Electricity transmission tariff",
        "Peak hour surcharge",
        "Green energy contribution",
        "Network maintenance fee",
        "Capacity reservation charge",
        "System balancing fee",
    };

    // Static list of charges to ensure consistent data
    private static readonly List<ChargeDto> _staticCharges = GenerateStaticCharges();

    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "charges:view" })]
    public static IEnumerable<ChargeDto> GetChargesByPeriod(GetChargesByPeriodQuery query)
    {
        // Return the static list of charges regardless of query parameters
        return _staticCharges;
    }

    private static List<ChargeDto> GenerateStaticCharges()
    {
        var charges = new List<ChargeDto>();
        // Use a fixed seed for consistent "random" generation
        var rand = new Random(42);

        for (int i = 0; i < 101; i++)
        {
            var validFrom = DateTimeOffset.UtcNow.AddDays(-rand.Next(1, 365));
            var validTo = rand.Next(0, 10) < 8
                ? (DateTimeOffset?)validFrom.AddDays(rand.Next(30, 730))
                : null;

            var chargeType = (ChargeType)(rand.Next(3) + 1);
            string chargeIdPrefix = chargeType switch
            {
                ChargeType.D01 => "SUB",
                ChargeType.D02 => "FEE",
                ChargeType.D03 => "TAR",
                _ => "CHG",
            };

            var chargeStatus = (ChargeStatus)(rand.Next(5) + 1);

            var chargeId = $"{chargeIdPrefix}-{100000 + i}"; // Fixed ID based on index
            var chargeName = $"{(chargeType == ChargeType.D01
                ? "Subscription"
                : chargeType == ChargeType.D02
                    ? "Fee"
                    : "Tariff")} {1000 + i}"; // Fixed name based on index

            charges.Add(new ChargeDto(
                Id: new Guid($"00000000-0000-0000-0000-{1000000000 + i:D12}"), // Fixed GUID based on index
                ChargeType: chargeType,
                Resolution: (ChargeResolution)(rand.Next(4) + 1),
                Status: chargeStatus,
                ChargeId: chargeId,
                ChargeName: chargeName,
                ChargeDescription: _chargeDescriptions[i % _chargeDescriptions.Length],
                ChargeOwner: _chargeOwners[i % _chargeOwners.Length],
                ChargeOwnerName: _chargeOwnerNames[i % _chargeOwnerNames.Length],
                VatClassification: (VatClassification)(rand.Next(2) + 1),
                TaxIndicator: i % 2 == 0,
                TransparentInvoicing: i % 3 == 0,
                HasAnyPrices: i % 5 != 0, // 80% chance of having prices
                ValidFromDateTime: validFrom,
                ValidToDateTime: validTo));
        }

        return charges;
    }
}
