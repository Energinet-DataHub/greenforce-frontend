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
using Energinet.DataHub.WebApi.GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    [Error(typeof(ApiException))]
    public async Task<bool> UpdateActorAsync(
        Guid actorId,
        string actorName,
        string departmentName,
        string departmentEmail,
        string departmentPhone,
        [Service] IMarketParticipantClient_V1 client)
    {
        var actor = await client.ActorGetAsync(actorId).ConfigureAwait(false);
        if (!string.Equals(actor.Name.Value, actorName, StringComparison.Ordinal))
        {
            await client.ActorNameAsync(actorId, new ActorNameDto { Value = actorName }).ConfigureAwait(false);
        }

        var allContacts = await client.ActorContactGetAsync(actorId).ConfigureAwait(false);
        var defaultContact = allContacts.SingleOrDefault(c => c.Category == ContactCategory.Default);
        if (defaultContact == null ||
            !string.Equals(defaultContact.Name, departmentName, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Email, departmentEmail, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Phone, departmentPhone, StringComparison.Ordinal))
        {
            if (defaultContact != null)
            {
                await client
                    .ActorContactDeleteAsync(actorId, defaultContact.ContactId)
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
                .ActorContactPostAsync(actorId, newDefaultContact)
                .ConfigureAwait(false);
        }

        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> CreateMarketParticipantAsync(
            CreateMarketParticipantInput input,
            [Service] IMarketParticipantClient_V1 client)
    {
        var organizationId =
            input.OrganizationId ??
            await client.OrganizationPostAsync(input.Organization!).ConfigureAwait(false);

        var gridAreas = await client.GridAreaGetAsync().ConfigureAwait(false);

        var actorDto = new CreateActorDto()
        {
            Name = input.Actor.Name,
            ActorNumber = input.Actor.ActorNumber,
            OrganizationId = organizationId,
            MarketRoles = input.Actor.MarketRoles.Select(mr => new ActorMarketRoleDto
            {
                EicFunction = mr.EicFunction,
                GridAreas = mr.GridAreas.Select(ga => new ActorGridAreaDto()
                {
                    MeteringPointTypes = ga.MeteringPointTypes,
                    Id = gridAreas.Single(g => g.Code == ga.Code).Id,
                }).ToList(),
                Comment = mr.Comment,
            }).ToList(),
        };

        var actorId = await client
            .ActorPostAsync(actorDto)
            .ConfigureAwait(false);

        await client
            .ActorContactPostAsync(actorId, input.ActorContact)
            .ConfigureAwait(false);

        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> CreateDelegationsForActorAsync(
        Guid actorId,
        CreateProcessDelegationsInput delegations,
        [Service] IMarketParticipantClient_V1 client)
    {
        var gridAreas = await client.GridAreaGetAsync().ConfigureAwait(false);
        await client.ActorDelegationPostAsync(new CreateProcessDelegationsDto
        {
            DelegatedFrom = delegations.DelegatedFrom,
            DelegatedTo = delegations.DelegatedTo,
            GridAreas = delegations.GridAreas.Select(ga => gridAreas.Single(g => g.Code == ga).Id).ToList(),
            DelegatedProcesses = delegations.DelegatedProcesses,
            StartsAt = delegations.StartsAt,
        });
        return true;
    }

    [Error(typeof(ApiException))]
    public async Task<bool> StopDelegationAsync(
        IEnumerable<StopProcessDelegationDto> stopMessageDelegationDto,
        [Service] IMarketParticipantClient_V1 client)
    {
        foreach (var dto in stopMessageDelegationDto)
        {
            await client.ActorDelegationPutAsync(dto);
        }

        return true;
    }
}
