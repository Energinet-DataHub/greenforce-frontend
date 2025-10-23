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

using System.Threading.Tasks;
using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeInformationDto>]
public static partial class ChargesNode
{
    public static ChargeStatus Status([Parent] ChargeInformationDto charge) => charge.GetStatus();

    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<ChargeInformationDto>> GetChargesAsync(
        [Service] IChargesClient client,
        CancellationToken cancellationToken,
        GetChargesQuery? query)
    {
        if (query == null)
        {
            return Enumerable.Empty<ChargeInformationDto>();
        }

        var result = await client.GetChargeInformationAsync(
            new ChargeInformationSearchCriteriaDto(string.Empty, query.ActorNumbers?.ToList() ?? new List<Guid>(), query.ChargeTypes?.ToList() ?? new List<ChargeType>()),
            cancellationToken);

        return result.IsSuccess ? result.Value! : Enumerable.Empty<ChargeInformationDto>();
    }
}
