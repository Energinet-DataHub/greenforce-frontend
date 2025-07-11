﻿// Copyright 2020 Energinet DataHub A/S
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

using Energinet.DataHub.Reports.Abstractions.Model;
using Energinet.DataHub.Reports.Abstractions.Model.SettlementReport;
using Energinet.DataHub.Reports.Client;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports.Client;

public class SettlementReportsClient(ISettlementReportClient client) : ISettlementReportsClient
{
    public async Task<RequestedSettlementReportDto> GetSettlementReportByIdAsync(
        string id,
        CancellationToken ct)
    {
        // Fetch all reports and filter by requestId
        return (await client.GetAsync(ct)).First(r => r.RequestId.Id == id);
    }
}
