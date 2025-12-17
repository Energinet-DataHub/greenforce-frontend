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

using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfPriceList.V1.Models;
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using NodaTime;
using ChargeIdentifierDto = Energinet.DataHub.Charges.Abstractions.Shared.ChargeIdentifierDto;
using ChargeType = Energinet.DataHub.WebApi.Modules.Charges.Models.ChargeType;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

/// <summary>
/// Client for getting charge information.
/// </summary>
public interface IChargesClient
{
    /// <summary>
    /// Query charge information.
    /// </summary>
    Task<(IEnumerable<Charge> Charges, int TotalCount)?> GetChargesAsync(
        int skip,
        int take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge information by id.
    /// </summary>
    Task<Charge?> GetChargeByIdAsync(
        ChargeIdentifierDto id,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge information by type.
    /// </summary>
    Task<IEnumerable<Charge>> GetChargesByTypeAsync(
        ChargeType type,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge series for a charge.
    /// </summary>
    Task<IEnumerable<ChargeSeries>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval interval,
        CancellationToken ct = default);

    /// <summary>
    /// Create a new charge.
    /// </summary>
    Task<bool> CreateChargeAsync(
        CreateChargeInput input,
        CancellationToken ct = default);

    /// <summary>
    /// Update a charge.
    /// </summary>
    Task<bool> UpdateChargeAsync(
        UpdateChargeInput input,
        CancellationToken ct = default);

    /// <summary>
    /// Stop a charge.
    /// </summary>
    Task<bool> StopChargeAsync(
        ChargeIdentifierDto id,
        DateTimeOffset terminationDate,
        CancellationToken ct = default);

    /// <summary>
    /// Add series to a charge.
    /// </summary>
    Task<bool> AddChargeSeriesAsync(
        ChargeIdentifierDto id,
        DateTimeOffset start,
        DateTimeOffset end,
        List<ChargePointV1> points,
        CancellationToken ct = default);
}
