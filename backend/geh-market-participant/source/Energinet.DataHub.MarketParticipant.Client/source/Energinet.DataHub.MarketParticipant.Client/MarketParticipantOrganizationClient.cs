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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Flurl.Http;

namespace Energinet.DataHub.MarketParticipant.Client
{
    public sealed class MarketParticipantOrganizationClient : IMarketParticipantOrganizationClient
    {
        private const string OrganizationsBaseUrl = "Organization";

        private readonly IFlurlClient _httpClient;

        public MarketParticipantOrganizationClient(IFlurlClient client)
        {
            _httpClient = client;
        }

        public async Task<IEnumerable<OrganizationDto>> GetOrganizationsAsync()
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(OrganizationsBaseUrl).GetAsync()).ConfigureAwait(false);

            var listAllOrganizationsResult = await response
                .GetJsonAsync<IEnumerable<OrganizationDto>>()
                .ConfigureAwait(false);

            return listAllOrganizationsResult;
        }

        public async Task<OrganizationDto> GetOrganizationAsync(Guid organizationId)
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(OrganizationsBaseUrl, organizationId).GetAsync())
                 .ConfigureAwait(false);

            var singleOrganizationsResult = await response
                .GetJsonAsync<OrganizationDto>()
                .ConfigureAwait(false);

            return singleOrganizationsResult;
        }

        public async Task<Guid> CreateOrganizationAsync(CreateOrganizationDto organizationDto)
        {
            var response = await ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(OrganizationsBaseUrl).PostJsonAsync(organizationDto))
                .ConfigureAwait(false);

            var orgId = await response
                .GetStringAsync()
                .ConfigureAwait(false);

            return Guid.Parse(orgId);
        }

        public Task UpdateOrganizationAsync(Guid organizationId, ChangeOrganizationDto organizationDto)
        {
            return ValidationExceptionHandler
                .HandleAsync(
                    () => _httpClient.Request(OrganizationsBaseUrl, organizationId)
                .PutJsonAsync(organizationDto));
        }
    }
}
