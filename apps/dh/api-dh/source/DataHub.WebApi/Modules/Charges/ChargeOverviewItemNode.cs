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

using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeOverviewItem>]
public static partial class ChargeOverviewItemNode
{
    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = ["charges:view"])]
    public static async Task<IEnumerable<ChargeOverviewItem>> GetChargeOverviewAsync(
        string? filter,
        ChargeOverviewQuery? query,
        IChargesClient client,
        CancellationToken ct)
    {
        var items = await client.GetChargeOverviewAsync(filter, query, ct);
        return items
            .OrderBy(item => item.Charge.Type.SortOrder)
            .ThenBy(item => item.Charge.Id.Owner)
            .ThenBy(item => item.Charge.Code)
            .ThenByDescending(item => item.Period.HasEnd ? item.Period.End : Instant.MaxValue);
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeOverviewItem> descriptor)
    {
        descriptor.Name("ChargeOverviewItem");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Charge);
        descriptor.Field(f => f.Period);
    }
}
