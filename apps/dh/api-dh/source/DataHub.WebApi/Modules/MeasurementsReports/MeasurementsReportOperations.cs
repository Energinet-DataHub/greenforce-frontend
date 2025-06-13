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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports.Dto;
using Energinet.DataHub.WebApi.Modules.MeasurementsReports.Types;

namespace Energinet.DataHub.WebApi.Modules.MeasurementsReports;

public static class MeasurementsReportOperations
{
    [Query]
    public static async Task<IEnumerable<RequestedMeasurementsReportDto>> GetMeasurementsReportsAsync(
        IMeasurementsReportsClient client,
        CancellationToken ct) => await client.GetAsync(ct);

    [Mutation]
    public static async Task<bool> RequestMeasurementsReportAsync(
        RequestMeasurementsReportInput requestMeasurementsReportInput,
        IMarketParticipantClient_V1 marketParticipantClient,
        IMeasurementsReportsClient client,
        CancellationToken ct)
    {
        var requestAsActor = Guid.TryParse(requestMeasurementsReportInput.RequestAsActorId, out var actorNumber)
            ? await marketParticipantClient.ActorGetAsync(actorNumber)
            : null;

        var requestFilter = new MeasurementsReportRequestFilterDto(
            requestMeasurementsReportInput.GridAreaCodes,
            requestMeasurementsReportInput.Period.Start.ToDateTimeOffset(),
            requestMeasurementsReportInput.Period.End.ToDateTimeOffset());

        await client.RequestAsync(
            new MeasurementsReportRequestDto(
                requestFilter,
                requestAsActor?.ActorNumber.Value,
                requestMeasurementsReportInput.RequestAsMarketRole),
            ct);

        return true;
    }

    [Mutation]
    public static async Task<bool> CancelMeasurementsReportAsync(
        MeasurementsReportRequestId requestId,
        IMeasurementsReportsClient measurementsReportsClient,
        CancellationToken ct)
    {
        await measurementsReportsClient.CancelAsync(requestId, ct);
        return true;
    }
}
