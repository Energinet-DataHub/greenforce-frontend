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
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Charges;

public static class ChargeLinkMutations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:prices-manage"])]
    public static async Task<bool> StopChargeLinkAsync(
        ChargeLinkId id,
        DateTimeOffset stopDate,
        IChargesClient client,
        CancellationToken ct)
        => await client.StopChargeLinkAsync(id, stopDate, ct);

    [Mutation]
    [Authorize(Roles = ["metering-point:prices-manage"])]
    public static async Task<bool> EditChargeLinkAsync(
        ChargeLinkId id,
        DateTimeOffset newStartDate,
        int factor,
        IChargesClient client,
        CancellationToken ct)
        => await client.EditChargeLinkAsync(id, newStartDate, factor, ct);

    [Mutation]
    [Authorize(Roles = ["metering-point:prices-manage"])]
    public static async Task<bool> CreateChargeLinkAsync(
        ChargeIdentifierDto chargeId,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        IChargesClient client,
        CancellationToken ct)
        => await client.CreateChargeLinkAsync(chargeId, meteringPointId, newStartDate, factor, ct);

    [Mutation]
    [Authorize(Roles = ["metering-point:prices-manage"])]
    public static async Task<bool> CancelChargeLinkAsync(
        ChargeLinkId id,
        IChargesClient client,
        CancellationToken ct)
        => await client.CancelChargeLinkAsync(id, ct);
}
