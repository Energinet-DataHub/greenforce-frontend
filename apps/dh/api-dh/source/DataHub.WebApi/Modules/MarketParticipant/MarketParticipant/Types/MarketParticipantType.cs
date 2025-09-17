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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Extensions;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Types;

[ObjectType<ActorDto>]
public static partial class MarketParticipantType
{
    #region Computed fields
    public static async Task<IEnumerable<MarketParticipantUserRole>> GetUserRolesAsync(
       Guid? userId,
       [Parent] ActorDto actor,
       [Service] IMarketParticipantClient_V1 client)
    {
        var roles = await client.ActorsRolesAsync(actor.ActorId);

        if (userId is null)
        {
            return roles.Select(r => new MarketParticipantUserRole(
                r.Id,
                r.Name,
                r.Status,
                r.Description,
                r.EicFunction,
                false));
        }

        var assignedRoles = await client.ActorsUsersRolesGetAsync(actor.ActorId, userId.Value);

        var assignmentLookup = assignedRoles
            .Select(ar => ar.Id)
            .ToHashSet();

        return roles.Select(r => new MarketParticipantUserRole(
            r.Id,
            r.Name,
            r.Status,
            r.Description,
            r.EicFunction,
            assignmentLookup.Contains(r.Id)));
    }

    public static Task<OrganizationDto> GetOrganizationAsync(
       [Parent] ActorDto actor,
       [Service] IMarketParticipantClient_V1 client) =>
       client.OrganizationGetAsync(actor.OrganizationId);

    public static async Task<ICollection<BalanceResponsibilityRelationDto>?> GetBalanceResponsibleAgreementsAsync(
       [Parent] ActorDto actor,
       [Service] IMarketParticipantClient_V1 client) =>
       await client.BalanceResponsibilityRelationsAsync(actor.ActorId);

    public static async Task<ActorCredentialsDto> GetCredentialsAsync(
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

    public static async Task<IEnumerable<ActorAuditedChangeAuditLogDto>> GetAuditLogsAsync(
        [Parent] ActorDto actor,
        CancellationToken ct,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorAuditAsync(actor.ActorId, ct)).OrderByDescending(x => x.Timestamp);

    public static async Task<IEnumerable<ProcessDelegation>> GetDelegationsAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.ActorDelegationsGetAsync(actor.ActorId))
            .Delegations.SelectMany(x => x.Periods, (delegation, period) =>
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

    public static string DisplayName(
        [Parent] ActorDto actorDto) => actorDto switch
        {
            null => string.Empty,
            var actor when string.IsNullOrWhiteSpace(actor.MarketRole.EicFunction.ToString()) => actor.Name.Value,
            var actor => $"{actor.MarketRole.EicFunction} • {actor.Name.Value}",
        };

    public static async Task<ICollection<string>> AdditionalRecipientForMeasurementsAsync(
        [Parent] ActorDto actor,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.AdditionalRecipientsGetAsync(actor.ActorId);

    public static async Task<MarketParticipantPublicMail?> GetPublicMailAsync(
        [Parent] ActorDto actor,
        IMarketParticipantPublicContactByActorIdDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var contact = await dataLoader.LoadAsync(actor.ActorId, cancellationToken);
        return contact != null ? new MarketParticipantPublicMail(contact.Email) : null;
    }

    public static Task<ActorContactDto?> GetContactAsync(
        [Parent] ActorDto actor,
        IMarketParticipantPublicContactByActorIdDataLoader dataLoader) => dataLoader.LoadAsync(actor.ActorId);
    #endregion

    static partial void Configure(IObjectTypeDescriptor<ActorDto> descriptor)
    {
        descriptor
            .Name("MarketParticipant")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.ActorId).Name("id");
        descriptor.Field(f => f.Name.Value).Name("name");

        descriptor.Field(f => f.GetStatus()).Name("status");

        descriptor
            .Ignore(f => f.ActorNumber)
            .Field(f => f.ActorNumber.Value)
            .Name("glnOrEicNumber");

        descriptor
            .Field(f => f.MarketRole)
            .Name("marketRole")
            .Resolve(context => context.Parent<ActorDto>().MarketRole.EicFunction);
    }
}
