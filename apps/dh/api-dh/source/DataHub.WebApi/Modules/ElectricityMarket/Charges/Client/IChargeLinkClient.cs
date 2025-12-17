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
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Client;

/// <summary>
/// Client for interacting with charges.
/// </summary>
public interface IChargeLinkClient
{
    /// <summary>
    /// Get all charges that are linked to a given metering point id.
    /// </summary>
    Task<IEnumerable<ChargeLinkDto>> GetChargeLinksByMeteringPointIdAsync(
        string meteringPointId,
        CancellationToken ct = default);

    /// <summary>
    /// Get the change history for a given charge id.
    /// </summary>
    Task<IEnumerable<ChargeLinkHistory>> GetChargeLinkHistoryAsync(
        long chargeId,
        CancellationToken ct = default);

    /// <summary>
    /// Stops a charge link at a given date.
    /// </summary>
    Task<bool> StopChargeLinkAsync(
       ChargeIdentifierDto ident,
       string meteringPointId,
       DateTimeOffset stopDate,
       CancellationToken ct = default);

    /// <summary>
    /// Cancels a charge link by its id.
    /// </summary>
    Task<bool> CancelChargeLinkAsync(ChargeIdentifierDto ident, string meteringPointId, CancellationToken ct = default);

    /// <summary>
    /// Edits a charge link's start date and factor.
    /// </summary>
    Task<bool> EditChargeLinkAsync(
        ChargeIdentifierDto ident,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default);

    /// <summary>
    /// Creates a charge link with a start date and factor.
    /// </summary>
    Task<bool> CreateChargeLinkAsync(
        ChargeIdentifierDto ident,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default);
}
