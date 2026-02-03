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

using Sqids;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Helpers;

public static class IdentifierEncoder
{
    public static SqidsEncoder<char> Encoder { get; set; } = new(new SqidsOptions
    {
        Alphabet = "n1uB3d0X7o2PrNTl8gC4fDQ5ZYmVbMIpRiWShKO6eqHyLJvEjAwxkUFGatcz9s", // Changing the alphabet will break the decoding of IDs!
        MinLength = 10,
    });

    public static string EncodeMeteringPointId(string meteringPointId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(meteringPointId);

        var encodedId = meteringPointId.ToCharArray();
        return Encoder.Encode(encodedId);
    }

    public static string EncodeMeteringPointId(string meteringPointId, string extraData)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(meteringPointId);

        var encodedId = (meteringPointId + extraData).ToCharArray();
        return Encoder.Encode(encodedId);
    }

    public static string EncodeMeteringPointId(string meteringPointId, DateTimeOffset from, DateTimeOffset to)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(meteringPointId);

        var fromString = from.UtcDateTime.ToString("O");
        var toString = to.UtcDateTime.ToString("O");

        var encodedId = $"{meteringPointId}{fromString}{toString}".ToCharArray();
        return Encoder.Encode(encodedId);
    }

    public static string DecodeMeteringPointId(string meteringPointId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(meteringPointId);

        return string.Concat(Encoder.Decode(meteringPointId));
    }
}
