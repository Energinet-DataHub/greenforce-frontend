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
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

/// <summary>
/// Client for getting charge information.
/// </summary>
public interface IChargesClient
{
    /// <summary>
    /// Query charge information.
    /// </summary>
    Task<IEnumerable<ChargeInformationDto>> GetChargesAsync(
        int skip,
        int take,
        string? filter,
        ChargeSortInput? order,
        GetChargesQuery? query,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge information by id.
    /// </summary>
    Task<ChargeInformationDto?> GetChargeByIdAsync(
        string id,
        CancellationToken ct);

    /// <summary>
    /// Get charge series for a charge.
    /// </summary>
    Task<IEnumerable<ChargeSeries>> GetChargeSeriesAsync(
        string chargeId,
        Resolution resolution,
        Interval interval,
        CancellationToken ct);
}
