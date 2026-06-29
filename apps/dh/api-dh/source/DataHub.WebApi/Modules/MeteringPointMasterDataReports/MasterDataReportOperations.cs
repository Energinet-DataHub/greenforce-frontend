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

using Energinet.DataHub.Reports.Abstractions.Model.MeteringPointMasterData;
using Energinet.DataHub.Reports.Client;
using Energinet.DataHub.WebApi.Modules.MeteringPointMasterDataReports.Types;

namespace Energinet.DataHub.WebApi.Modules.MeteringPointMasterDataReports;

public static class MeteringPointMasterDataReportOperations
{
    [Mutation]
    public static async Task<bool> RequestMasterDataReportAsync(
        RequestMasterDataReportInput input,
        IMeteringPointMasterDataReportClient client,
        CancellationToken ct)
    {
        var filter = new MeteringPointMasterDataReportRequestFilterDto(
            input.Date,
            input.GridAreaIds,
            input.MeteringPointTypes,
            input.ConnectionStates);

        await client.RequestAsync(
            new MeteringPointMasterDataReportRequestDto(
                filter,
                null,
                null,
                null),
            ct);

        return true;
    }
}
