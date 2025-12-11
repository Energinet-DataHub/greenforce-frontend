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

using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestAggregatedMeasureData.V1;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_045.MissingMeasurementsLogOnDemandCalculation.V1.Model;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Common.Exceptions;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Mapper;
using Energinet.DataHub.WebApi.Mapper.AggregatedMeasureData;
using Energinet.DataHub.WebApi.Mapper.MeteringPoint;
using Energinet.DataHub.WebApi.Modules.Processes.MissingMeasurementsLog.Types;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;

public class RequestsClient(
    IHttpContextAccessor httpContextAccessor,
    IMarketParticipantClient_V1 marketParticipant,
    IProcessManagerClient processManager,
    IB2CClient ediClient)
    : IRequestsClient
{
    public async Task<IEnumerable<IActorRequestQueryResult>> GetRequestsAsync(
        CancellationToken ct = default)
    {
        var user = httpContextAccessor.HttpContext?.User;
        ArgumentNullException.ThrowIfNull(user);

        var userIdentity = httpContextAccessor.CreateUserIdentity();

        // Admins are allowed to view all actor requests
        var canViewAllActorRequests = user.HasRole("calculations:manage");

        var customQuery = new ActorRequestQuery(
            userIdentity,
            // TODO: Either make these nullable in the custom query or pass in from the client
            DateTimeOffset.Parse("2024-01-10T11:00:00.0000000+01:00"),
            DateTimeOffset.Parse("2027-01-10T11:00:00.0000000+01:00"),
            createdByActorNumber: canViewAllActorRequests ? null : userIdentity.ActorNumber,
            createdByActorRole: canViewAllActorRequests ? null : userIdentity.ActorRole);

        return await processManager.SearchOrchestrationInstancesByCustomQueryAsync(customQuery, ct);
    }

    public async Task<bool> RequestAsync(
        RequestInput input,
        CancellationToken ct)
    {
        var user = httpContextAccessor.HttpContext?.User;
        ArgumentNullException.ThrowIfNull(user);
        var actor = await marketParticipant.ActorGetAsync(user.GetAssociatedMarketParticipant());
        var eicFunction = actor.MarketRole.EicFunction;
        var actorNumber = actor.ActorNumber.Value;

        if (input.RequestCalculatedWholesaleServices is not null)
        {
            var request = input.RequestCalculatedWholesaleServices;
            var interval = request.Period.ToIntervalOrThrow();
            var requestWholesaleSettlementMarketRequestCommandV1 = new RequestWholesaleSettlementMarketRequestCommandV1(
                new RequestWholesaleSettlementMarketRequestV1(
                    request.CalculationType.SettlementVersion.MapToRequestWholesaleSettlementV1(),
                    request.CalculationType.BusinessReason.MapToRequestWholesaleSettlementV1(),
                    interval.Start.ToDateTimeOffset(),
                    interval.End.ToDateTimeOffset(),
                    request.GridArea,
                    eicFunction == EicFunction.EnergySupplier ? actorNumber : null,
                    request.PriceType.Resolution.MapToRequestWholesaleSettlementV1(),
                    request.PriceType.ChargeType.MapToRequestWholesaleSettlementV1()));

            var response = await ediClient.SendAsync(requestWholesaleSettlementMarketRequestCommandV1, ct);

            if (!response.IsSuccess)
            {
                throw new B2CApiException("RequestWholesaleSettlementMarketRequest failed", response.Data?.MessageBody);
            }

            return true;
        }

        if (input.RequestCalculatedEnergyTimeSeries is not null)
        {
            var request = input.RequestCalculatedEnergyTimeSeries;
            var interval = request.Period.ToIntervalOrThrow();

            var requestAggregatedMeasureDataMarketRequestV1 = new RequestAggregatedMeasureDataMarketRequestV1(
                request.CalculationType.BusinessReason.MapToRequestAggregatedMeasureDataV1(),
                request.CalculationType.SettlementVersion.MapToRequestAggregatedMeasureDataV1(),
                request.MeteringPointType?.SettlementMethod.MapToRequestAggregatedMeasureDataV1(),
                request.MeteringPointType?.EvaluationPoint.MapToRequestAggregatedMeasureDataV1(),
                interval.Start.ToDateTimeOffset(),
                interval.End.ToDateTimeOffset(),
                request.GridArea,
                eicFunction == EicFunction.EnergySupplier ? actorNumber : null,
                eicFunction == EicFunction.BalanceResponsibleParty ? actorNumber : null);

            var aggregatedMeasureDataMarketRequestCommandV1 =
                new RequestAggregatedMeasureDataMarketRequestCommandV1(requestAggregatedMeasureDataMarketRequestV1);

            var response = await ediClient.SendAsync(aggregatedMeasureDataMarketRequestCommandV1, ct);
            if (!response.IsSuccess)
            {
                throw new B2CApiException($"{nameof(RequestAggregatedMeasureDataMarketRequestV1)} failed", response.Data?.MessageBody);
            }
        }

        return false;
    }

    public async Task<bool> RequestMissingMeasurementsLogAsync(
        RequestMissingMeasurementsLogInput input,
        CancellationToken ct = default)
    {
        if (input is not null)
        {
            var userIdentity = httpContextAccessor.CreateUserIdentity();
            await processManager.StartNewOrchestrationInstanceAsync(
                new StartMissingMeasurementsLogOnDemandCalculationCommandV1(
                    userIdentity,
                    new(
                        input.Period.Start.ToDateTimeOffset(),
                        input.Period.End.ToDateTimeOffset(),
                        input.GridAreaCodes)),
                CancellationToken.None);

            return true;
        }

        return false;
    }
}
