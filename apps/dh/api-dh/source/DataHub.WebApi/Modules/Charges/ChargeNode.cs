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
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using NodaTime;
using NodaTime.Extensions;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<Charge>]
public static partial class ChargeNode
{
    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<Charge>> GetChargesAsync(
        string? filter,
        GetChargesQuery? query,
        IChargesClient client,
        CancellationToken ct)
    {
        var result = await client.GetChargesAsync(0, 1000, filter, new ChargeSortInput(Common.Enums.SortDirection.Desc, null), query, ct) ?? [];

        result = result.FilterOnActors(query?.ActorNumbers);
        result = result.FilterOnTypes(query?.ChargeTypes);
        result = result.FilterOnVatClassification(query?.MoreOptions);
        result = result.FilterOnTransparentInvoicing(query?.MoreOptions);
        result = result.FilterOnStatuses(query?.Statuses, ct);
        result = result.Where(charge =>
            filter is null ||
            charge.Id.Code.Contains(filter, StringComparison.CurrentCultureIgnoreCase) ||
            charge.Periods.Any(p => p.Name.Contains(filter, StringComparison.CurrentCultureIgnoreCase)));

        return result;
    }

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<Charge?> GetChargeByIdAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        CancellationToken ct) =>
            await client.GetChargeByIdAsync(id, ct);

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<Charge>> GetChargesByTypeAsync(
        IChargesClient client,
        ChargeType type,
        CancellationToken ct) =>
            await client.GetChargesByTypeAsync(type, ct);

    [Mutation]
    [Authorize(Roles = new[] { "charges:manage" })]
    public static async Task<bool> CreateChargeAsync(
        IChargesClient client,
        CreateChargeInput input,
        CancellationToken ct) =>
            await client.CreateChargeAsync(input, ct);

    [Mutation]
    [Authorize(Roles = new[] { "charges:manage" })]
    public static async Task<bool> UpdateChargeAsync(
        IChargesClient client,
        UpdateChargeInput input,
        CancellationToken ct) =>
            await client.UpdateChargeAsync(input, ct);

    [Mutation]
    [Authorize(Roles = new[] { "charges:manage" })]
    public static async Task<bool> StopChargeAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        DateTimeOffset terminationDate,
        CancellationToken ct) =>
            await client.StopChargeAsync(id, terminationDate, ct);

    [Mutation]
    [Authorize(Roles = new[] { "charges:manage" })]
    public static async Task<bool> AddChargeSeriesAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        DateTimeOffset start,
        DateTimeOffset end,
        List<ChargePointV1> points,
        CancellationToken ct) =>
            await client.AddChargeSeriesAsync(id, start, end, points, ct);

    public static async Task<IEnumerable<ChargeSeries>> GetSeriesAsync(
        [Parent] Charge charge,
        Interval interval,
        IChargesClient client,
        CancellationToken ct) =>
            await client.GetChargeSeriesAsync(charge.Id, charge.Resolution, interval, ct);

    public static async Task<ActorDto?> GetOwnerAsync(
        [Parent] Charge charge,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader,
        CancellationToken ct)
    {
        var owner = await dataLoader.LoadAsync((charge.Id.Owner, EicFunction.SystemOperator), ct);
        return owner ?? await dataLoader.LoadAsync((charge.Id.Owner, EicFunction.GridAccessProvider), ct);
    }

    public static ChargeStatus GetStatus([Parent] Charge charge) =>
        charge.HasSeriesAndIsCurrent switch
        {
            _ when charge.ValidFrom == charge.ValidTo => ChargeStatus.Cancelled,
            _ when DateTimeOffset.Now > charge.ValidTo => ChargeStatus.Closed,
            _ when DateTimeOffset.Now < charge.ValidFrom => ChargeStatus.Awaiting,
            false => ChargeStatus.MissingPriceSeries,
            true => ChargeStatus.Current,
        };

    static partial void Configure(IObjectTypeDescriptor<Charge> descriptor)
    {
        descriptor.Name("Charge");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.Id.Code).Name("code");
        descriptor.Field(f => f.Name);
        descriptor.Field(f => f.Type);
        descriptor.Field(f => $"{f.Id.Code} - {f.Name}").Name("displayName");
        descriptor.Field(f => f.Description);
        descriptor.Field(f => f.Periods);
        descriptor.Field(f => f.Resolution);
        descriptor.Field(f => f.TransparentInvoicing);
        descriptor.Field(f => f.VatInclusive);
    }
}
