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

using Energinet.DataHub.Reports.Abstractions.Model.SettlementReport;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Models;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports.Client;

/// <summary>
/// Client for interacting with settlement reports.
/// </summary>
public interface ISettlementReportsClient
{
    /// <summary>
    /// Retrieves a settlement report by its request ID.
    /// </summary>
    Task<RequestedSettlementReportDto> GetSettlementReportByIdAsync(
        string id,
        CancellationToken ct);

    /// <summary>
    /// Retrieves all settlement reports.
    /// </summary>
    Task<IEnumerable<RequestedSettlementReportDto>> GetSettlementReportsAsync(
        CancellationToken ct);

    /// <summary>
    /// Retrieves settlement report grid area calculations for a given period.
    /// </summary>
    Task<Dictionary<string, List<SettlementReportApplicableCalculation>>?>
        GetSettlementReportGridAreaCalculationsForPeriodAsync(
            CalculationType calculationType,
            string[] gridAreaId,
            Interval calculationPeriod);

    /// <summary>
    /// Requests a settlement report.
    /// </summary>
    Task<bool> RequestSettlementReportAsync(
        RequestSettlementReportInput input,
        CancellationToken ct);

    /// <summary>
    /// Cancels a settlement report.
    /// </summary>
    Task<bool> CancelSettlementReportAsync(
        string id,
        CancellationToken ct);
}
