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
using Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports.Dto;
using Energinet.DataHub.WebApi.Modules.Common.DataLoaders;
using Energinet.DataHub.WebApi.Modules.MeasurementsReports.Enums;
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.MeasurementsReports.Types;

[ObjectType<RequestedMeasurementsReportDto>]
public static partial class MeasurementsReportType
{
    public static Interval Period([Parent] RequestedMeasurementsReportDto r) =>
        new Interval(r.PeriodStart.ToInstant(), r.PeriodEnd.ToInstant());

    public static MeasurementsReportStatusType StatusType([Parent] RequestedMeasurementsReportDto r) =>
        r.Status switch
        {
            MeasurementsReportStatus.InProgress => MeasurementsReportStatusType.InProgress,
            MeasurementsReportStatus.Completed => MeasurementsReportStatusType.Completed,
            MeasurementsReportStatus.Failed => MeasurementsReportStatusType.Error,
            MeasurementsReportStatus.Canceled => MeasurementsReportStatusType.Canceled,
            _ => MeasurementsReportStatusType.Error,
        };

    public static string? MeasurementsReportDownloadUrl(
        [Parent] RequestedMeasurementsReportDto r,
        [Service] LinkGenerator linkGenerator,
        IHttpContextAccessor httpContextAccessor) => linkGenerator.GetUriByAction(
            httpContextAccessor.HttpContext!,
            "DownloadReport",
            "WholesaleMeasurementsReport",
            new { measurementsReportId = r.RequestId.Id });

    public static async Task<ActorDto?> ActorAsync(
        [Parent] RequestedMeasurementsReportDto r,
        ActorByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(r.RequestedByActorId);

    static partial void Configure(
        IObjectTypeDescriptor<RequestedMeasurementsReportDto> descriptor)
    {
        descriptor
            .Name("MeasurementsReport")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.RequestId.Id).Name("id");
        descriptor.Field(f => f.RequestedByActorId);
        descriptor.Field(f => f.GridAreaCodes);
        descriptor.Field(f => f.CreatedDateTime);
    }
}
