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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Client;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using HotChocolate.Authorization;
using MarkPart = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges;

[ObjectType<ChargeLink>]
public static partial class ChargeOperations
{
    [Query]
    [UseSorting]
    [Authorize(Roles = new[] { "metering-point:prices" })]
    public static async Task<IEnumerable<ChargeLink>> GetChargeLinksByMeteringPointIdAsync(
        string meteringPointId,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.GetChargeLinksByMeteringPointIdAsync(meteringPointId, ct).ConfigureAwait(false);

    [Query]
    [Authorize(Roles = new[] { "metering-point:prices" })]
    public static async Task<ChargeLink?> GetChargeLinkByIdAsync(
        string meteringPointId,
        string chargeLinkId,
        CancellationToken ct,
        IChargeLinkClient client)
    {
        var chargeLinks = await client
            .GetChargeLinksByMeteringPointIdAsync(meteringPointId, ct)
            .ConfigureAwait(false);

        return chargeLinks.FirstOrDefault(cl => cl.Id == chargeLinkId);
    }

    public static async Task<IEnumerable<ChargeLinkHistory>> GetHistoryAsync(
        [Parent] ChargeLink chargeLink,
        CancellationToken ct,
        IChargeLinkClient client) =>
            await client.GetChargeLinkHistoryAsync(chargeLink.Id, ct).ConfigureAwait(false);

    public static async Task<ChargeInformationDto?> GetChargeAsync(
        [Parent] ChargeLink chargeLink,
        IChargesClient client,
        CancellationToken ct) =>
            await client.GetChargeByIdAsync(chargeLink.ChargeIdentifier, ct).ConfigureAwait(false);

    public static async Task<MarkPart.ActorDto?> GetOwnerAsync(
        [Parent] ChargeLink chargeLink,
        IMarketParticipantByIdDataLoader dataLoader,
        CancellationToken ct) =>
            await dataLoader.LoadAsync(chargeLink.Owner.Id, ct).ConfigureAwait(false);

    static partial void Configure(IObjectTypeDescriptor<ChargeLink> descriptor)
    {
        descriptor.Name("ChargeLink");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Amount);
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.Name);
        descriptor.Field(f => f.Period);
        descriptor.Field(f => f.Type);
        descriptor.Field(f => $"{f.Id} • ({f.Name})").Name("displayName");
    }
}
