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
using Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<bool> RequestSettlementReportAsync(
        RequestSettlementReportInput requestSettlementReportInput,
        [Service] IMarketParticipantClient_V1 marketPartClient,
        [Service] ISettlementReportsClient client)
    {
        var requestAsActor = Guid.TryParse(requestSettlementReportInput.RequestAsActorId, out var actorNumber)
            ? await marketPartClient.ActorGetAsync(actorNumber)
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
            default);

        return true;
    }

    public async Task<bool> CancelSettlementReportAsync(
        SettlementReportRequestId requestId,
        [Service] ISettlementReportsClient settlementReportsClient)
    {
        await settlementReportsClient.CancelAsync(requestId, default);

        return true;
    }
}
