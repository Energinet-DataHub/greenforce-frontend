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

using Energinet.DataHub.Reports.Abstractions.Model;
using Energinet.DataHub.Reports.Abstractions.Model.MeasurementsReport;
using Energinet.DataHub.Reports.Client;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MeasurementsReports.Types;

namespace Energinet.DataHub.WebApi.Modules.MeasurementsReports;

public static class MeasurementsReportOperations
{
    [Query]
    public static async Task<IEnumerable<RequestedMeasurementsReportDto>> GetMeasurementsReportsAsync(
        IMeasurementsReportClient client,
        CancellationToken ct) => await client.GetAsync(ct);

    [Mutation]
    public static async Task<bool> RequestMeasurementsReportAsync(
        RequestMeasurementsReportInput requestMeasurementsReportInput,
        IMarketParticipantClient_V1 marketParticipantClient,
        IMeasurementsReportClient client,
        CancellationToken ct)
    {
        if (requestMeasurementsReportInput.RequestAsMarketRole is null)
        {
            throw new ArgumentException("Invalid market role for measurements report request.", nameof(requestMeasurementsReportInput.RequestAsMarketRole));
        }

        var requestAsActor = Guid.TryParse(requestMeasurementsReportInput.RequestAsActorId, out var actorNumber)
            ? await marketParticipantClient.ActorGetAsync(actorNumber)
            : null;

        var requestFilter = new MeasurementsReportRequestFilterDto(
            requestMeasurementsReportInput.GridAreaCodes,
            requestMeasurementsReportInput.MeteringPointTypes,
            requestMeasurementsReportInput.Period.Start.ToDateTimeOffset(),
            requestMeasurementsReportInput.Period.End.ToDateTimeOffset(),
            requestMeasurementsReportInput.EnergySupplier);

        var requestAs = requestAsActor is not null
            ? new MeasurementsReportRequestMultitenancyDto(
                requestAsActor.ActorNumber.Value,
                requestMeasurementsReportInput.RequestAsMarketRole.Value)
            : null;

        await client.RequestAsync(
            new MeasurementsReportRequestDto(
                requestFilter,
                requestMeasurementsReportInput.Resolution,
                requestAs),
            ct);

        return true;
    }

    [Mutation]
    public static async Task<bool> CancelMeasurementsReportAsync(
        ReportRequestId requestId,
        IMeasurementsReportClient measurementsReportsClient,
        CancellationToken ct)
    {
        await measurementsReportsClient.CancelAsync(requestId, ct);
        return true;
    }
}
