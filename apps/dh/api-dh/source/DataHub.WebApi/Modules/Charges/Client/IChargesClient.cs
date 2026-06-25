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
    /// Query charge overview items (charges flattened by period).
    /// </summary>
    Task<IEnumerable<ChargeOverviewItem>> GetChargeOverviewAsync(
        string? filter,
        ChargeOverviewQuery? query,
        CancellationToken ct = default);

    /// <summary>
    /// Get all charges.
    /// </summary>
    Task<IEnumerable<Charge>> GetChargesAsync(CancellationToken ct = default);

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
    /// Get missing price series points for a charge within the given search interval.
    /// </summary>
    Task<MissingPriceSeriesResult> GetMissingPriceSeriesPointsAsync(
        ChargeIdentifierDto id,
        Resolution resolution,
        Interval interval,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge series for a charge.
    /// </summary>
    Task<IEnumerable<ChargeSeriesPointDto>> GetChargeSeriesAsync(
        ChargeIdentifierDto id,
        Interval interval,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge history for a charge.
    /// </summary>
    Task<IEnumerable<ChargeChange>> GetChargeHistoryAsync(
        ChargeIdentifierDto id,
        CancellationToken ct = default);

    /// <summary>
    /// Create a new charge.
    /// </summary>
    Task<bool> CreateChargeAsync(
        string code,
        string name,
        string description,
        ChargeType type,
        Resolution resolution,
        DateTimeOffset validFrom,
        bool vat,
        bool? transparentInvoicing,
        bool? spotDependingPrice,
        CancellationToken ct = default);

    /// <summary>
    /// Update a charge.
    /// </summary>
    Task<bool> UpdateChargeAsync(
        ChargeIdentifierDto id,
        string name,
        string description,
        DateTimeOffset cutoffDate,
        bool vat,
        bool transparentInvoicing,
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
        List<ChargeSeriesPointInput> points,
        CancellationToken ct = default);

    /// <summary>
    /// Query charge link periods.
    /// </summary>
    Task<IEnumerable<ChargeLinkPeriod>> GetChargeLinkPeriodsAsync(
        string meteringPointId,
        CancellationToken ct = default);

    /// <summary>
    /// Get a charge link period by its id.
    /// </summary>
    Task<ChargeLinkPeriod?> GetChargeLinkPeriodByIdAsync(
        ChargeLinkPeriodId id,
        CancellationToken ct = default);

    /// <summary>
    /// Get charge link period changes by charge link period id.
    /// </summary>
    Task<IEnumerable<ChargeLinkPeriodChange>> GetChargeLinkPeriodChangesByIdAsync(
        ChargeLinkPeriodId id,
        CancellationToken ct = default);

    /// <summary>
    /// Creates a charge link.
    /// </summary>
    Task<ChargeLinkPeriod> CreateChargeLinkAsync(
        ChargeIdentifierDto chargeId,
        string meteringPointId,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default);

    /// <summary>
    /// Edits a charge link.
    /// </summary>
    Task<IEnumerable<ChargeLinkPeriod>> EditChargeLinkAsync(
        ChargeLinkPeriodId id,
        DateTimeOffset newStartDate,
        int factor,
        CancellationToken ct = default);

    /// <summary>
    /// Stops a charge link at a given date.
    /// </summary>
    Task<ChargeLinkPeriod> StopChargeLinkAsync(
        ChargeLinkPeriodId id,
        DateTimeOffset stopDate,
        CancellationToken ct = default);

    /// <summary>
    /// Cancels a charge link by its id.
    /// </summary>
    Task<ChargeLinkPeriod> CancelChargeLinkAsync(
        ChargeLinkPeriodId id,
        CancellationToken ct = default);
}
