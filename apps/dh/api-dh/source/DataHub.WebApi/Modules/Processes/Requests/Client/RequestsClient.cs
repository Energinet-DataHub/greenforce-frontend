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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;

public class RequestsClient(
    IHttpContextAccessor httpContextAccessor,
    IProcessManagerClient processManagerClient,
    IEdiB2CWebAppClient_V1 ediClient)
    : IRequestsClient
{
    public async Task<IEnumerable<IActorRequestQueryResult>> GetRequestsAsync(CancellationToken ct = default)
    {
        var user = httpContextAccessor.HttpContext?.User;
        ArgumentNullException.ThrowIfNull(user);

        var userIdentity = httpContextAccessor.CreateUserIdentity();

        // Admins are allowed to view all actor requests
        var canViewAllActorRequests = user.HasRole("calculations:manage");

        var customQuery = new ActorRequestQuery(
            userIdentity,
            // TODO: Either make these nullable in the custom query or pass in from the client
            DateTimeOffset.Parse("2024-01-10T11:00:00.0000000+01:00"),
            DateTimeOffset.Parse("2027-01-10T11:00:00.0000000+01:00"),
            createdByActorNumber: canViewAllActorRequests ? null : userIdentity.ActorNumber,
            createdByActorRole: canViewAllActorRequests ? null : userIdentity.ActorRole);

        return await processManagerClient.SearchOrchestrationInstancesByCustomQueryAsync(customQuery, ct);
    }

    public async Task<bool> RequestAsync(
        RequestInput input,
        CancellationToken ct)
    {
        if (input.RequestCalculatedWholesaleServices is not null)
        {
            var request = input.RequestCalculatedWholesaleServices;
            await ediClient.TempRequestWholesaleSettlementAsync(
                cancellationToken: ct,
                body: new RequestWholesaleServicesMarketDocumentV2
                {
                    BusinessReason = request.CalculationType.BusinessReason,
                    Series = [
                        new()
                        {
                            SettlementVersion = request.CalculationType.SettlementVersion,
                            StartDateAndOrTimeDateTime = request.Period.Start.ToString(),
                            EndDateAndOrTimeDateTime = request.Period.End.ToString(),
                            Resolution = "e",
                            MeteringGridAreaDomainId = "2",
                            Id = "e",
                            EnergySupplierMarketParticipantId = "e",
                            ChargeOwner = "e",
                            ChargeTypes = [new() { Id = "e", Type = "e" }],
                        }
                    ],
                });
            return await Task.FromResult(true);
        }

        return false;
    }
}
