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
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;

public static partial class ActorOperations
{
    [Query]
    public static Task<ActorDto> GetSelectedActorAsync(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IMarketParticipantClient_V1 client)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        return client.ActorGetAsync(associatedActor);
    }

    [Query]
    public static async Task<ActorDto> GetActorByIdAsync(
        Guid id,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorGetAsync(id, ct);

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetActorsAsync(
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorGetAsync(ct);

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetActorsByOrganizationIdAsync(
        Guid organizationId,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationActorAsync(organizationId, ct);

    [Query]
    public static async Task<IEnumerable<ActorDto>> GetActorsForEicFunctionAsync(
        EicFunction[]? eicFunctions,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorGetAsync(ct))
            .Where(x => eicFunctions != null && eicFunctions.Contains(x.MarketRole.EicFunction));

    [Query]
    public static async Task<AssociatedActors> GetAssociatedActorsAsync(
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
            return new AssociatedActors(email, Enumerable.Empty<Guid>());
        }

        var associatedActors = await client.UserActorsGetAsync(user.Id);

        return new AssociatedActors(email, associatedActors.ActorIds);
    }

    [Query]
    public static async Task<IEnumerable<ActorDto>> FilteredActorsAsync(
        CancellationToken ct,
        [Service] IHttpContextAccessor httpContext,
        [Service] IMarketParticipantClient_V1 client)
    {
        if (httpContext.HttpContext == null)
        {
            return Enumerable.Empty<ActorDto>();
        }

        var actors = await client.ActorGetAsync(ct);

        if (httpContext.HttpContext.User.IsFas())
        {
            return actors;
        }

        var actorId = httpContext.HttpContext.User.GetAssociatedActor();
        return actors.Where(actor => actor.ActorId == actorId);
    }

    [Query]
    public static async Task<IEnumerable<SelectionActorDto>> GetSelectionActorsAsync(
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.QuerySelectionActorsAsync(ct);

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> UpdateActorAsync(
        Guid actorId,
        string actorName,
        string departmentName,
        string departmentEmail,
        string departmentPhone,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var actor = await client.ActorGetAsync(actorId, ct).ConfigureAwait(false);
        if (!string.Equals(actor.Name.Value, actorName, StringComparison.Ordinal))
        {
            await client.ActorNameAsync(actorId, new ActorNameDto { Value = actorName }).ConfigureAwait(false);
        }

        var allContacts = await client.ActorContactGetAsync(actorId, ct).ConfigureAwait(false);
        var defaultContact = allContacts.SingleOrDefault(c => c.Category == ContactCategory.Default);
        if (defaultContact == null ||
            !string.Equals(defaultContact.Name, departmentName, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Email, departmentEmail, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Phone, departmentPhone, StringComparison.Ordinal))
        {
            if (defaultContact != null)
            {
                await client
                    .ActorContactDeleteAsync(actorId, defaultContact.ContactId, ct)
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
                .ActorContactPostAsync(actorId, newDefaultContact, ct)
                .ConfigureAwait(false);
        }

        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<bool> CreateMarketParticipantAsync(
        CreateMarketParticipantInput input,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client)
    {
        var organizationId =
            input.OrganizationId ??
            await client.OrganizationPostAsync(input.Organization!, ct).ConfigureAwait(false);

        var actorDto = new CreateActorDto()
        {
            Name = input.Actor.Name,
            ActorNumber = input.Actor.ActorNumber,
            OrganizationId = organizationId,
            MarketRole = new ActorMarketRoleDto
            {
                EicFunction = input.Actor.MarketRole.EicFunction,
                Comment = input.Actor.MarketRole.Comment,
                GridAreas = input.Actor.MarketRole.GridAreas.Select(ga => new ActorGridAreaDto()
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
    public static async Task<bool> CreateDelegationsForActorAsync(
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
        Guid actorId,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorCredentialsSecretAsync(actorId, ct);

    [Mutation]
    [Error(typeof(ApiException))]
    public static bool AddMeteringPointsToAdditionalRecipient(
        string[] meteringPointIds,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        return true;
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static bool RemoveMeteringPointsFromAdditionalRecipient(
        string[] meteringPointIds,
        [Service] IMarketParticipantClient_V1 client,
        CancellationToken ct)
    {
        return true;
    }
}
