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

using System.Security.Claims;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;
using NodaTime;
using CalculationType = Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums.CalculationType;
using MeteringPointType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests;

public static class RequestOperations
{
    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<IOrchestrationInstance<IRequest>>> GetRequestsAsync()
    {
        var result = new OrchestrationInstanceTypedDto<RequestAggregatedMeasureData>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("5ff81160-507e-41e5-4846-08dc53cca56b"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Terminated,
                OrchestrationInstanceTerminationStates.Succeeded,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            [],
            string.Empty,
            new RequestAggregatedMeasureData(
                CalculationType.Aggregation,
                new Interval(
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-02-01")),
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-02-29"))),
                null,
                null,
                null,
                MeteringPointType.Production));

        var result2 = new OrchestrationInstanceTypedDto<RequestAggregatedMeasureData>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("0aa6f1d2-6294-45d5-2dcc-08dc11e27f05"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Terminated,
                OrchestrationInstanceTerminationStates.Failed,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            [],
            string.Empty,
            new RequestAggregatedMeasureData(
                CalculationType.Aggregation,
                new Interval(
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-01-14")),
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-01-15"))),
                null,
                null,
                null,
                MeteringPointType.NonProfiledConsumption));

        var result3 = new OrchestrationInstanceTypedDto<RequestWholesaleSettlement>(
            Guid.NewGuid(),
            new OrchestrationInstanceLifecycleStateDto(
                new UserIdentityDto(new Guid("0aa6f1d2-6294-45d5-2dcc-08dc11e27f05"), Guid.NewGuid()),
                OrchestrationInstanceLifecycleStates.Running,
                null,
                null,
                DateTimeOffset.Parse("2024-10-25").AddHours(10),
                null,
                null,
                null,
                null),
            [],
            string.Empty,
            new RequestWholesaleSettlement(
                CalculationType.BalanceFixing,
                new Interval(
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-01-14")),
                    Instant.FromDateTimeOffset(DateTimeOffset.Parse("2024-01-15"))),
                null,
                null,
                PriceType.MonthlyFee));

        var wrapper = new OrchestrationInstance<RequestAggregatedMeasureData>(
            result.Id,
            result.Lifecycle,
            result.Steps,
            result.ParameterValue);

        var wrapper2 = new OrchestrationInstance<RequestAggregatedMeasureData>(
            result2.Id,
            result2.Lifecycle,
            result2.Steps,
            result2.ParameterValue);

        var wrapper3 = new OrchestrationInstance<RequestWholesaleSettlement>(
            result3.Id,
            result3.Lifecycle,
            result3.Steps,
            result3.ParameterValue);

        var list = new List<IOrchestrationInstance<IRequest>> { wrapper, wrapper2, wrapper3 };

        return await Task.FromResult(list);
    }

    [Query]
    public static async Task<RequestOptions> GetRequestOptionsAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IMarketParticipantClient_V1 marketParticipantClient)
    {
        // TODO: Create common functionality for this use case
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        var selectedActor = await marketParticipantClient.ActorGetAsync(associatedActor);
        return new RequestOptions(user, selectedActor.MarketRole.EicFunction);
    }

    public class RequestOptions(ClaimsPrincipal user, EicFunction marketRole)
    {
        public IEnumerable<Option<CalculationType>> GetCalculationTypes()
        {
            var calculationTypes = new List<Option<CalculationType>>();

            if (user.HasRole("request-aggregated-measured-data:view"))
            {
                calculationTypes.Add(new Option<CalculationType>(CalculationType.Aggregation));
                calculationTypes.Add(new Option<CalculationType>(CalculationType.BalanceFixing));
            }

            if (user.HasRole("request-wholesale-settlement:view"))
            {
                calculationTypes.Add(new Option<CalculationType>(CalculationType.WholesaleFixing));
                calculationTypes.Add(new Option<CalculationType>(CalculationType.FirstCorrectionSettlement));
                calculationTypes.Add(new Option<CalculationType>(CalculationType.SecondCorrectionSettlement));
                calculationTypes.Add(new Option<CalculationType>(CalculationType.ThirdCorrectionSettlement));
            }

            return calculationTypes;
        }

        public IEnumerable<Option<MeteringPointType>> GetMeteringPointTypes()
        {
            var meteringPointTypes = new List<Option<MeteringPointType>>
            {
                new Option<MeteringPointType>(MeteringPointType.FlexConsumption),
                new Option<MeteringPointType>(MeteringPointType.NonProfiledConsumption),
                new Option<MeteringPointType>(MeteringPointType.Production),
            };

            if (marketRole != EicFunction.BalanceResponsibleParty && marketRole != EicFunction.EnergySupplier)
            {
                meteringPointTypes.Add(new Option<MeteringPointType>(MeteringPointType.Exchange));
                meteringPointTypes.Add(new Option<MeteringPointType>(MeteringPointType.TotalConsumption));
            }

            return meteringPointTypes;
        }

        public bool GetIsGridAreaRequired() => marketRole == EicFunction.GridAccessProvider;
    }

    [OneOf]
    public record RequestInput(
        RequestAggregatedMeasureData? RequestAggregatedMeasureData,
        RequestWholesaleSettlement? RequestWholesaleSettlement);

    [Mutation]
    public static async Task<bool> RequestAsync(
        RequestInput input,
        [Service] IEdiB2CWebAppClient_V1 client,
        [Service] IMarketParticipantClient_V1 marketParticipantClient,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken ct)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        var selectedActor = await marketParticipantClient.ActorGetAsync(associatedActor);
        var eicFunction = selectedActor.MarketRole.EicFunction;
        var actorNumber = selectedActor.ActorNumber.Value;

        if (input.RequestAggregatedMeasureData is not null)
        {
            var i = input.RequestAggregatedMeasureData;
            var body = eicFunction switch
            {
                EicFunction.BalanceResponsibleParty => i with { BalanceResponsibleId = actorNumber },
                EicFunction.EnergySupplier => i with { EnergySupplierId = actorNumber },
                _ => i,
            };

            await client.RequestAggregatedMeasureDataAsync("1.0", body.ToMarketRequest(), ct);
            return true;
        }

        if (input.RequestWholesaleSettlement is not null)
        {
            var i = input.RequestWholesaleSettlement;
            var body = eicFunction == EicFunction.EnergySupplier
                ? i with { EnergySupplierId = actorNumber }
                : i;

            await client.RequestWholesaleSettlementAsync("1.0", body.ToMarketRequest(), ct);
            return true;
        }

        return false;
    }
}
