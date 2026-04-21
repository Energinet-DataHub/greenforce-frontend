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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;
using HotChocolate.Authorization;
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges;

[ObjectType<ChargeLinkOverviewItem>]
public static partial class ChargeLinkOverviewItemNode
{
    [Query]
    [Authorize(Roles = ["metering-point:prices"])]
    public static async Task<IEnumerable<ChargeLinkOverviewItem>> GetChargeLinkOverviewAsync(
        string meteringPointId,
        IChargesClient client,
        CancellationToken ct)
    {
        var items = await client.GetChargeLinkOverviewAsync(meteringPointId, ct);
        return items
            .OrderBy(item => item.Charge.Type.SortOrder)
            .ThenBy(item => item.Charge.Id.Owner)
            .ThenBy(item => item.Charge.Id.Code)
            .ThenByDescending(item => item.Period.From);
    }

    public static Interval GetPeriod([Parent] ChargeLinkOverviewItem item)
        => new(item.Period.From, item.Period.To);

    public static bool GetClosed([Parent] ChargeLinkOverviewItem item)
    {
        if (item.Period.To == item.Period.From) return true; // Treat cancelled as closed
        return item.Period.To is not null && item.Period.To < DateTimeOffset.Now.ToInstant();
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeLinkOverviewItem> descriptor)
    {
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Charge);
        descriptor.Field(f => f.Period.Factor).Name("amount");
        descriptor
            .Field(f => new ChargeLinkId(f.MeteringPointId, f.Charge.Id))
            .Type<NonNullType<StringType>>()
            .Name("chargeLinkId");
    }
}
