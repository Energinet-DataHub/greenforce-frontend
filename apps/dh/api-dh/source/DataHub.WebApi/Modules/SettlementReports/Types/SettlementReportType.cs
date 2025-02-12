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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Modules.Common.DataLoaders;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Enums;
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports.Types;

[ObjectType<RequestedSettlementReportDto>]
public static partial class SettlementReportType
{
    public static Interval Period([Parent] RequestedSettlementReportDto r) =>
        new Interval(r.PeriodStart.ToInstant(), r.PeriodEnd.ToInstant());

    public static SettlementReportStatusType StatusType([Parent] RequestedSettlementReportDto r) =>
        r.Status switch
        {
            SettlementReportStatus.InProgress => SettlementReportStatusType.InProgress,
            SettlementReportStatus.Completed => SettlementReportStatusType.Completed,
            SettlementReportStatus.Failed => SettlementReportStatusType.Error,
            SettlementReportStatus.Canceled => SettlementReportStatusType.Canceled,
            _ => SettlementReportStatusType.Error,
        };

    public static Interval ExecutionTime([Parent] RequestedSettlementReportDto r) =>
        new Interval(r.CreatedDateTime.ToInstant(), r.EndedDateTime?.ToInstant());

    public static string[] GridAreas([Parent] RequestedSettlementReportDto r) =>
        r.GridAreas.Select(ga => ga.Key).ToArray();

    public static string? SettlementReportDownloadUrl(
        [Parent] RequestedSettlementReportDto r,
        [Service] LinkGenerator linkGenerator,
        IHttpContextAccessor httpContextAccessor) => linkGenerator.GetUriByAction(
            httpContextAccessor.HttpContext!,
            "DownloadReport",
            "WholesaleSettlementReport",
            new { settlementReportId = r.RequestId.Id });

    public static async Task<ActorDto?> ActorAsync(
        [Parent] RequestedSettlementReportDto r,
        ActorByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(r.RequestedByActorId);

    static partial void Configure(
        IObjectTypeDescriptor<RequestedSettlementReportDto> descriptor)
    {
        descriptor
            .Name("SettlementReport")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.RequestId.Id).Name("id");
        descriptor.Field(f => f.RequestedByActorId);
        descriptor.Field(f => f.CalculationType);
        descriptor.Field(f => f.GridAreaCount).Name("numberOfGridAreasInReport");
        descriptor.Field(f => f.ContainsBasisData).Name("includesBasisData");
        descriptor.Field(f => f.Progress);
        descriptor.Field(f => !f.SplitReportPerGridArea).Name("combineResultInASingleFile");
        descriptor.Field(f => f.IncludeMonthlyAmount);
    }
}
