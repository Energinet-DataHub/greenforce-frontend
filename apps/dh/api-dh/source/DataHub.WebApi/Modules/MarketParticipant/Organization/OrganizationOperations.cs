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
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Organization.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Organization;

[ObjectType<OrganizationDto>]
public static partial class OrganizationOperations
{
    [Query]
    public static async Task<OrganizationDto> GetOrganizationByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationGetAsync(id);

    [Query]
    public static async Task<IEnumerable<OrganizationDto>> GetOrganizationsAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationGetAsync();

    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<OrganizationDto>> GetPaginatedOrganizationsAsync(
        string? filter,
        [Service] IMarketParticipantClient_V1 client)
    {
        var response = await client.OrganizationGetAsync();

        if (string.IsNullOrEmpty(filter))
        {
            return response;
        }

        return response.Where(o =>
            o.Name.Contains(filter, StringComparison.CurrentCultureIgnoreCase) ||
            o.BusinessRegisterIdentifier.Contains(filter, StringComparison.CurrentCultureIgnoreCase));
    }

    [Query]
    public static async Task<CVROrganizationResult> SearchOrganizationInCVRAsync(
        string cvr,
        [Service] IMarketParticipantClient_V1 client)
    {
        try
        {
            using var cts = new CancellationTokenSource();
            cts.CancelAfter(15000);

            var organizationIdentity = await client.OrganizationIdentityAsync(cvr, cts.Token);

            return organizationIdentity.OrganizationFound
                ? new CVROrganizationResult(organizationIdentity.OrganizationIdentity!.Name, true)
                : new CVROrganizationResult(string.Empty, false);
        }
        catch (Exception)
        {
            return new CVROrganizationResult(string.Empty, false);
        }
    }

    [Mutation]
    [Error(typeof(ApiException))]
    public static async Task<OrganizationDto> UpdateOrganizationAsync(
        Guid orgId,
        IEnumerable<string> domains,
        [Service] IMarketParticipantClient_V1 client)
    {
        var organization = await client.OrganizationGetAsync(orgId).ConfigureAwait(false);
        if (!Enumerable.SequenceEqual(organization.Domains, domains))
        {
            var changes = new ChangeOrganizationDto()
            {
                Name = organization.Name,
                Domains = domains.ToList(),
                Status = organization.Status,
            };

            await client.OrganizationPutAsync(orgId, changes).ConfigureAwait(false);
        }

        return await client.OrganizationGetAsync(orgId).ConfigureAwait(false);
    }

    #region Computed fields on OrganizationDto
    public static async Task<IEnumerable<OrganizationAuditedChangeAuditLogDto>> GetAuditLogsAsync(
        [Parent] OrganizationDto organization,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationAuditAsync(organization.OrganizationId);

    public static async Task<IEnumerable<ActorDto>?> GetActorsAsync(
        [Parent] OrganizationDto organization,
        ActorByOrganizationBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(organization.OrganizationId.ToString());
    #endregion

    static partial void Configure(
        IObjectTypeDescriptor<OrganizationDto> descriptor)
    {
        descriptor.Name("Organization");

        descriptor
            .Field(f => f.OrganizationId)
            .Name("id");
    }
}
