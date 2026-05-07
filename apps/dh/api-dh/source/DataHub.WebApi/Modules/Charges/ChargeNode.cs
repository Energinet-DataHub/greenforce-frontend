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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeSeries;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V2.Models;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using NodaTime;
using NodaTime.Extensions;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<Charge>]
public static partial class ChargeNode
{
    [Query]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:view"])]
    public static async Task<Charge?> GetChargeByIdAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        CancellationToken ct)
        => await client.GetChargeByIdAsync(id, ct);

    [Query]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:view"])]
    public static async Task<IEnumerable<Charge>> GetChargesByTypeAsync(
        IChargesClient client,
        ChargeType type,
        CancellationToken ct)
        => await client.GetChargesByTypeAsync(type, ct);

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:manage"])]
    public static async Task<bool> CreateChargeAsync(
        IChargesClient client,
        string code,
        string name,
        string description,
        ChargeType type,
        Resolution resolution,
        DateTimeOffset validFrom,
        bool vat,
        bool? transparentInvoicing,
        bool? spotDependingPrice,
        CancellationToken ct)
        => await client.CreateChargeAsync(
            code,
            name,
            description,
            type,
            resolution,
            validFrom,
            vat,
            transparentInvoicing,
            spotDependingPrice,
            ct);

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:manage"])]
    public static async Task<bool> UpdateChargeAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        string name,
        string description,
        DateTimeOffset cutoffDate,
        bool vat,
        bool transparentInvoicing,
        CancellationToken ct)
        => await client.UpdateChargeAsync(id, name, description, cutoffDate, vat, transparentInvoicing, ct);

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:manage"])]
    public static async Task<bool> StopChargeAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        DateTimeOffset terminationDate,
        CancellationToken ct)
        => await client.StopChargeAsync(id, terminationDate, ct);

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = ["charges:manage"])]
    public static async Task<bool> AddChargeSeriesAsync(
        IChargesClient client,
        ChargeIdentifierDto id,
        DateTimeOffset start,
        DateTimeOffset end,
        List<ChargePointV2> points,
        CancellationToken ct)
        => await client.AddChargeSeriesAsync(id, start, end, points, ct);

    public static async Task<MissingPriceSeriesResult> GetMissingPriceSeriesPointsAsync(
        [Parent] Charge charge,
        IChargesClient client,
        CancellationToken ct)
    {
        var periods = charge.Periods.Where(p => p.Status != ChargeStatus.Cancelled).ToList();
        if (periods.Count == 0) return new MissingPriceSeriesResult(Gaps: [], EndsAt: null);

        var lookback = DateTimeOffset.Now
            .ToInstant()
            .InZone(LocalDateExtensions.DanishTimeZone).Date
            .PlusMonths(-3)
            .With(DateAdjusters.StartOfMonth)
            .AtStartOfDayInZone(LocalDateExtensions.DanishTimeZone)
            .ToInstant();

        var maxEnd = DateTimeOffset.UtcNow.AddYears(10).ToInstant();
        var start = Instant.Max(lookback, periods.Min(p => p.Period.Start));
        var end = periods.Max(p => p.Period.HasEnd ? p.Period.End : maxEnd);

        return await client.GetMissingPriceSeriesPointsAsync(
            charge.Id,
            charge.Resolution,
            new(start, end),
            ct);
    }

    public static async Task<IEnumerable<ChargeSeriesPointDto>> GetSeriesAsync(
        [Parent] Charge charge,
        Interval interval,
        IChargesClient client,
        CancellationToken ct)
        => await client.GetChargeSeriesAsync(charge.Id, charge.Resolution, interval, ct);

    public static async Task<ActorDto?> GetOwnerAsync(
        [Parent] Charge charge,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader,
        CancellationToken ct)
    {
        var owner = await dataLoader.LoadAsync((charge.Id.Owner, EicFunction.SystemOperator), ct);
        return owner ?? await dataLoader.LoadAsync((charge.Id.Owner, EicFunction.GridAccessProvider), ct);
    }

    static partial void Configure(IObjectTypeDescriptor<Charge> descriptor)
    {
        descriptor.Name("Charge");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.Code);
        descriptor.Field(f => f.Name);
        descriptor.Field(f => f.Type);
        descriptor.Field(f => f.TypeDisplayName);
        descriptor.Field(f => $"{f.Code} • {f.Name}").Name("displayName");
        descriptor.Field(f => f.Description);
        descriptor.Field(f => f.Periods);
        descriptor.Field(f => f.Resolution);
        descriptor.Field(f => f.Status);
        descriptor.Field(f => f.VatInclusive);
        descriptor.Field(f => f.TransparentInvoicing);
        descriptor.Field(f => f.SpotDependingPrice);
    }
}
