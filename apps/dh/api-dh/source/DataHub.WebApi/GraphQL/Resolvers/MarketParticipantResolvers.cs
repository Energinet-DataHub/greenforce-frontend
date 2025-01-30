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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Actor;
using Energinet.DataHub.WebApi.GraphQL.Types.Process;

namespace Energinet.DataHub.WebApi.GraphQL.Resolvers;

public class MarketParticipantResolvers
{
    public Task<ICollection<UserRoleDto>> GetAssignedPermissionAsync(
        [Parent] PermissionDto permission,
        [Service] IMarketParticipantClient_V1 client) =>
        client.UserRolesAssignedtopermissionAsync(permission.Id);

    public async Task<ActorContactDto?> GetContactAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client)
    {
        var allContacts = await client
            .ActorContactsPublicAsync()
            .ConfigureAwait(false);

        return allContacts.SingleOrDefault(c => c.ActorId == actor.ActorId);
    }

    public async Task<ActorStatus> GetStatusAsync(
        [Parent] ActorDto actor,
        ConsolidationByActorFromIdBatchLoader dataLoader)
    {
        var actorConsolidation = await dataLoader.LoadAsync(actor.ActorId).ConfigureAwait(false);

        if (actorConsolidation is null)
        {
            return Enum.Parse<ActorStatus>(actor.Status);
        }

        if (actorConsolidation.ConsolidateAt < DateTimeOffset.UtcNow)
        {
            return ActorStatus.Discontinued;
        }

        return ActorStatus.ToBeDiscontinued;
    }

    public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] ActorDto actor,
        GridAreaByIdBatchDataLoader dataLoader)
    {
        var gridAreas = await Task.WhenAll(
            actor.MarketRole.GridAreas.Select(gridArea => gridArea.Id)
                .Select(gridAreaId => dataLoader.LoadRequiredAsync(gridAreaId)));

        return gridAreas.OrderBy(g => g.Code);
    }

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ProcessDelegation result,
        GridAreaByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaId).ConfigureAwait(false);

    public async Task<GridAreaDto?> GetGridAreaForBalanceResponsibilityRelationAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        GridAreaByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaId).ConfigureAwait(false);

    public async Task<ActorDto?> GetActorDelegatedByAsync(
        [Parent] ProcessDelegation actor,
        ActorByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(actor.DelegatedBy);

    public async Task<ActorDto?> GetActorDelegatedToAsync(
        [Parent] ProcessDelegation actor,
        ActorByIdBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(actor.DelegatedTo);

    public Task<OrganizationDto> GetOrganizationAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client) =>
        client.OrganizationGetAsync(actor.OrganizationId);

    public async Task<List<ActorDto>?> GetActorsForOrganizationAsync(
        [Parent] OrganizationDto organization,
        ActorByOrganizationBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(organization.OrganizationId.ToString());

    public async Task<IEnumerable<ActorDto>?> GetActorByUserIdAsync(
        [Parent] IUser user,
        [Service] IMarketParticipantClient_V1 client) =>
        await Task.WhenAll((
                await client.UserActorsGetAsync(user.Id)).ActorIds
            .Select(async id => await client.ActorGetAsync(id)));

    public async Task<ICollection<BalanceResponsibilityRelationDto>?> GetBalanceResponsibleAgreementsAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.BalanceResponsibilityRelationsAsync(actor.ActorId);

    public Task<ActorNameWithId?> GetBalanceResponsibleWithNameAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        ActorNameByIdBatchDataLoader dataLoader) =>
        dataLoader.LoadAsync(result.BalanceResponsibleId);

    public Task<ActorNameWithId?> GetEnergySupplierWithNameAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        ActorNameByIdBatchDataLoader dataLoader) =>
        dataLoader.LoadAsync(result.EnergySupplierId);

    public async Task<ActorCredentialsDto?> GetActorCredentialsAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client)
    {
        try
        {
            return await client.ActorCredentialsGetAsync(actor.ActorId);
        }
        catch
        {
            return new ActorCredentialsDto();
        }
    }

    public async Task<ActorDto?> GetAdministratedByAsync(
        [Parent] IUser user,
        [Service] IMarketParticipantClient_V1 client) =>
            await client.ActorGetAsync(user.AdministratedBy);

    public async Task<ActorPublicMail?> GetActorPublicMailAsync(
        [Parent] ActorDto actor,
        ActorPublicContactByActorId dataLoader)
    {
        var publicContact = await dataLoader.LoadAsync(actor.ActorId);
        return publicContact != null ? new ActorPublicMail(publicContact.Email) : null;
    }

    public Task<ActorContactDto?> GetActorPublicContactAsync(
        [Parent] ActorDto actor,
        ActorPublicContactByActorId dataLoader) => dataLoader.LoadAsync(actor.ActorId);

    public async Task<IEnumerable<ActorUserRole>> GetActorsRolesAsync(
        [Parent] ActorDto actor,
        [ScopedState] IUser? user,
        [Service] IMarketParticipantClient_V1 client)
    {
        var roles = await client.ActorsRolesAsync(actor.ActorId);

        if (user is null)
        {
            return roles.Select(r => new ActorUserRole(
                r.Id,
                r.Name,
                r.Status,
                r.Description,
                r.EicFunction,
                false));
        }

        var assignedRoles = await client
                    .ActorsUsersRolesGetAsync(actor.ActorId, user.Id)
                    .ConfigureAwait(false);

        var assignmentLookup = assignedRoles
            .Select(ar => ar.Id)
            .ToHashSet();

        return roles.Select(r => new ActorUserRole(
            r.Id,
            r.Name,
            r.Status,
            r.Description,
            r.EicFunction,
            assignmentLookup.Contains(r.Id)));
    }

    public string? GetPermissionRelationsUrl(
    [Service] IHttpContextAccessor httpContextAccessor,
    [Service] LinkGenerator linkGenerator) =>
        linkGenerator.GetUriByAction(
            httpContextAccessor.HttpContext!,
            "GetPermissionRelations",
            "MarketParticipantPermissions");

    public async Task<string> GetIdentityDisplayNameByUserIdAsync(
        [Parent] ManuallyHandledExchangeEventMetaData parent,
        [Service] AuditIdentityCacheDataLoader client) =>
        (await client.LoadRequiredAsync(parent.ManuallyHandledBy)).DisplayName;
}
