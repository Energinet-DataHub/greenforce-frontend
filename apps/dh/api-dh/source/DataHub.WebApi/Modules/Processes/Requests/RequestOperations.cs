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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests;

public static class RequestOperations
{
    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[]
    {
        "calculations:manage",
        "request-aggregated-measured-data:view",
        "request-wholesale-settlement:view",
    })]
    public static Task<IEnumerable<IActorRequestQueryResult>> GetRequestsAsync(
        IRequestsClient client) => client.GetRequestsAsync();

    [Query]
    [Authorize(Roles = new[] { "request-aggregated-measured-data:view", "request-wholesale-settlement:view" })]
    public static async Task<RequestOptions> GetRequestOptionsAsync(
        IHttpContextAccessor httpContextAccessor,
        IMarketParticipantClient_V1 marketParticipantClient)
    {
        // TODO: Create common functionality for this use case
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        var selectedActor = await marketParticipantClient.ActorGetAsync(associatedActor);
        return new RequestOptions(user, selectedActor.MarketRole.EicFunction);
    }

    [Mutation]
    [Authorize(Roles = new[] { "request-aggregated-measured-data:view", "request-wholesale-settlement:view" })]
    public static Task<bool> RequestAsync(
        RequestInput input,
        IRequestsClient client,
        CancellationToken ct) => client.RequestAsync(input, ct);
}
