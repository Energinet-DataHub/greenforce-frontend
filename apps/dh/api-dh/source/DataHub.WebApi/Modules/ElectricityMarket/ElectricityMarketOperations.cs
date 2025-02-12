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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Attribute;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Types;
using HotChocolate.Authorization;
using MarketParticipantClient = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static class ElectricityMarketOperations
{
    [Query]
    [Authorize(Policy = "fas")]
    [PreserveParentAs("meteringPoint")]
    public static async Task<MeteringPointDto> GetMeteringPointWithHistoryAsync(
        string? filter,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return null!;
        }

        try
        {
            return await electricityMarketClient.ElectricityMarketAsync(filter, ct).ConfigureAwait(false);
        }
        catch (ApiException e) when (e.Message.Contains("does not exists"))
        {
            return null!;
        }
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<string> GetMeteringPointContactCprAsync(
        long contactId,
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IElectricityMarketClient_V1 electricityMarketClient,
        [Service] MarketParticipantClient.IMarketParticipantClient_V1 marketParticipantClient)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var currentActorId = httpContextAccessor.HttpContext?.User.GetAssociatedActor()
                       ?? throw new UnauthorizedAccessException("Current user's actor could not be determined.");

        var currentActor = await marketParticipantClient
            .ActorGetAsync(currentActorId)
            .ConfigureAwait(false);

        var request = new ContactCprRequestDto
        {
            ActorGln = currentActor.ActorNumber.Value,
            MarketRole = FromMarketPartEicFunctionToElectricityMarketEicFunction(currentActor.MarketRole.EicFunction),
        };

        return await electricityMarketClient.MeteringPointContactCprAsync(contactId, request, ct).ConfigureAwait(false);
    }

    [Query]
    [Authorize(Policy = "fas")]
    public static async Task<MeteringPointDetails> GetMeteringPointAsync(
        string meteringPointId,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        var result = await electricityMarketClient.ElectricityMarketAsync(meteringPointId, ct).ConfigureAwait(false);

        return new MeteringPointDetails(
            meteringPointId,
            result.CurrentCommercialRelation,
            result.CurrentMeteringPointPeriod);
    }

    private static EicFunction FromMarketPartEicFunctionToElectricityMarketEicFunction(
        MarketParticipantClient.EicFunction eicFunction) =>
        eicFunction switch
        {
            MarketParticipantClient.EicFunction.BalanceResponsibleParty => EicFunction.BalanceResponsibleParty,
            MarketParticipantClient.EicFunction.BillingAgent => EicFunction.BillingAgent,
            MarketParticipantClient.EicFunction.DanishEnergyAgency => EicFunction.DanishEnergyAgency,
            MarketParticipantClient.EicFunction.DataHubAdministrator => EicFunction.DataHubAdministrator,
            MarketParticipantClient.EicFunction.Delegated => EicFunction.Delegated,
            MarketParticipantClient.EicFunction.EnergySupplier => EicFunction.EnergySupplier,
            MarketParticipantClient.EicFunction.GridAccessProvider => EicFunction.GridAccessProvider,
            MarketParticipantClient.EicFunction.ImbalanceSettlementResponsible => EicFunction.ImbalanceSettlementResponsible,
            MarketParticipantClient.EicFunction.IndependentAggregator => EicFunction.IndependentAggregator,
            MarketParticipantClient.EicFunction.ItSupplier => EicFunction.ItSupplier,
            MarketParticipantClient.EicFunction.MeteredDataAdministrator => EicFunction.MeteredDataAdministrator,
            MarketParticipantClient.EicFunction.MeteredDataResponsible => EicFunction.MeteredDataResponsible,
            _ => throw new ArgumentOutOfRangeException(nameof(eicFunction), eicFunction, null),
        };
}
