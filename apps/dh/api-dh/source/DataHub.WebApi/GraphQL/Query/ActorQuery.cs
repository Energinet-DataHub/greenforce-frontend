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
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL;

public partial class Query
{
    public async Task<IEnumerable<ActorAuditedChangeAuditLogDto>> GetActorAuditLogsAsync(
        Guid actorId,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorAuditAsync(actorId);

    public Task<ActorDto> GetSelectedActorAsync(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IMarketParticipantClient_V1 client)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        return client.ActorGetAsync(associatedActor);
    }

    public Task<ActorDto> GetActorByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        client.ActorGetAsync(id);

    public async Task<IEnumerable<ActorDto>> GetActorsAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.ActorGetAsync();

    public async Task<IEnumerable<ActorDto>> GetActorsByOrganizationIdAsync(
        Guid organizationId,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationActorAsync(organizationId);

    public async Task<IEnumerable<ActorDto>> GetActorsForEicFunctionAsync(
        EicFunction[]? eicFunctions,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorGetAsync())
            .Where(x =>
                x.MarketRoles.Any(y =>
                    eicFunctions != null && eicFunctions.Contains(y.EicFunction)));

    public async Task<IEnumerable<ProcessDelegation>> GetDelegationsForActorAsync(
        Guid actorId,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorDelegationGetAsync(actorId))
            .Delegations
            .SelectMany(x => x.Periods, (delegation, period) =>
            {
                var startInstant = Instant.FromDateTimeOffset(period.StartsAt);
                return new ProcessDelegation
                {
                    DelegatedBy = delegation.DelegatedBy,
                    Process = delegation.Process,
                    Id = delegation.Id,
                    PeriodId = period.Id,
                    DelegatedTo = period.DelegatedTo,
                    GridAreaId = period.GridAreaId,
                    ValidPeriod = new Interval(
                        startInstant,
                        period.StopsAt != null ? Instant.Max(Instant.FromDateTimeOffset(period.StopsAt.Value), startInstant) : null),
                };
            });

    public async Task<AssociatedActors> GetAssociatedActorsAsync(
        string email,
        [Service] IMarketParticipantClient_V1 client)
    {
        var user = (await client.GetUserOverviewAsync())
            .Users
            .FirstOrDefault(x => string.Equals(email, x.Email, StringComparison.OrdinalIgnoreCase));

        if (user is null)
        {
            return new AssociatedActors { Email = email };
        }

        var associatedActors = await client.UserActorsGetAsync(user.Id);

        return new AssociatedActors
        {
            Email = email,
            Actors = associatedActors.ActorIds,
        };
    }
}
