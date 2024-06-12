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

using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;

/// <summary>
/// Interface of client for working with the settlement reports.
/// </summary>
public interface ISettlementReportsClient
{
    /// <summary>
    /// Requests generation of a new settlement report.
    /// </summary>
    public Task RequestAsync(SettlementReportRequestDto requestDto, CancellationToken cancellationToken);

    /// <summary>
    /// Gets a list of all settlement reports visible to the current user.
    /// </summary>
    /// <returns>A list of settlement reports.</returns>
    public Task<IEnumerable<RequestedSettlementReportDto>> GetAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Downloads the settlement report with the specified id.
    /// </summary>
    /// <returns>The stream to the report.</returns>
    public Task<Stream> DownloadAsync(SettlementReportRequestId requestId, CancellationToken cancellationToken);
}
