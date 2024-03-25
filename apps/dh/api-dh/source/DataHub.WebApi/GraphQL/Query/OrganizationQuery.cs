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

namespace Energinet.DataHub.WebApi.GraphQL;

public partial class Query
{
    public async Task<IEnumerable<OrganizationAuditedChangeAuditLogDto>> GetOrganizationAuditLogsAsync(
        Guid organizationId,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationAuditAsync(organizationId);

    public async Task<OrganizationDto> GetOrganizationByIdAsync(
        Guid id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationGetAsync(id);

    public async Task<ICollection<OrganizationDto>> GetOrganizationsAsync(
        [Service] IMarketParticipantClient_V1 client) =>
        await client.OrganizationGetAsync();

    public async Task<CVROrganizationResult> SearchOrganizationInCVRAsync(
        string cvr,
        [Service] IMarketParticipantClient_V1 client)
    {
        try
        {
            using var cts = new CancellationTokenSource();
            cts.CancelAfter(15000);

            var organizationIdentity = await client.OrganizationIdentityAsync(cvr, cts.Token);

            return organizationIdentity.OrganizationFound
                ? new CVROrganizationResult
                {
                    HasResult = true,
                    Name = organizationIdentity.OrganizationIdentity!.Name,
                }
                : new CVROrganizationResult
                {
                    HasResult = false,
                };
        }
        catch (Exception)
        {
            return new CVROrganizationResult
            {
                HasResult = false,
            };
        }
    }
}
