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

using System.Text.Json;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoints.GetMeteringPointTypes.V1;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Models;
using Microsoft.FeatureManagement;
using ApiException = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.ApiException;
using EicFunction = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.EicFunction;
using MeteringPointDto = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.MeteringPointDto;
using MeteringPointType = Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1.MeteringPointType;
using SharedMeteringPointType = Energinet.DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;

public static class MarketParticipantOperations
{
    [Query]
    public static Task<ActorDto> GetSelectedMarketParticipantAsync(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IMarketParticipantClient_V1 client)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var associatedMarketParticipant = user?.GetAssociatedMarketParticipant()
            ?? throw new InvalidOperationException("No associated actor found.");

        return client.ActorGetAsync(associatedMarketParticipant);
    }

    [Query]
    public static async Task<ActorDto> GetMarketParticipantByIdAsync(
        Guid id,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorGetAsync(id, ct);

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetMarketParticipantsAsync(
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorGetAsync(ct);

    [Query]
    [UsePaging(MaxPageSize = 10_000)]
    [UseSorting]
    public static async Task<IEnumerable<ActorDto>> GetPaginatedMarketParticipantsAsync(
        MarketParticipantStatus[]? statuses,
        EicFunction[]? eicFunctions,
        string? filter,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var marketParticipants = await client.ActorGetAsync(ct);

        return marketParticipants
            .Where(x => statuses == null || statuses.Contains(x.GetStatus()))
            .Where(x => eicFunctions == null || eicFunctions.Contains(x.MarketRole.EicFunction))
            .Where(x => string.IsNullOrWhiteSpace(filter) ||
                x.Name.Value.Contains(filter, StringComparison.OrdinalIgnoreCase) ||
                x.ActorNumber.Value.Contains(filter, StringComparison.OrdinalIgnoreCase));
    }

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetMarketParticipantsByOrganizationIdAsync(
        Guid organizationId,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationActorAsync(organizationId, ct);

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetMarketParticipantsForEicFunctionAsync(
        EicFunction[]? eicFunctions,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorGetAsync(ct))
            .Where(x => eicFunctions != null && eicFunctions.Contains(x.MarketRole.EicFunction));

    [Query]
    public static async Task<AssociatedMarketParticipants> GetAssociatedMarketParticipantsAsync(
        string email,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var user = (await client.UserOverviewUsersSearchAsync(
                1,
                int.MaxValue,
                UserOverviewSortProperty.Email,
                SortDirection.Asc,
                new UserOverviewFilterDto
                {
                    SearchText = email,
                    UserStatus = [],
                    UserRoleIds = [],
                },
                ct).ConfigureAwait(false)).Users
            .FirstOrDefault(x => string.Equals(email, x.Email, StringComparison.OrdinalIgnoreCase));

        if (user is null)
        {
            return new AssociatedMarketParticipants(email, Enumerable.Empty<Guid>());
        }

        var associatedMarketParticipants = await client.UserActorsGetAsync(user.Id);

        return new AssociatedMarketParticipants(email, associatedMarketParticipants.ActorIds);
    }

    [Query]
    public static async Task<IEnumerable<ActorDto>> FilteredMarketParticipantsAsync(
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContext,
        [Service] IMarketParticipantClient_V1 client)
    {
        if (httpContext.HttpContext == null)
        {
            return Enumerable.Empty<ActorDto>();
        }

        var marketParticipants = await client.ActorGetAsync(ct);

        if (httpContext.HttpContext.User.IsFas())
        {
            return marketParticipants;
        }

        var marketParticipantId = httpContext.HttpContext.User.GetAssociatedMarketParticipant();
        return marketParticipants.Where(actor => actor.ActorId == marketParticipantId);
    }

    [Query]
    public static async Task<IEnumerable<SelectionActorDto>> GetSelectionMarketParticipantsAsync(
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.QuerySelectionActorsAsync(ct);

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> UpdateMarketParticipantAsync(
        Guid marketParticipantId,
        string marketParticipantName,
        string departmentName,
        string departmentEmail,
        string departmentPhone,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var marketParticipant = await client.ActorGetAsync(marketParticipantId, ct).ConfigureAwait(false);
        if (!string.Equals(marketParticipant.Name.Value, marketParticipantName, StringComparison.Ordinal))
        {
            await client.ActorNameAsync(marketParticipantId, new ActorNameDto { Value = marketParticipantName }).ConfigureAwait(false);
        }

        var allContacts = await client.ActorContactGetAsync(marketParticipantId, ct).ConfigureAwait(false);
        var defaultContact = allContacts.SingleOrDefault(c => c.Category == ContactCategory.Default);
        if (defaultContact == null ||
            !string.Equals(defaultContact.Name, departmentName, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Email, departmentEmail, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Phone, departmentPhone, StringComparison.Ordinal))
        {
            if (defaultContact != null)
            {
                await client
                    .ActorContactDeleteAsync(marketParticipantId, defaultContact.ContactId, ct)
                    .ConfigureAwait(false);
            }

            var newDefaultContact = new CreateActorContactDto
            {
                Name = departmentName,
                Email = departmentEmail,
                Phone = departmentPhone,
                Category = ContactCategory.Default,
            };

            await client
                .ActorContactPostAsync(marketParticipantId, newDefaultContact, ct)
                .ConfigureAwait(false);
        }

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> CreateMarketParticipantAsync(
        CreateMarketParticipant input,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var organizationId =
            input.OrganizationId ??
            await client.OrganizationPostAsync(input.Organization!, ct).ConfigureAwait(false);

        var actorDto = new CreateActorDto()
        {
            Name = input.MarketParticipant.Name,
            ActorNumber = input.MarketParticipant.ActorNumber,
            OrganizationId = organizationId,
            MarketRole = new ActorMarketRoleDto
            {
                EicFunction = input.MarketParticipant.MarketRole.EicFunction,
                Comment = input.MarketParticipant.MarketRole.Comment,
                GridAreas = input.MarketParticipant.MarketRole.GridAreas.Select(ga => new ActorGridAreaDto()
                {
                    MeteringPointTypes = ga.MeteringPointTypes,
                    Id = ga.Id,
                }).ToList(),
            },
        };

        var actorId = await client
            .ActorPostAsync(actorDto, ct)
            .ConfigureAwait(false);

        await client
            .ActorContactPostAsync(actorId, input.ActorContact, ct)
            .ConfigureAwait(false);

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> CreateDelegationsForMarketParticipantAsync(
        CreateProcessDelegationsInput delegations,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.ActorDelegationsPostAsync(
            new CreateProcessDelegationsDto
            {
                DelegatedFrom = delegations.DelegatedFrom,
                DelegatedTo = delegations.DelegatedTo,
                GridAreas = delegations.GridAreaIds.ToList(),
                DelegatedProcesses = delegations.DelegatedProcesses.ToList(),
                StartsAt = delegations.StartsAt,
            },
            ct);
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> StopDelegationAsync(
        IEnumerable<StopDelegationPeriodInput> stopDelegationPeriods,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        foreach (var stopDelegationPeriod in stopDelegationPeriods)
        {
            await client.ActorDelegationsPutAsync(stopDelegationPeriod.DelegationId, stopDelegationPeriod.StopPeriod, ct);
        }

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<ActorClientSecretDto> RequestClientSecretCredentialsAsync(
        Guid marketParticipantId,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorCredentialsSecretAsync(marketParticipantId, ct);

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> AddMeteringPointsToAdditionalRecipientAsync(
        Guid marketParticipantId,
        IReadOnlyCollection<string> meteringPointIds,
        [Service] IMarketParticipantClient_V1 marketParticipantClient,
        [Service] IElectricityMarketClient_V1 em1Client,
        [Service] IElectricityMarketClient em2Client,
        [Service] IFeatureManager featureManager,
        CancellationToken ct)
    {
        var isNewMeteringPointsModelEnabled = await featureManager.IsEnabledAsync("PM120-DH3-METERING-POINTS-UI");

        IReadOnlyCollection<MeteringPointTypeDtoV1> meteringPointsWithType;

        if (isNewMeteringPointsModelEnabled)
        {
            var result = await em2Client
                .SendAsync(new GetMeteringPointTypesQueryV1(meteringPointIds.ToList()), ct)
                .ConfigureAwait(false);

            if (!result.IsSuccess || result.Data is null)
            {
                throw new InvalidOperationException(
                    $"GetMeteringPointTypesQueryV1 failed: {result.DiagnosticMessage}");
            }

            meteringPointsWithType = result.Data.MeteringPointTypes;
        }
        else
        {
            var em1Result = await em1Client
                .MeteringPointQueryTypeAsync(meteringPointIds, ct)
                .ConfigureAwait(false);

            meteringPointsWithType = em1Result.Select(dto =>
            {
                var mappedType = dto.Type switch
                {
                    MeteringPointType.Consumption => SharedMeteringPointType.Consumption,
                    MeteringPointType.Production => SharedMeteringPointType.Production,
                    MeteringPointType.Exchange => SharedMeteringPointType.Exchange,
                    MeteringPointType.VEProduction => SharedMeteringPointType.VEProduction,
                    MeteringPointType.Analysis => SharedMeteringPointType.Analysis,
                    MeteringPointType.NotUsed => SharedMeteringPointType.NotUsed,
                    MeteringPointType.SurplusProductionGroup6 => SharedMeteringPointType.SurplusProductionGroup6,
                    MeteringPointType.NetProduction => SharedMeteringPointType.NetProduction,
                    MeteringPointType.SupplyToGrid => SharedMeteringPointType.SupplyToGrid,
                    MeteringPointType.ConsumptionFromGrid => SharedMeteringPointType.ConsumptionFromGrid,
                    MeteringPointType.WholesaleServicesOrInformation => SharedMeteringPointType.WholesaleServicesOrInformation,
                    MeteringPointType.OwnProduction => SharedMeteringPointType.OwnProduction,
                    MeteringPointType.NetFromGrid => SharedMeteringPointType.NetFromGrid,
                    MeteringPointType.NetToGrid => SharedMeteringPointType.NetToGrid,
                    MeteringPointType.TotalConsumption => SharedMeteringPointType.TotalConsumption,
                    MeteringPointType.NetLossCorrection => SharedMeteringPointType.NetLossCorrection,
                    MeteringPointType.ElectricalHeating => SharedMeteringPointType.ElectricalHeating,
                    MeteringPointType.NetConsumption => SharedMeteringPointType.NetConsumption,
                    MeteringPointType.OtherConsumption => SharedMeteringPointType.OtherConsumption,
                    MeteringPointType.OtherProduction => SharedMeteringPointType.OtherProduction,
                    MeteringPointType.ExchangeReactiveEnergy => SharedMeteringPointType.ExchangeReactiveEnergy,
                    MeteringPointType.InternalUse => SharedMeteringPointType.InternalUse,
                    _ => SharedMeteringPointType.Unknown,
                };

                return new MeteringPointTypeDtoV1(dto.Identification, mappedType);
            }).ToList();
        }

        var foundMeteringPoints = meteringPointsWithType
            .Select(dto => dto.MeteringPointId)
            .ToHashSet();

        foreach (var meteringPoint in meteringPointIds)
        {
            if (!foundMeteringPoints.Contains(meteringPoint))
            {
                var errorMessages = $"Specified metering point was not found: {meteringPoint}.";
                var errorDescriptor = new
                {
                    message = errorMessages,
                    code = "market_participant.validation.additional_recipient.metering_point_missing",
                    args = new
                    {
                        metering_point = meteringPoint,
                    },
                };

                var errorPayload = JsonSerializer.Serialize(new { errors = new[] { errorDescriptor } });
                throw new ApiException(errorMessages, 400, errorPayload, new Dictionary<string, IEnumerable<string>>(), null);
            }
        }

        var mappedMeteringPoints = meteringPointsWithType.Select(mp =>
        {
            var type = mp.Type switch
            {
                SharedMeteringPointType.Consumption => Clients.MarketParticipant.v1.MeteringPointType.E17Consumption,
                SharedMeteringPointType.Production => Clients.MarketParticipant.v1.MeteringPointType.E18Production,
                SharedMeteringPointType.Exchange => Clients.MarketParticipant.v1.MeteringPointType.E20Exchange,
                SharedMeteringPointType.VEProduction => Clients.MarketParticipant.v1.MeteringPointType.D01VeProduction,
                SharedMeteringPointType.Analysis => Clients.MarketParticipant.v1.MeteringPointType.D02Analysis,
                SharedMeteringPointType.NotUsed => Clients.MarketParticipant.v1.MeteringPointType.D03NotUsed,
                SharedMeteringPointType.SurplusProductionGroup6 => Clients.MarketParticipant.v1.MeteringPointType.D04SurplusProductionGroup6,
                SharedMeteringPointType.NetProduction => Clients.MarketParticipant.v1.MeteringPointType.D05NetProduction,
                SharedMeteringPointType.SupplyToGrid => Clients.MarketParticipant.v1.MeteringPointType.D06SupplyToGrid,
                SharedMeteringPointType.ConsumptionFromGrid => Clients.MarketParticipant.v1.MeteringPointType.D07ConsumptionFromGrid,
                SharedMeteringPointType.WholesaleServicesOrInformation => Clients.MarketParticipant.v1.MeteringPointType.D08WholeSaleServicesInformation,
                SharedMeteringPointType.OwnProduction => Clients.MarketParticipant.v1.MeteringPointType.D09OwnProduction,
                SharedMeteringPointType.NetFromGrid => Clients.MarketParticipant.v1.MeteringPointType.D10NetFromGrid,
                SharedMeteringPointType.NetToGrid => Clients.MarketParticipant.v1.MeteringPointType.D11NetToGrid,
                SharedMeteringPointType.TotalConsumption => Clients.MarketParticipant.v1.MeteringPointType.D12TotalConsumption,
                SharedMeteringPointType.NetLossCorrection => Clients.MarketParticipant.v1.MeteringPointType.D13NetLossCorrection,
                SharedMeteringPointType.ElectricalHeating => Clients.MarketParticipant.v1.MeteringPointType.D14ElectricalHeating,
                SharedMeteringPointType.NetConsumption => Clients.MarketParticipant.v1.MeteringPointType.D15NetConsumption,
                SharedMeteringPointType.OtherConsumption => Clients.MarketParticipant.v1.MeteringPointType.D17OtherConsumption,
                SharedMeteringPointType.OtherProduction => Clients.MarketParticipant.v1.MeteringPointType.D18OtherProduction,
                SharedMeteringPointType.ExchangeReactiveEnergy => Clients.MarketParticipant.v1.MeteringPointType.D20ExchangeReactiveEnergy,
                SharedMeteringPointType.InternalUse => Clients.MarketParticipant.v1.MeteringPointType.D99InternalUse,
                _ => Clients.MarketParticipant.v1.MeteringPointType.Unknown,
            };

            return new MeteringPointDto { Identification = mp.MeteringPointId, MeteringPointType = type };
        });

        await marketParticipantClient
            .AdditionalRecipientsPostAsync(marketParticipantId, mappedMeteringPoints, ct)
            .ConfigureAwait(false);

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> RemoveMeteringPointsFromAdditionalRecipientAsync(
        Guid marketParticipantId,
        IEnumerable<string> meteringPointIds,
        [Service] IMarketParticipantClient_V1 marketParticipantClient,
        CancellationToken ct)
    {
        await marketParticipantClient
            .AdditionalRecipientsDeleteAsync(marketParticipantId, meteringPointIds, ct)
            .ConfigureAwait(false);

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> MergeMarketParticipantsAsync(
            Guid survivingEntity,
            Guid discontinuedEntity,
            DateTimeOffset mergeDate,
            [Service] IMarketParticipantClient_V1 client)
    {
        await client
            .ActorConsolidateAsync(
                discontinuedEntity,
                new ConsolidationRequestDto { ConsolidateAt = mergeDate, ToActorId = survivingEntity })
            .ConfigureAwait(false);

        return true;
    }
}
