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
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Client;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges;

[ObjectType<ChargeLinkDto>]
public static partial class ChargeLinkOperations
{
    [Query]
    [UseSorting]
    [Authorize(Roles = new[] { "metering-point:prices" })]
    public static async Task<IEnumerable<ChargeLinkDto>> GetChargeLinksByMeteringPointIdAsync(
        string meteringPointId,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.GetChargeLinksByMeteringPointIdAsync(meteringPointId, ct);

    [Query]
    [Authorize(Roles = new[] { "metering-point:prices" })]
    public static async Task<ChargeLinkDto?> GetChargeLinkByIdAsync(
        ChargeLinkId id,
        CancellationToken ct,
        IChargeLinkClient client)
    {
        var chargeLinks = await client.GetChargeLinksByMeteringPointIdAsync(id.MeteringPointId, ct);
        return chargeLinks.FirstOrDefault(cl => cl.ChargeIdentifier == id.ChargeId);
    }

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:prices-manage" })]
    public static async Task<bool> StopChargeLinkAsync(
        ChargeLinkId id,
        DateTimeOffset stopDate,
        IChargeLinkClient client,
        CancellationToken ct) =>
            await client.StopChargeLinkAsync(id, stopDate, ct);

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:prices-manage" })]
    public static async Task<bool> EditChargeLinkAsync(
        ChargeLinkId id,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.EditChargeLinkAsync(id, newStartDate, factor, ct);

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:prices-manage" })]
    public static async Task<bool> CreateChargeLinkAsync(
        ChargeIdentifierDto chargeId,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.CreateChargeLinkAsync(chargeId, meteringPointId, newStartDate, factor, ct);

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:prices-manage" })]
    public static async Task<bool> CancelChargeLinkAsync(
        ChargeLinkId id,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.CancelChargeLinkAsync(id, ct);

    public static IEnumerable<ChargeLinkHistory> GetHistory(
        [Parent] ChargeLinkDto chargeLink) =>
            chargeLink.ChargeLinkPeriods
                .OrderByDescending(x => x.From)
                .Skip(1)
                .Select(period => new ChargeLinkHistory(
                    period.From.ToDateTimeOffset(),
                    string.Empty,
                    string.Empty)).ToList();

    public static async Task<Charge?> GetChargeAsync(
        [Parent] ChargeLinkDto chargeLink,
        IChargesClient client,
        CancellationToken ct) =>
            await client.GetChargeByIdAsync(chargeLink.ChargeIdentifier, ct);

    public static int GetAmount([Parent] ChargeLinkDto chargeLink) => chargeLink.GetCurrentPeriod()?.Factor ?? 1;

    public static ChargeLinkPeriodDto? GetCurrentPeriod([Parent] ChargeLinkDto chargeLink) =>
        chargeLink.GetCurrentPeriod();

    static partial void Configure(IObjectTypeDescriptor<ChargeLinkDto> descriptor)
    {
        descriptor.Name("ChargeLink");
        descriptor.BindFieldsExplicitly();
        descriptor
            .Field(f => new ChargeLinkId(f.MeteringPointId, f.ChargeIdentifier))
            .Type<NonNullType<StringType>>()
            .Name("id");
    }
}
