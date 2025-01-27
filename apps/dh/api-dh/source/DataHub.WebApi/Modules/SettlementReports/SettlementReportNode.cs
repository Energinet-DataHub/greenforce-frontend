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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Modules.Common.DataLoaders;
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Enums;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Types;
using NodaTime;
using NodaTime.Extensions;
using CalculationType = Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.SettlementReports;

[ObjectType<RequestedSettlementReportDto>]
public static partial class SettlementReportNode
{
    [Query]
    public static async Task<RequestedSettlementReportDto> GetSettlementReportByIdAsync(
        SettlementReportRequestId requestId,
        ISettlementReportsClient client,
        CancellationToken ct) =>
        (await client.GetAsync(ct)).First(r => r.RequestId == requestId);

    [Query]
    public static async Task<IEnumerable<RequestedSettlementReportDto>> GetSettlementReportsAsync(
        ISettlementReportsClient client,
        CancellationToken ct) => await client.GetAsync(ct);

    [Query]
    public static async Task<Dictionary<string, List<SettlementReportApplicableCalculationDto>>>
        GetSettlementReportGridAreaCalculationsForPeriodAsync(
            CalculationType calculationType,
            string[] gridAreaId,
            Interval calculationPeriod,
            IWholesaleClient_V3 client)
    {
        var calculations = await client.GetApplicableCalculationsAsync(
            calculationType.FromBrs_023_027(),
            calculationPeriod.Start.ToDateTimeOffset(),
            calculationPeriod.End.ToDateTimeOffset(),
            gridAreaId);

        return calculations
            .GroupBy(calculation => calculation.GridAreaCode)
            .ToDictionary(group => group.Key, group => group.ToList());
    }

    [Mutation]
    public static async Task<bool> RequestSettlementReportAsync(
        RequestSettlementReportInput requestSettlementReportInput,
        IMarketParticipantClient_V1 marketParticipantClient,
        ISettlementReportsClient client,
        CancellationToken ct)
    {
        var requestAsActor = Guid.TryParse(requestSettlementReportInput.RequestAsActorId, out var actorNumber)
            ? await marketParticipantClient.ActorGetAsync(actorNumber)
            : null;

        var requestFilter = new SettlementReportRequestFilterDto(
            requestSettlementReportInput.GridAreasWithCalculations.ToDictionary(
                x => x.GridAreaCode,
                y => y.CalculationId.HasValue ? new CalculationId(y.CalculationId.Value) : null),
            requestSettlementReportInput.Period.Start.ToDateTimeOffset(),
            requestSettlementReportInput.Period.End.ToDateTimeOffset(),
            requestSettlementReportInput.CalculationType,
            requestSettlementReportInput.EnergySupplier,
            requestSettlementReportInput.CsvLanguage);

        await client.RequestAsync(
            new SettlementReportRequestDto(
                !requestSettlementReportInput.CombineResultInASingleFile,
                requestSettlementReportInput.PreventLargeTextFiles,
                requestSettlementReportInput.IncludeBasisData,
                requestSettlementReportInput.IncludeMonthlySums,
                requestSettlementReportInput.UseApi,
                requestFilter,
                requestAsActor?.ActorNumber.Value,
                requestSettlementReportInput.RequestAsMarketRole),
            ct);

        return true;
    }

    [Mutation]
    public static async Task<bool> CancelSettlementReportAsync(
        SettlementReportRequestId requestId,
        ISettlementReportsClient settlementReportsClient,
        CancellationToken ct)
    {
        await settlementReportsClient.CancelAsync(requestId, ct);
        return true;
    }

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
            new { settlementReportId = r.RequestId.Id, FromApi = r.JobId != null });

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
        descriptor.Field(f => f.JobId != null).Name("fromApi");
        descriptor.Field(f => !f.SplitReportPerGridArea).Name("combineResultInASingleFile");
        descriptor.Field(f => f.IncludeMonthlyAmount);

        // WTF IS THIS???
        descriptor
            .Field("statusMessage")
            .Type<NonNullType<StringType>>()
            .Resolve(_ => string.Empty);
    }
}
