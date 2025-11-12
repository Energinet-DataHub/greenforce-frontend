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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Charges.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using HotChocolate.Types.Pagination;
using NodaTime;
using MarkPart = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeInformationDto>]
public static partial class ChargeNode
{
    [Query]
    [UseOffsetPaging]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<CollectionSegment<ChargeInformationDto>> GetChargesAsync(
        int skip,
        int take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        IChargesClient client,
        CancellationToken ct)
    {
        var result = await client.GetChargesAsync(skip, take, filter, order, query, ct);
        return new CollectionSegment<ChargeInformationDto>(
            result.ToList(),
            new(true, true), // TODO: Fix
            9999); // TODO: Fix
    }

    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<ChargeInformationDto?> GetChargeByIdAsync(
        IChargesClient client,
        string id,
        CancellationToken ct) =>
        await client.GetChargeByIdAsync(id, ct);

    public static async Task<IEnumerable<ChargeSeries>> GetSeriesAsync(
        [Parent] ChargeInformationDto charge,
        Interval interval,
        IChargesClient client,
        CancellationToken ct) =>
        await client.GetChargeSeriesAsync(charge.Id, charge.Resolution, interval, ct);

    public static async Task<MarkPart.ActorDto?> GetOwnerAsync(
        [Parent] ChargeInformationDto charge,
        IMarketParticipantByIdDataLoader dataLoader,
        CancellationToken ct) =>
        await dataLoader.LoadAsync(new Guid(charge.Owner), ct);

    static partial void Configure(IObjectTypeDescriptor<ChargeInformationDto> descriptor)
    {
        descriptor.Name("Charge");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.ChargeType).Name("type");
        descriptor.Field(f => f.Code);
        descriptor.Field(f => $"{f.Code} • {f.Name}").Name("displayName");
        descriptor.Field(f => f.Name);
        descriptor.Field(f => f.Description);
        descriptor.Field(f => f.Resolution);
        descriptor.Field(f => f.GetStatus()).Name("status");
        descriptor.Field(f => f.ValidFrom);
        descriptor.Field(f => f.ValidTo);
    }
}
