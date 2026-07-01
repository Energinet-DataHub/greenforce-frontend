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

using Energinet.DataHub.Reports.Client;
using Energinet.DataHub.WebApi.Modules.Reports.Models;
using Energinet.DataHub.WebApi.Modules.Reports.Types;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Reports;

public static class ReportOperations
{
    [Query]
    [Authorize(Roles = ["metering-point-master-data-reports:manage"])]
    public static async Task<IEnumerable<ReportDto>> GetReportsAsync(
        IMeteringPointMasterDataReportClient client,
        CancellationToken ct)
    {
        var masterDataReports = await client.GetAsync(ct).ConfigureAwait(false);

        return masterDataReports.Select(r => new ReportDto
        {
            Id = r.RequestId.Id,
            CreatedDateTime = r.CreatedDateTime,
            ReportType = RequestedReportType.MasterData,
            MeteringPointTypes = r.MeteringPointTypes,
            GridAreaCodes = r.GridAreaIds,
            Status = r.Status,
        });
    }
}
