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

using Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports.Dto;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports;

/// <summary>
/// Interface of client for working with the measurements reports.
/// </summary>
public interface IMeasurementsReportsClient
{
    /// <summary>
    /// Requests generation of a new measurements report.
    /// </summary>
    public Task RequestAsync(MeasurementsReportRequestDto requestDto, CancellationToken cancellationToken);

    /// <summary>
    /// Gets a list of all measurements reports visible to the current user.
    /// </summary>
    /// <returns>A list of measurements reports.</returns>
    public Task<IEnumerable<RequestedMeasurementsReportDto>> GetAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Downloads the measurements report with the specified id.
    /// </summary>
    /// <returns>The stream to the report.</returns>
    public Task<Stream> DownloadAsync(MeasurementsReportRequestId requestId, CancellationToken cancellationToken);

    /// <summary>
    /// Cancels the measurements report with the specified id.
    /// </summary>
    public Task CancelAsync(MeasurementsReportRequestId requestId, CancellationToken cancellationToken);
}
