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

using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeLinkPeriod>]
public static partial class ChargeLinkPeriodNode
{
    [Query]
    [UseRevisionLog]
    [Authorize(Roles = ["metering-point:prices"])]
    public static async Task<IEnumerable<ChargeLinkPeriod>> GetChargeLinkPeriodsAsync(
        string meteringPointId,
        IChargesClient client,
        IChargeByIdDataLoader dataLoader,
        CancellationToken ct)
    {
        var items = await client.GetChargeLinkPeriodsAsync(meteringPointId, ct);
        var charges = await dataLoader.LoadRequiredAsync([.. items.Select(i => i.ChargeId)], ct);
        var chargeMap = charges.Distinct().ToDictionary(c => c.Id);
        return items.OrderBy(item => GetSortKeyValue(item, chargeMap[item.ChargeId]));
    }

    [Query]
    [Authorize(Roles = ["metering-point:prices"])]
    public static async Task<ChargeLinkPeriod?> GetChargeLinkPeriodByIdAsync(
        ChargeLinkPeriodId id,
        IChargesClient client,
        CancellationToken ct)
        => await client.GetChargeLinkPeriodByIdAsync(id, ct);

    public static async Task<string> GetSortKeyAsync(
        [Parent] ChargeLinkPeriod item,
        IChargeByIdDataLoader dataLoader)
    {
        var charge = await dataLoader.LoadRequiredAsync(item.ChargeId);
        return GetSortKeyValue(item, charge);
    }

    public static async Task<Charge> GetChargeAsync(
        [Parent] ChargeLinkPeriod item,
        IChargeByIdDataLoader dataLoader)
        => await dataLoader.LoadRequiredAsync(item.ChargeId);

    public static async Task<IEnumerable<ChargeLinkPeriodChange>> GetChangesAsync(
        [Parent] ChargeLinkPeriod item,
        IChargesClient client,
        CancellationToken ct)
    {
        var periods = await client.GetHistoricalChargeLinkPeriodsByIdAsync(item.Id, ct);
        return ChargeLinkPeriodChange.FromPeriods(periods);
    }

    public static Interval GetPeriod([Parent] ChargeLinkPeriod item)
    {
        var hideEnd = item.ChargeId.TypeDto == ChargeTypeDto.Fee && item.Period.From != item.Period.To;
        return new(item.Period.From, hideEnd ? null : item.Period.To);
    }

    public static bool GetCancelled([Parent] ChargeLinkPeriod item)
        => item.Period.To == item.Period.From;

    public static bool GetClosed([Parent] ChargeLinkPeriod item)
    {
        if (GetCancelled(item)) return true; // Treat cancelled as closed
        return item.Period.To is not null && item.Period.To < DateTimeOffset.Now.ToInstant();
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeLinkPeriod> descriptor)
    {
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Period.Factor).Name("amount");
        descriptor.Field(f => f.Id).Type<NonNullType<StringType>>().Name("id");
    }

    private static string GetSortKeyValue(ChargeLinkPeriod item, Charge charge)
    {
        var invertedDate = long.MaxValue - item.Period.From.ToUnixTimeMilliseconds();
        return $"{charge.Type.SortOrder}{item.ChargeId.Owner}{item.ChargeId.Code}{invertedDate}";
    }
}
